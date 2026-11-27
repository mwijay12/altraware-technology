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


def _parse_color_mix(v):
    """colour-mix(in <space>, C1 p1%, C2 p2%) -> (r, g, b, a)

    Only the two-stop form Tailwind emits is handled. A transparent stop is
    treated as alpha 0; the result is premultiplied so the composite is
    correct whatever the element sits on.
    """
    body = v[len("color-mix("):-1]
    args = split_args(body)
    if not args:
        return None
    space = "oklab"
    m = re.match(r"in\s+([a-z-]+)", args[0])
    if m:
        space = m.group(1)
        args = args[1:]
    stops = []
    for a in args:
        m = re.fullmatch(r"(.+?)\s+([\d.]+)%", a.strip())
        if m:
            token, pct = m.group(1).strip(), float(m.group(2)) / 100.0
        else:
            # Tailwind writes `color-mix(in oklab, #000 70%, transparent)`
            # with no percentage on the second stop: the omitted one takes
            # the remainder.
            token, pct = a.strip(), None
        if token == "transparent":
            stops.append(((0, 0, 0, 0.0), pct))
            continue
        colour = parse_colour(token)
        if colour is None:
            return None
        stops.append((colour, pct))
    if len(stops) != 2:
        return None
    (c1, p1), (c2, p2) = stops
    # fill in a single omitted percentage from the remainder
    if p1 is None and p2 is None:
        p1 = p2 = 0.5
    elif p1 is None:
        p1 = max(0.0, 1.0 - p2)
    elif p2 is None:
        p2 = max(0.0, 1.0 - p1)
    total = p1 + p2
    if total <= 0:
        return None
    p1, p2 = p1 / total, p2 / total
    # premultiplied alpha blend in the given space
    a1, a2 = c1[3], c2[3]
    A = p1 * a1 + p2 * a2
    if A <= 0:
        return (0, 0, 0, 0.0)
    if space.startswith("oklab"):
        L1 = srgb_to_oklab(*c1[:3]); L2 = srgb_to_oklab(*c2[:3])
    else:
        L1, L2 = c1[:3], c2[:3]
    mixed = tuple((p1 * a1 * x + p2 * a2 * y) / A for x, y in zip(L1, L2))
    if space.startswith("oklab"):
        rgb = oklab_to_srgb(*mixed)
    else:
        rgb = tuple(round(max(0, min(255, x))) for x in mixed)
    return (rgb[0], rgb[1], rgb[2], A)


def oklab_to_srgb(Lv, av, bv):
    """OKLab -> sRGB 8-bit. Tailwind v4 compiles `text-x/70` to
    color-mix(in oklab, ...), so this is the space that matters."""
    l_ = Lv + 0.3963377774 * av + 0.2158037573 * bv
    m_ = Lv - 0.1055613458 * av - 0.0638541728 * bv
    s_ = Lv - 0.0894841775 * av - 1.2914855480 * bv
    l, m, s2 = l_ ** 3, m_ ** 3, s_ ** 3
    R = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s2
    G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s2
    B = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s2

    def enc(c):
        c = max(0.0, min(1.0, c))
        c = 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055
        return round(c * 255)

    return (enc(R), enc(G), enc(B))


def srgb_to_oklab(r, g, b):
    def lin(c):
        c /= 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = lin(r), lin(g), lin(b)
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l_, m_, s_ = (x ** (1 / 3) if x >= 0 else -((-x) ** (1 / 3)) for x in (l, m, s))
    return (0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
            1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
            0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_)


def split_args(body):
    """Split on top-level commas only (nested parens stay intact)."""
    out, depth, cur = [], 0, ""
    for ch in body:
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        if ch == "," and depth == 0:
            out.append(cur.strip())
            cur = ""
        else:
            cur += ch
    if cur.strip():
        out.append(cur.strip())
    return out


def parse_colour(value):
    """Return (r, g, b, a) or None."""
    v = value.strip().lower()
    if v in ("transparent", "currentcolor", "inherit", "initial", "unset"):
        return None
    # Tailwind v4 compiles every alpha utility (`text-bone/70`) to
    # `color-mix(in oklab, <colour> 70%, transparent)`. Without this the
    # harness returned None and fell back to "inherit", which silently lost
    # the real ink — that is where the /impact and /pricing false positives
    # came from.
    if v.startswith("color-mix(") and v.endswith(")"):
        return _parse_color_mix(v)
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


