import json, math, sys
wa = json.load(open(sys.argv[1]))
out = sys.argv[2]
K = math.cos(math.radians(47.3))
polys = [p for p in wa['geometry']['coordinates'] if len(p[0]) >= 9]
pts = [c for p in polys for ring in p for c in ring]
minx = min(c[0] for c in pts); maxx = max(c[0] for c in pts)
miny = min(c[1] for c in pts); maxy = max(c[1] for c in pts)
W = 800.0
S = W / ((maxx - minx) * K)
H = (maxy - miny) * S
def xy(lon, lat): return ((lon - minx) * K * S, (maxy - lat) * S)
d = []
for p in polys:
    for ring in p:
        seg = []
        for i, (lon, lat) in enumerate(ring):
            x, y = xy(lon, lat); seg.append(("M" if i == 0 else "L") + f"{x:.1f} {y:.1f}")
        d.append("".join(seg) + "Z")
path = "".join(d)

# (name, lat, lon, eastside?, link)
cities = [
 ("Sammamish", 47.6163, -122.0356, True, "/about-us/"),
 ("Bellevue", 47.6101, -122.2015, True, "/depression-treatment-bellevue-renton/"),
 ("Kirkland", 47.6815, -122.2087, True, "/adhd-testing-psychiatrist-bellevue-kirkland-issaquah/"),
 ("Redmond", 47.6740, -122.1215, True, None),
 ("Issaquah", 47.5301, -122.0326, True, "/adhd-testing-psychiatrist-bellevue-kirkland-issaquah/"),
 ("Renton", 47.4829, -122.2171, True, "/depression-treatment-bellevue-renton/"),
 ("Mercer Island", 47.5707, -122.2221, True, "/anxiety-treatment-mercer-island-newcastle-renton/"),
 ("Newcastle", 47.5390, -122.1557, True, "/anxiety-treatment-mercer-island-newcastle-renton/"),
 ("Seattle", 47.6062, -122.3321, True, None),
 ("Bellingham", 48.7519, -122.4787, False, None),
 ("Mount Vernon", 48.4212, -122.3341, False, None),
 ("Everett", 47.9790, -122.2021, False, None),
 ("Port Angeles", 48.1181, -123.4307, False, None),
 ("Bremerton", 47.5673, -122.6326, False, None),
 ("Tacoma", 47.2529, -122.4443, False, None),
 ("Olympia", 47.0379, -122.9007, False, None),
 ("Aberdeen", 46.9754, -123.8157, False, None),
 ("Longview", 46.1382, -122.9382, False, None),
 ("Vancouver", 45.6387, -122.6615, False, None),
 ("Wenatchee", 47.4235, -120.3103, False, None),
 ("Ellensburg", 46.9965, -120.5478, False, None),
 ("Yakima", 46.6021, -120.5059, False, None),
 ("Moses Lake", 47.1301, -119.2781, False, None),
 ("Tri-Cities", 46.2112, -119.1372, False, None),
 ("Walla Walla", 46.0646, -118.3430, False, None),
 ("Spokane", 47.6588, -117.4260, False, None),
 ("Pullman", 46.7313, -117.1796, False, None),
]

def pin(name, x, y, r, fs, home, link, lift):
    cls = "wa-pin" + (" wa-pin--home" if home else "")
    shape = (f'<path class="wa-pin__dot" d="{star(x, y, r*1.7)}"/>' if home
             else f'<circle class="wa-pin__dot" cx="{x:.1f}" cy="{y:.1f}" r="{r}"/>')
    label = name + (" (home base)" if home else "")
    tw = len(label) * fs * 0.56 + fs
    ty = y - r * 2.2 - lift
    tag = (f'<a href="{link}" class="{cls}" aria-label="{label}">' if link
           else f'<g class="{cls}" tabindex="0" role="img" aria-label="{label}">')
    end = "</a>" if link else "</g>"
    return (tag + f'<circle class="wa-pin__hit" cx="{x:.1f}" cy="{y:.1f}" r="{r*2.6}"/>' + shape +
            f'<g class="wa-pin__tip"><rect x="{x - tw/2:.1f}" y="{ty - fs*1.45:.1f}" width="{tw:.1f}" height="{fs*1.9:.1f}" rx="{fs*0.5:.1f}"/>'
            f'<text x="{x:.1f}" y="{ty - fs*0.15:.1f}" font-size="{fs}">{label}</text></g>' + end)

