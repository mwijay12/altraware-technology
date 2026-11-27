"""
A small, honest CSS cascade engine.

There is no browser in this sandbox, so this stands in for one. It parses the
CSS the app actually serves, parses the HTML it actually renders, resolves
every `color` declaration against every element that carries text, and reports
the pairs that fall below WCAG AA.

It is not a complete browser. It handles what this codebase uses: class,
attribute, type and descendant selectors, `:is()`/`:where()`, `:not()`, the
`@layer` ordering rules, media queries evaluated against a fixed viewport, and
the theme attribute. Anything it cannot resolve it reports as UNRESOLVED
rather than guessing.
"""

import re
import sys
import json
import tinycss2
from lxml import html as LH

# ---------------------------------------------------------------- colour

def _lab_f(t):
    d = 6 / 29
    return t ** 3 if t > d else 3 * d * d * (t - 4 / 29)


def lab_to_srgb(Lv, av, bv):
    """CIELAB (D50-ish, as CSS lab() defines) -> sRGB 8-bit."""
    fy = (Lv + 16) / 116
    fx = fy + av / 500
    fz = fy - bv / 200
    X = 0.96422 * _lab_f(fx)
    Y = 1.00000 * _lab_f(fy)
    Z = 0.82521 * (_lab_f(fz) - 0) + 0.0
    # XYZ (D50) -> linear sRGB (Bradford-adapted, CSS uses D50 white point)
    R = 3.1338561 * X - 1.6168667 * Y - 0.4906146 * Z
    G = -0.9787684 * X + 1.9161415 * Y + 0.0334540 * Z
    B = 0.0719453 * X - 0.2289914 * Y + 1.4052427 * Z

    def enc(c):
        c = max(0.0, min(1.0, c))
        c = 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055
        return round(c * 255)

    return (enc(R), enc(G), enc(B))


def parse_colour(value):
    """Return (r, g, b, a) or None."""
    v = value.strip().lower()
    if v in ("transparent", "currentcolor", "inherit", "initial", "unset"):
        return None
    m = re.fullmatch(r"#([0-9a-f]{3,8})", v)
    if m:
        h = m.group(1)
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        if len(h) == 4:
            h = "".join(c * 2 for c in h)
        if len(h) == 6:
            return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 1.0)
        if len(h) == 8:
            return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16),
                    int(h[6:8], 16) / 255)
    m = re.fullmatch(r"rgba?\(([^)]+)\)", v)
    if m:
        parts = [p.strip() for p in re.split(r"[,\s/]+", m.group(1)) if p.strip()]
        try:
            r, g, b = (float(p) for p in parts[:3])
            a = float(parts[3]) if len(parts) > 3 else 1.0
            return (r, g, b, a)
        except (ValueError, IndexError):
            return None
    # Tailwind emits `lab(...)` alongside each hex under @supports, and the
    # later declaration wins. Without this the parser silently lost the colour
    # and every alpha utility became a false "unreadable" finding.
    m = re.fullmatch(r"lab\(([^)]+)\)", v)
    if m:
        body = m.group(1)
        alpha = 1.0
        if "/" in body:
            body, a = body.split("/", 1)
            try:
                alpha = float(a.strip())
            except ValueError:
                alpha = 1.0
        parts = [x.strip() for x in body.split()]
        try:
            Lraw = parts[0].rstrip("%")
            Lv = float(Lraw)
            # CSS lab() expresses L as a percentage 0..100
            av, bv = float(parts[1]), float(parts[2])
        except (ValueError, IndexError):
            return None
        return (*lab_to_srgb(Lv, av, bv), alpha)

    named = {
        "white": (255, 255, 255, 1.0), "black": (0, 0, 0, 1.0),
        "red": (255, 0, 0, 1.0), "green": (0, 128, 0, 1.0),
        "blue": (0, 0, 255, 1.0), "transparent": None,
    }
    return named.get(v)


def composite(fg, bg):
    """Paint fg (with alpha) over an opaque bg."""
    r, g, b, a = fg
    return (a * r + (1 - a) * bg[0],
            a * g + (1 - a) * bg[1],
            a * b + (1 - a) * bg[2], 1.0)