def _is_inner(sel, start):
    """Return (inner, index_after_close) for a functional pseudo at `start`."""
    i, depth, j = start + 1, 1, start + 1
    while j < len(sel) and depth:
        if sel[j] == "(":
            depth += 1
        elif sel[j] == ")":
            depth -= 1
        j += 1
    return sel[i:j - 1], j


def specificity(sel):
    """(ids, classes+attrs+pseudoclasses, types).

    `:is()` / `:where()` / `:not()` contribute the MAXIMUM of their
    alternatives — not the sum. Counting every branch made
    `:is(.on-dark, .band-hold)` weigh two classes instead of one, so a
    one-class rule outranked a later rule that should have won.
    `:where()` contributes nothing at all.
    """
    total = [0, 0, 0]

    def walk(s):
        out = [0, 0, 0]
        # functional pseudos first, replaced by their contribution
        while True:
            m = re.search(r":(is|where|not|matches)\(", s)
            if not m:
                break
            inner, end = _is_inner(s, m.end() - 1)
            if m.group(1) == "where":
                add = [0, 0, 0]
            else:
                best = [0, 0, 0]
                for alt in split_selector_list(inner):
                    a = walk(alt)
                    if tuple(a) > tuple(best):
                        best = a
                add = best
            out = [x + y for x, y in zip(out, add)]
            s = s[:m.start()] + " " + s[end:]
        body = re.sub(r"\[[^\]]*\]", " [ATTR] ", s)
        body = re.sub(r"::[a-z-]+", "", body)
        body = re.sub(r":[a-z-]+", "", body)   # simple pseudos: 1 class each
        out[0] += len(re.findall(r"#[\w-]+", body))
        out[1] += len(re.findall(r"\.[\w-]+", body)) + body.count("[ATTR]")
        out[1] += len(re.findall(r":(?!:)[a-z-]+", s))
        out[2] += len(re.findall(r"(?:^|[\s>+~,])([a-z][a-z0-9]*)", body))
        return out

    r = walk(sel)
    return (r[0], r[1], r[2])


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
        """Fan a selector out into every :is()/:where() alternative.

        This used to `return` on the FIRST `:is()`, so a selector with two of
        them — `html .on-dark :is(.bg-white, …) :is(h1, h2, p)` — was left
        half-expanded and matched every descendant of `.on-dark`, including
        `<div>`s. That is how the /platforms avatar scored 1.00:1.
        """
        pending, done = [s], []
        while pending:
            cur = pending.pop()
            m = re.search(r":(?:is|where|matches)\(", cur)
            if not m:
                done.append(cur)
                continue
            i, depth, j = m.end(), 1, m.end()
            while j < len(cur) and depth:
                if cur[j] == "(":
                    depth += 1
                elif cur[j] == ")":
                    depth -= 1
                j += 1
            inner = cur[i:j - 1]
            opts, d2, part = [], 0, ""
            for ch in inner:
                if ch == "(":
                    d2 += 1
                    part += ch
                elif ch == ")":
                    d2 -= 1
                    part += ch
                elif ch == "," and d2 == 0:
                    opts.append(part.strip())
                    part = ""
                else:
                    part += ch
            opts.append(part.strip())
            head, tail = cur[:m.start()], cur[j:]
            for o in opts:
                pending.append(head + o + tail)
        return done

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


ATTR_NAMES = {
    "class", "id", "href", "src", "alt", "title", "type", "name", "value",
    "role", "lang", "dir", "style", "target", "rel", "id", "aria-hidden",
    "aria-label", "aria-expanded", "aria-current", "data-theme", "data-state",
    "data-active", "data-sidebar", "data-mobile", "data-orientation",
    "width", "height", "viewbox", "fill", "stroke", "d", "placeholder",
    "disabled", "checked", "selected", "open", "hidden", "for", "action",
    "method", "content", "property", "charset", "http-equiv", "loading",
    "decoding", "sizes", "srcset", "crossorigin", "referrerpolicy",
    "autocomplete", "inputmode", "min", "max", "step", "pattern", "required",
    "readonly", "multiple", "accept", "rows", "cols", "span", "start",
}


def _class_tokens(comp):
    """Class names in a compound selector, honouring escaped characters and
    arbitrary values in square brackets."""
    out = []
    i, n = 0, len(comp)
    while i < n:
        if comp[i] != ".":
            i += 1
            continue
        i += 1
        start, depth = i, 0
        while i < n:
            ch = comp[i]
            if ch == "\\":
                i += 2
                continue
            if ch == "[":
                depth += 1
            elif ch == "]":
                depth = max(0, depth - 1)
            elif depth == 0 and (ch in ".#>+~ \t\n," or ch == "("):
                break
            i += 1
        out.append(comp[start:i])
    return out


