"""Fetch every public page + the CSS it actually links, then audit both themes.

The HTML and the CSS MUST come from the same server. Taking one from a dev
server and the other from `.next/static` silently compares two different
stylesheets — that produced a whole round of phantom findings.
"""
import re, sys, urllib.request
sys.path.insert(0, "audit")
import cascade

BASE = "http://127.0.0.1:3000"
PAGES = ["", "about", "services", "impact", "process", "contact",
         "pricing", "blog", "platforms", "privacy", "terms"]


def fetch():
    css_all, seen = "", set()
    for p in PAGES:
        html = urllib.request.urlopen(f"{BASE}/{p}").read().decode()
        open(f"audit/out/{(p or 'home')}.html", "w").write(html)
        for link in re.findall(r'href="(/_next/static/[^"]*\.css)"', html):
            if link not in seen:
                seen.add(link)
                css_all += urllib.request.urlopen(BASE + link).read().decode()
    open("audit/out/all.css", "w").write(css_all)
    return css_all


if __name__ == "__main__":
    css = fetch()
    names = [p or "home" for p in PAGES]
    print(f"css {len(css)} chars, {len(names)} pages\n")
    grand = 0
    for theme in ("dark", "light"):
        rows = []
        for p in PAGES:
            n = len(cascade.audit(f"audit/out/{(p or 'home')}.html", css, theme=theme))
            rows.append((p or "home", n))
            grand += n
        print(f"{theme:5s}  " + "  ".join(f"{a}={b}" for a, b in rows)
              + f"   TOTAL={sum(b for _, b in rows)}")
    print(f"\nboth themes: {grand}")