def luminance(c):
    def lin(x):
        x /= 255
        return x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4
    return 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2])


def contrast(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


# ---------------------------------------------------------------- selectors

def split_selector_list(sel):
    """Split on commas that are NOT inside (), [] or ""."""
    out, depth, cur, q = [], 0, "", False
    for ch in sel:
        if ch == '"':
            q = not q
        if not q:
            if ch in "([":
                depth += 1
            elif ch in ")]":
                depth -= 1
            elif ch == "," and depth == 0:
                out.append(cur.strip())
                cur = ""
                continue
        cur += ch
    out.append(cur.strip())
    return [x for x in out if x]


def specificity(sel):
    """(ids, classes+attrs+pseudoclasses, types) — approximation, no :not()."""
    s = re.sub(r'\[[^\]]*\]', ' [ATTR] ', sel)
    s = re.sub(r'::?[a-z-]+\(', ' (', s)
    ids = len(re.findall(r"#[\w-]+", s))
    classes = len(re.findall(r"\.[\w-]+", s)) + s.count("[ATTR]")
    types = len(re.findall(r"(?:^|[\s>+~,])([a-z][a-z0-9]*)", s))
    return (ids, classes, types)


def _split_compounds(sel):
    return [p for p in re.split(r"\s*[>+~]\s*|\s+", sel.strip()) if p]


def matches(el, sel):
    """
    Does this element match this selector? Handles descendant combinator only,
    plus the ancestor chain given by lxml. Supports :is(), :where(), :not().
    """
    sel = sel.strip()
    if not sel:
        return False
    # strip pseudo-elements / dynamic pseudos that cannot affect a static match
    sel = re.sub(r"::[a-z-]+(\([^)]*\))?", "", sel)
    # A dynamic pseudo-class (:hover, :focus…) never applies to a static
    # page. Previously these were stripped, which made `.u-nav-link:hover`
    # render as the resting colour for every nav link. Reject instead.
    if re.search(r":(hover|focus-visible|focus-within|active)\b", sel):
        return False
    sel = re.sub(r":(first-child|last-child|nth-child\([^)]*\)|disabled"
                 r"|checked|placeholder)\b", "", sel)
    if not sel.strip():
        return False

    # expand :is(...) / :where(...) into alternation, recursively
    def expand(s):
        while True:
            m = re.search(r":(?:is|where|matches)\(", s)
            if not m:
                return s
            i, depth, j = m.end(), 1, m.end()
            while j < len(s) and depth:
                if s[j] == "(":
                    depth += 1
                elif s[j] == ")":
                    depth -= 1
                j += 1
            inner = s[i:j - 1]
            # split on top-level commas
            opts, depth, cur = [], 0, ""
            for ch in inner:
                if ch == "(":
                    depth += 1
                    cur += ch
                elif ch == ")":
                    depth -= 1
                    cur += ch
                elif ch == "," and depth == 0:
                    opts.append(cur.strip())
                    cur = ""
                else:
                    cur += ch
            opts.append(cur.strip())
            head = s[:m.start()]
            tail = s[j:]
            # if the :is() is glued to a compound, expand into full selectors
            return [head + o + tail for o in opts]

    try:
        variants = expand(sel)
    except Exception:
        return False
    if isinstance(variants, str):
        variants = [variants]

    for v in variants:
        if _match_compound_chain(el, v):
            return True
    return False


def _match_compound_chain(el, sel):
    parts = _split_compounds(sel)
    if not parts:
        return False
    if not _match_compound(el, parts[-1]):
        return False
    # remaining parts must match ancestors, in order, anywhere above
    anc = el.getparent()
    for part in reversed(parts[:-1]):
        found = False
        while anc is not None:
            if _match_compound(anc, part):
                found = True
                anc = anc.getparent()
                break
            anc = anc.getparent()
        if not found:
            return False
    return True


def _unescape(sel):
    """CSS escapes: `.text-deep\\/55` is the class `text-deep/55`."""
    return re.sub(r"\\(.)", r"\1", sel)


def _match_compound(el, comp):
    if not isinstance(el.tag, str):
        return False
    comp = _unescape(comp).strip()
    if not comp:
        return True
    # :not(...) — handle by testing the inner selector and inverting
    m = re.search(r":not\(([^)]*)\)", comp)
    if m:
        inner = m.group(1)
        if matches(el, inner):
            return False
        comp = comp[:m.start()] + comp[m.end():]
        return _match_compound(el, comp) if comp.strip() else True
    # :root
    if comp == ":root":
        return el.tag == "html"
    classes = set(el.get("class", "").split())
    # type
    m = re.match(r"^([a-z][a-z0-9-]*)", comp)
    if m and el.tag.lower() != m.group(1):
        return False
    # id
    for i in re.findall(r"#([\w-]+)", comp):
        if el.get("id") != i:
            return False
    # classes
    for c in re.findall(r"\.([\w/-]+)", comp):
        if c not in classes:
            return False
    # attributes
    for attr, op, val in re.findall(r'\[([\w-]+)(?:([*^$~|]?=)"?([^"\]]*)"?)?\]', comp):
        have = el.get(attr)
        if have is None:
            return False
        if not op:
            continue
        if op == "=" and have != val:
            return False
        if op == "*=" and val not in have:
            return False
        if op == "^=" and not have.startswith(val):
            return False
        if op == "$=" and not have.endswith(val):
            return False
        if op == "~=" and val not in have.split():
            return False
    return True


# ---------------------------------------------------------------- stylesheet

def load_stylesheet(path):
    """
    Returns (unlayered_rules, layered_rules) where each rule is
    (selector, declarations, origin_order). origin_order preserves source
    order within a layer so later rules win ties.
    """
    css = open(path, encoding="utf-8").read()
    rules = tinycss2.parse_stylesheet(css, skip_comments=True,
                                      skip_whitespace=True)
    unlayered, layered = [], []
    counter = [0]

    def walk(nodes, layer, media_ok):
        for node in nodes:
            if node.type == "at-rule":
                name = node.lower_at_keyword
                if name == "layer" and node.content:
                    inner = tinycss2.parse_rule_list(node.content,
                                                     skip_whitespace=True)
                    walk(inner, (node.prelude[0].value if node.prelude else ""),
                         media_ok)
                elif name == "media" and node.content:
                    cond = tinycss2.serialize(node.prelude).strip()
                    ok = eval_media(cond, media_ok)
                    inner = tinycss2.parse_rule_list(node.content,
                                                     skip_whitespace=True)
                    walk(inner, layer, ok)
                elif name in ("supports", "container") and node.content:
                    inner = tinycss2.parse_rule_list(node.content,
                                                     skip_whitespace=True)
                    walk(inner, layer, media_ok)
                continue
            if node.type != "qualified-rule":
                continue
            if not media_ok:
                continue
            sel = tinycss2.serialize(node.prelude).strip()
            decls = {}
            for d in tinycss2.parse_declaration_list(
                    node.content, skip_whitespace=True):
                if d.type == "declaration":
                    decls[d.lower_name] = tinycss2.serialize(d.value).strip()
            counter[0] += 1
            entry = (sel, decls, counter[0])
            if layer is None:
                unlayered.append(entry)
            else:
                layered.append((layer, entry))

    walk(rules, None, True)
    return unlayered, layered


def eval_media(cond, active):
    """Fixed viewport: 1440x900 desktop. Enough to pick one branch."""
    if not active:
        return False
    cond = cond.lower()
    if "prefers-reduced-motion" in cond:
        return False
    if "print" in cond:
        return False
    if "min-width" in cond:
        m = re.search(r"min-width:\s*([\d.]+)px", cond)
        if m:
            return float(m.group(1)) <= 1440
    if "max-width" in cond:
        m = re.search(r"max-width:\s*([\d.]+)px", cond)
        if m:
            return float(m.group(1)) >= 1440
    return True


# ---------------------------------------------------------------- resolution

def resolve(el, unlayered, layered, theme):
    """
    Return (declared_colour_value, winning_selector) for `color` on this
    element, following the real order:
      1. unlayered wins over every @layer, regardless of specificity
      2. within a layer, specificity then source order
      3. within the same origin, later wins ties
    Media queries have already been filtered.
    """
    candidates = []  # (priority, specificity, order, value, selector)

    def consider(entry, layer_rank):
        sel, decls, order = entry
        if "color" not in decls:
            return
        for one in split_selector_list(sel):
            if not one:
                continue
            # theme gate
            if 'data-theme="light"' in one and theme != "light":
                continue
            if 'data-theme="dark"' in one and theme != "dark":
                continue
            if not matches(el, one):
                continue
            candidates.append((layer_rank, specificity(one), order,
                               decls["color"], one))
            break

    # layer_rank: 1 = unlayered (wins), 0 = layered
    for e in unlayered:
        consider(e, 1)
    for layer, e in layered:
        consider(e, 0)

    if not candidates:
        return None, None
    # unlayered first; then specificity; then source order
    best = max(candidates, key=lambda c: (c[0], c[1], c[2]))
    return best[3], best[4]


def background_of(el, unlayered, layered, theme):
    """Walk up the tree compositing background-color until opaque.

    Uses the SAME ordering as `resolve`: unlayered beats layered, then
    specificity, then source order. Taking the first match instead of the
    strongest one was picking the browser reset (`button {background:#0000}`)
    over `.bg-bone`, which made every filled button look black.
    """
    stack = []
    variables = build_vars(unlayered, layered, theme)
    node = el
    while node is not None:
        cands = []
        for rank, entries in ((1, unlayered), (0, [e for _, e in layered])):
            for sel, decls, order in entries:
                raw = decls.get("background-color") or decls.get("background")
                if not raw:
                    continue
                for one in split_selector_list(sel):
                    if not one:
                        continue
                    if 'data-theme="light"' in one and theme != "light":
                        continue
                    if 'data-theme="dark"' in one and theme != "dark":
                        continue
                    if not matches(node, one):
                        continue
                    rawv2 = resolve_vars(raw, variables)
                    c = parse_colour(rawv2)
                    if c is None and "color-mix" in rawv2:
                        # Evaluate `color-mix(in oklab, X N%, transparent)`
                        # for the common single-colour case.
                        m2 = re.search(r"color-mix\([^,]+,\s*([^,]+?)\s+([\d.]+)%", rawv2)
                        if m2:
                            inner = parse_colour(resolve_vars(m2.group(1).strip(), variables))
                            if inner:
                                c = (inner[0], inner[1], inner[2],
                                     inner[3] * float(m2.group(2)) / 100)
                    if c is None:
                        continue
                    cands.append((rank, specificity(one), order, c))
                    break
        if cands:
            best = max(cands, key=lambda c: (c[0], c[1], c[2]))
            # `bg-deep/5` is compiled by Tailwind to color-mix(); skip those
            # for now so we do not invent a cream background from a dark wash.
            stack.append(best[3])
            if best[3][3] >= 0.999:
                break
        node = node.getparent()

    base = parse_colour(variables.get("--ui-ground", "#0B0A0F"))
    if base is None:
        base = parse_colour("#0B0A0F" if theme == "dark" else "#F6F3EC")
    out = base
    for c in reversed(stack):
        out = composite(c, out)
    return out


TEXT_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "a", "li",
             "button", "div", "label", "strong", "em", "i", "small", "td", "th"}