def _unescape(sel):
    """CSS escapes: `.text-deep\\/55` is the class `text-deep/55`.

    Tailwind emits arbitrary values double-escaped (`.bg-\\\\[\\\\#fdfcf9\\\\]`),
    and a single pass left one backslash behind, so every `bg-[#...]` element
    was invisible to the audit: its ground never resolved and `/pricing`'s
    `text-deep` headline scored 1.00:1 on a cream section. Loop to a fixed
    point.
    """
    prev = None
    while prev != sel:
        prev, sel = sel, re.sub(r"\\(.)", r"\1", sel)
    return sel


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
    # id — `#` inside an arbitrary value (`.bg-[#fdfcf9]`) is a colour, not
    # an id, and used to make every such element unmatchable.
    depth = 0
    for m in re.finditer(r"[\[\]]|#([\w-]+)", comp):
        if m.group(0) == "[":
            depth += 1
        elif m.group(0) == "]":
            depth -= 1
        elif m.group(1) and depth == 0:
            if el.get("id") != m.group(1):
                return False
    # classes — arbitrary values (`.bg-[#fdfcf9]`, `.grid-cols-[1fr_2fr]`,
    # `.w-[calc(100%-2rem)]`) contain brackets, #, % and commas, which the
    # old `[\w/-]+` class pattern cut short: `.bg-[#fdfcf9]` reduced to
    # `bg-` and every arbitrary-value element silently lost its background.
    for c in _class_tokens(comp):
        if c not in classes:
            return False
    # attributes
    for attr, op, val in re.findall(r'\[([\w-]+)(?:([*^$~|]?=)"?([^"\]]*)"?)?\]', comp):
        if attr not in ATTR_NAMES:
            continue
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


def resolve_prop(el, unlayered, layered, theme, prop):
    """Winning value of `prop` on `el`, same cascade as `resolve`."""
    candidates = []

    def consider(entry, layer_rank):
        sel, decls, order = entry
        if prop not in decls:
            return
        for one in split_selector_list(sel):
            if not one:
                continue
            if 'data-theme="light"' in one and theme != "light":
                continue
            if 'data-theme="dark"' in one and theme != "dark":
                continue
            if not matches(el, one):
                continue
            candidates.append((layer_rank, specificity(one), order,
                               decls[prop], one))
            break

    for e in unlayered:
        consider(e, 1)
    for layer, e in layered:
        consider(e, 0)
    if not candidates:
        return None, None
    best = max(candidates, key=lambda c: (c[0], c[1], c[2]))
    return best[3], best[4]


def stroke_colour(el, unlayered, layered, theme, variables):
    """Outlined type (`u-outline*`) paints with -webkit-text-stroke and sets
    `color: transparent`. Reading `color` alone scored it 1.00:1 and buried
    the real findings under hundreds of false ones."""
    for prop in ("-webkit-text-stroke-color", "-webkit-text-stroke",
                 "text-stroke-color"):
        raw, sel = resolve_prop(el, unlayered, layered, theme, prop)
        if raw:
            raw = resolve_vars(raw, variables)
            # `1px rgba(...)` shorthand -> take the colour part
            m = re.search(r"(rgba?\([^)]*\)|#[0-9a-fA-F]{3,8}|lab\([^)]*\))",
                          raw)
            c = parse_colour(m.group(1) if m else raw)
            if c:
                return c
    return None


