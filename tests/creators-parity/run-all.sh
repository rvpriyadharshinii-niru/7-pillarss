#!/bin/bash
# Parity suite. Prereq: build to /tmp/ft/index.html, copy reference original to /tmp/ft/orig.html, `cd /tmp/ft && python3 -m http.server 8765 &`
#   cd /home/user/7-pillarss/creators && OUT=/tmp/ft/index.html node tools/build.js && cp reference/original-adam-prototype.html /tmp/ft/orig.html
cd "$(dirname "$0")"
for f in scen-nav scen-disc scen-my scen-col scen-camp scen-dash scen-trk scen-adv; do echo "=== $f"; node $f.js; done
# optional long runs:  node crawl.js 1 && node diff.js /tmp/claude-0/crawl-d1.json   |   node fuzz.js 1 40 60