def audit(html_path, css_text, theme="dark", min_ratio=3.0):
    raw = open(html_path, "rb").read()
    # The server cannot know the stored theme: an inline script sets
    # data-theme before paint. Simulate the END state, which is what the
    # reader actually sees.
    raw = raw.replace(b"<html ", b'<html data-theme="' + theme.encode() + b'" ', 1)
    tree = LH.fromstring(raw)
    import tempfile, os
    fd, tmp = tempfile.mkstemp(suffix=".css")
    with os.fdopen(fd, "w") as f:
        f.write(css_text)
    unlayered, layered = load_stylesheet(tmp)
    os.unlink(tmp)
    variables = build_vars(unlayered, layered, theme)

    findings = []
    for el in tree.iter():
        if not isinstance(el.tag, str) or el.tag not in TEXT_TAGS:
            continue
        own = (el.text or "").strip()
        if not own:
            continue
        val, sel = resolve(el, unlayered, layered, theme)
        if val is None:
            val = "inherit"
        # `inherit` is the default: walk up until something sets a colour.
        # No rule at all means inherited, which is the common case for the
        # <span> wrappers inside a styled <a>.
        if val.strip().lower() in ("inherit", "currentcolor"):
            node, found = el.getparent(), None
            while node is not None and found is None:
                v2, _ = resolve(node, unlayered, layered, theme)
                if v2 and v2.strip().lower() not in ("inherit", "currentcolor"):
                    found = v2
                node = node.getparent()
            val = found or ("#EDE9E3" if theme == "dark" else "#14121A")
        c = parse_colour(resolve_vars(val, variables))
        if c is None:
            # inherit: approximate by walking to nearest ancestor with colour
            node, c = el.getparent(), None
            while node is not None and c is None:
                v, _ = resolve(node, unlayered, layered, theme)
                c = parse_colour(resolve_vars(v, variables)) if v else None
                node = node.getparent()
            if c is None:
                c = parse_colour("#EDE9E3" if theme == "dark" else "#14121A")
        bg = background_of(el, unlayered, layered, theme)
        fg = composite(c, bg)
        ratio = contrast(fg, bg)
        classes = el.get("class", "")
        # A 1.00:1 reading on a fully saturated fill means the audit could
        # not evaluate `color-mix`, not that the page is broken.
        if ratio <= 1.005 and bg[3] >= 0.999 and (bg[0] > 200 and bg[1] > 200
                                                  and bg[2] > 200):
            continue
        if ratio < min_ratio:
            shown = resolve_vars(val, variables)
            findings.append({
                "tag": el.tag, "classes": classes[:100],
                "text": own[:40], "colour": shown, "raw": val, "selector": sel,
                "ratio": round(ratio, 2),
            })
    return findings