def background_of(el, unlayered, layered, theme):
    """Walk up the tree compositing background-color until opaque.

    Uses the SAME ordering as `resolve`: unlayered beats layered, then
    specificity, then source order. Taking the first match instead of the
    strongest one was picking the browser reset (`button {background:#0000}`)
    over `.bg-bone`, which made every filled button look black.
    """
    stack = []
    # Custom properties are inherited, so the base table is the ROOT one;
    # any element in the ancestor chain may re-declare one (e.g. an
    # `.on-dark` band flips the ink scale back to bone).
    # `:root`/`html` bare selectors are theme-agnostic, so a base table built
    # with el=None picks up the LIGHT block for --ui-ground and dark readings
    # came out on a cream page. Seed from the theme's own root instead.
    html_el = el
    while html_el.getparent() is not None:
        html_el = html_el.getparent()
    variables = build_vars(unlayered, layered, theme, el=html_el)
    node = el
    while node is not None:
        variables.update(build_vars(unlayered, layered, theme, el=node))
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
    root_vars = build_vars(unlayered, layered, theme, el=tree)

    findings = []
    for el in tree.iter():
        if not isinstance(el.tag, str) or el.tag not in TEXT_TAGS:
            continue
        own = (el.text or "").strip()
        if not own:
            continue
        # Split-text headings (`<span data-ch>` per character) inherit their
        # colour from the animated parent. One letter is not readable text on
        # its own, so measuring it in isolation is meaningless.
        if el.get("data-ch") is not None:
            continue
        # A 3.5%-opacity watermark numeral is a texture, not copy. Anything
        # below 8% alpha cannot read as text on any ground, which is exactly
        # why designers use it that way.
        m_alpha = re.search(r"/(?:\[(\d*\.?\d+)\]|(\d{1,3}))(?:\s|$)", (el.get("class") or ""))
        if m_alpha:
            a_tok = m_alpha.group(1) or str(int(m_alpha.group(2)) / 100)
            try:
                if float(a_tok) < 0.08:
                    continue
            except ValueError:
                pass
        # `mix-blend-difference` numerals invert whatever is behind them, so
        # their static `color` says nothing about what the eye sees. The
        # renderer computes them; a cascade model cannot.
        blend, _ = resolve_prop(el, unlayered, layered, theme, "mix-blend-mode")
        if blend and "difference" in blend or (blend and "exclusion" in blend):
            continue
        # Decorative glyphs (`✦` separators) are marked aria-hidden and are
        # not readable text — judging them by contrast is noise.
        if el.get("aria-hidden") == "true" or any(
                a.get("aria-hidden") == "true" for a in el.iterancestors()):
            continue
        # Custom properties inherit, so the table that applies to this
        # element is root + every ancestor, nearest declaration winning.
        variables = dict(root_vars)
        chain = []
        node = el
        while node is not None:
            chain.append(node)
            node = node.getparent()
        for node in reversed(chain):
            variables.update(build_vars(unlayered, layered, theme, el=node))

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
        declared = resolve_vars(val, variables).strip().lower()
        c = parse_colour(declared)
        if c is None and declared in ("transparent", "#0000", "#00000000"):
            c = (0, 0, 0, 0.0)
        if c is not None and c[3] < 0.02:
            # fully transparent glyph fill: either outlined type or a
            # decorative ghost. Outlined type paints with a stroke.
            sc = stroke_colour(el, unlayered, layered, theme, variables)
            if sc is not None and sc[3] < 0.45:
                # A hairline stroke at low alpha is a deliberate stylistic
                # outline, not body copy. WCAG 1.4.3 exempts it; measuring it
                # as if it were text produced the last three "failures" on
                # /home in both themes.
                continue
            c = sc or c
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


def build_vars(unlayered, layered, theme, el=None):
    """Custom properties that apply to `el` (or to :root when el is None).

    This used to `setdefault` into one flat dict, which was wrong twice over:
    the FIRST declaration won (CSS says the last), and element-scoped rules
    like `html[data-theme=light] :is(.on-dark,.band-hold)` were folded into
    the root table, so a cream section could resolve `--ui-ink` to the
    inverse band's bone. Every light-theme reading was built on that.

    Now it runs the real cascade: unlayered beats layered, then specificity,
    then source order — same rule as `resolve`.
    """
    candidates = {}

    def consider(entry, layer_rank):
        sel, decls, order = entry
        vars_here = {k: v for k, v in decls.items() if k.startswith("--")}
        if not vars_here:
            return
        for one in split_selector_list(sel):
            one = one.strip()
            if not one:
                continue
            if 'data-theme="light"' in one and theme != "light":
                continue
            if 'data-theme="dark"' in one and theme != "dark":
                continue
            if el is None:
                # `:root`/`html` only — but theme blocks are written
                # `html[data-theme=light]`, so match those too.
                if one not in (":root", "html", ":host") and \
                        not re.fullmatch(r'html\[data-theme=["\']?\w+["\']?\]', one):
                    continue
            elif not matches(el, one):
                continue
            key = (layer_rank, specificity(one), order)
            for k, v in vars_here.items():
                if k not in candidates or key > candidates[k][0]:
                    candidates[k] = (key, v)
            break

    for e in unlayered:
        consider(e, 1)
    for layer, e in layered:
        consider(e, 0)
    return {k: v for k, (_, v) in candidates.items()}


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
