#!/usr/bin/env python3
"""Static gate for the Ruta SDR canonical migration.

This check protects the repository from reintroducing the legacy slug and verifies
the intended Home -> Ruta SDR -> Postular path. It does not claim to validate the
HTTP status returned by the production WordPress/Hostinger origin; that requires
an after-deploy HTTP check against prospectum.academy.
"""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = "https://prospectum.academy/ruta-sdr/"
LEGACY_SLUG = "ruta-de-formacion-y-certificacion-sdr-b2b"

errors: list[str] = []


def read(relative: str) -> str:
    path = ROOT / relative
    if not path.exists():
        errors.append(f"Missing required file: {relative}")
        return ""
    return path.read_text(encoding="utf-8")


home = read("index.html")
ruta = read("ruta-sdr/index.html")
postular = read("postular/index.html")
legacy = read(f"{LEGACY_SLUG}/index.html")
redirect_rule = read("ops/hostinger/ruta-sdr-301.htaccess.snippet")

checks = [
    (f'<link rel="canonical" href="{CANONICAL}">' in ruta,
     "Ruta SDR canonical tag is missing or incorrect."),
    ('href="ruta-sdr/"' in home,
     "Home does not link to the canonical ruta-sdr/ path."),
    ('href="../postular/"' in ruta,
     "Ruta SDR does not link to Postular."),
    ('href="../ruta-sdr/"' in postular,
     "Postular does not link back to Ruta SDR."),
    (f'<link rel="canonical" href="{CANONICAL}">' in legacy,
     "Legacy fallback does not declare Ruta SDR as canonical."),
    ('url=/ruta-sdr/' in legacy and "window.location.replace('/ruta-sdr/')" in legacy,
     "Legacy fallback does not redirect to /ruta-sdr/."),
    (LEGACY_SLUG in redirect_rule and "R=301" in redirect_rule and "/ruta-sdr/" in redirect_rule,
     "Production Apache 301 rule is missing or malformed."),
]

for ok, message in checks:
    if not ok:
        errors.append(message)

# The legacy slug is permitted only where it is required to implement or test migration.
allowed = {
    ROOT / LEGACY_SLUG / "index.html",
    ROOT / "ops" / "hostinger" / "ruta-sdr-301.htaccess.snippet",
    ROOT / ".github" / "workflows" / "qa-ruta-sdr.yml",
    Path(__file__).resolve(),
}
for path in ROOT.rglob("*"):
    if not path.is_file() or ".git" in path.parts or path in allowed:
        continue
    if path.suffix.lower() not in {".html", ".md", ".js", ".css", ".yml", ".yaml", ".txt"}:
        continue
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue
    if LEGACY_SLUG in text:
        errors.append(f"Legacy slug still referenced in {path.relative_to(ROOT)}")

if errors:
    print("RUTA_SDR_QA_FAIL")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("RUTA_SDR_QA_PASS")
print(f"Canonical: {CANONICAL}")
print("Path: Home -> Ruta SDR -> Postular")
print("Repository redirect rule: legacy slug -> /ruta-sdr/ [301]")
print("Production HTTP status remains an external post-deploy verification gate.")