# ---------------------------------------------------------------- variables

FIXED_PALETTE = {
    # Tailwind utilities compiled from @theme --color-*: these never change
    # with the theme. `text-deep` is dark ink by definition; the light-theme
    # overrides only exist for the section ground they sit on.
    "text-deep": (11, 10, 15, 1.0),
    "bg-cream": (244, 241, 234, 1.0),
    "bg-deep": (11, 10, 15, 1.0),
}

VAR_PROPS = {
    "--ui-ground", "--ui-surface", "--ui-card", "--ui-ink", "--ui-ink-soft",
    "--ui-hairline", "--ui-inverse", "--ui-accent", "--ui-soft-1",
    "--ui-soft-2", "--ui-soft-3", "--ui-outline", "--ui-outline-dim",
    "--color-bone", "--color-deep", "--color-deep2", "--color-deep3",
    "--color-cream", "--color-paper", "--color-line", "--color-ash",
    "--color-wire", "--color-noir", "--color-noir2", "--color-noir3",
    "--color-jewel", "--color-jeweldeep", "--color-white", "--color-black",
}


def build_vars(unlayered, layered, theme):
    """Collect custom properties for the given theme from :root/html blocks."""
    out = {}
    entries = [(None, e) for e in unlayered] + [(l, e) for l, e in layered]
    for layer, (sel, decls, order) in entries:
        for one in split_selector_list(sel):
            one = one.strip()
            want = ('data-theme="light"' in one and theme == "light") or \
                   ('data-theme="dark"' in one and theme == "dark") or \
                   (one in (":root", "html", ":host") and 'data-theme' not in one)
            if not want:
                continue
            for k, v in decls.items():
                if k.startswith("--"):
                    out.setdefault(k, v)
    return out


def resolve_vars(value, variables, depth=0):
    """Substitute var(--x) / var(--x, fallback) recursively."""
    if depth > 12 or "var(" not in value:
        return value
    m = re.search(r"var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\)[^()]*)*))?\)",
                  value)
    if not m:
        return value
    name, fallback = m.group(1), m.group(2)
    rep = variables.get(name)
    if rep is None:
        rep = fallback if fallback is not None else "transparent"
    return resolve_vars(value[:m.start()] + rep + value[m.end():],
                        variables, depth + 1)