def star(cx, cy, R):
    pts = []
    for i in range(10):
        a = math.pi / 2 + i * math.pi / 5
        rr = R if i % 2 == 0 else R * 0.45
        pts.append(f"{cx + rr*math.cos(a):.1f} {cy - rr*math.sin(a):.1f}")
    return "M" + "L".join(pts) + "Z"

# State map: Eastside shown as one cluster marker; everything else as pins
state_pins = []
for n, lat, lon, east, link in cities:
    if east and n not in ("Sammamish", "Seattle"): continue
    x, y = xy(lon, lat)
    state_pins.append(pin(n, x, y, 7, 17, n == "Sammamish", link, 0))
# Inset box around the Eastside
x0, y0 = xy(-122.42, 47.74); x1, y1 = xy(-121.95, 47.44)
inset_rect = f'<rect class="wa-inset-box" x="{x0:.1f}" y="{y0:.1f}" width="{x1-x0:.1f}" height="{y1-y0:.1f}" rx="3"/>'

# Zoomed Eastside view (same outline, tighter viewBox)
zw, zh = x1 - x0, y1 - y0
zr = zw / 60
zoom_pins = []
for n, lat, lon, east, link in cities:
    if not east: continue
    x, y = xy(lon, lat)
    zoom_pins.append(pin(n, x, y, round(zr, 2), round(zw / 26, 2), n == "Sammamish", link, 0))

svg_state = (f'<svg class="wa-map__svg" viewBox="0 0 {W:.0f} {H:.0f}" role="group" aria-labelledby="wa-map-title">'
  f'<title id="wa-map-title">Map of Washington State showing communities we serve by telehealth</title>'
  f'<path class="wa-shape" d="{path}"/>{inset_rect}{"".join(state_pins)}</svg>')
svg_zoom = (f'<svg class="wa-map__svg" viewBox="{x0:.1f} {y0:.1f} {zw:.1f} {zh:.1f}" role="group" aria-labelledby="wa-zoom-title">'
  f'<title id="wa-zoom-title">Close-up of Seattle and the Eastside</title>'
  f'<path class="wa-shape" d="{path}" vector-effect="non-scaling-stroke"/>{"".join(zoom_pins)}</svg>')

names_state = [c[0] for c in cities if not c[3]]
names_east = [c[0] for c in cities if c[3]]
tpl = open(out).read() if False else None
with open(out, "w") as f:
    f.write("{#- Generated by gen_map.py from US Census 2010 state outlines. Pins are example communities, not patient locations. -#}\n")
    f.write('<div class="wa-map">\n  <figure class="wa-map__main">\n    ' + svg_state +
            '\n    <p class="wa-map__status" aria-live="polite">Hover or tap a pin to see the city.</p>\n    <figcaption>The whole state is shaded because we see patients anywhere in Washington.</figcaption>\n  </figure>\n'
            '  <figure class="wa-map__zoom">\n    <p class="wa-map__zoom-label">Seattle &amp; the Eastside, up close</p>\n    ' + svg_zoom +
            '\n    <figcaption><span class="wa-legend wa-legend--home"></span> Our home base in Sammamish</figcaption>\n  </figure>\n</div>\n')
json.dump({"state": names_state, "east": names_east}, open(out + ".names.json", "w"))
print(f"W={W} H={H:.0f} path={len(path)} chars")
