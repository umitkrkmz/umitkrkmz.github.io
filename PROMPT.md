# Build your own Mikro Şehir

Mikro Şehir was built step by step with an AI coding agent (Claude Code). This file is for anyone who wants to do the same: either **make this repository yours**, or **build a city of your own from scratch** with the prompt below.

## Make this repository yours

The code is MIT licensed. To turn it into your own city and portfolio:

- [ ] **Your portfolio:** `portfolio/content.js` holds every text on the phone (name, about, skills, projects, contacts, joke news). Set `github` to your username; project languages and dates come from the GitHub API. Update the English texts in `portfolio/lang.en.js`.
- [ ] **Your city:** district names and building mix in `js/world.js` (`C.DISTRICTS`, `C.CITY`), street names in `js/events.js` (`CADDE`, `SOKAK`), team suffixes in `js/stadium.js`, shop signs in `js/details.js` (`SIGNS`).
- [ ] **Your weather:** latitude and longitude in `js/wxdata.js` (Open-Meteo, no key needed).
- [ ] **Your clock:** the live clock uses Turkey time (GMT+3) in `js/ui.js` (`C.trHour`).
- [ ] **Your language:** the source language is Turkish and English comes from dictionaries (`js/lang.js`, `js/lang.en.js`). Language selection is automatic, with a manual switch.
- [ ] **Your name:** `LICENSE`, the page titles, and the address shown in the phone's URL bar (`site` in `content.js`).

Read `CLAUDE.md` before changing code: it maps every file and lists the traps (three.js r128 quirks, shader chaining, level of detail).

## Build one from scratch

Paste the prompt below into an AI coding agent in an empty folder. Build it in stages and check each stage in a real browser before moving on.

---

### Prompt

Build an interactive 3D city that runs in the browser, where **new detail appears as you zoom in**. No build step: a plain `index.html` and classic `<script>` files that also work when opened with `file://`.

**Technical frame**
- Three.js r128 from a CDN, with OrbitControls from the same version. No modules: one global namespace (`window.C`), files load in a fixed order, and each frame runs a list of `C.updaters`.
- Seeded randomness everywhere, so the same seed builds the same city. A "New city" button picks a new seed.
- Light and dark themes through CSS variables. Show a clear message when WebGL is missing.
- Quality presets (low / medium / high) picked automatically by device and saved when chosen by hand. They scale pixel ratio, shadow map, terrain mesh, forest density, view distance, traffic and crowds. Add adaptive resolution that lowers the pixel ratio when frames get slow.

**World**
- A grid city (for example 17 × 17 blocks) split into 3 × 3 districts. Each district has its own name, pavement tint and mix of towers, apartment blocks and houses. Some districts can have their own tower cluster.
- A central square with a clock tower that shows the simulated time, parks with ponds, ducks and benches, and landmarks: hospital, fire station, police station, stadium.
- The city sits in a valley: fbm mountains, forests, a river, and a road that climbs to a tunnel, with traffic entering and leaving the city.

**Levels of detail** (the core idea), by camera distance D
- D > 320, city: building masses and the street grid only.
- 130–320, district: windows, trees, lamps, road markings, traffic lights, moving cars.
- 45–130, street: pedestrians, shop signs, awnings, rooftop gear.
- D ≤ 45, eye level: shop windows and every small detail. Build building detail lazily and only near the camera.

**Life in the city**
- Traffic on a road graph with Bézier turns, traffic lights, indicators and safe following. Bus lines with stops and waiting passengers. Pedestrians who cross on red for cars.
- Rooms behind windows: interior mapping in the facade shader, plus a few real rooms with people in the nearest buildings, and a cutaway view of a selected building.
- Random events: fire, traffic accident, theft, pedestrian hit. Emergency vehicles drive there with sirens while other cars pull over, and an event feed lets you jump to the scene.
- A rooftop hero who swings on webs and catches thieves. Street cats you can pet and pick up, with a nightly cat meeting in the park. A football match at fixed times that runs in real time (45 + 15 + 45 minutes) and gives the same teams and score to everyone.
- Real local time by default, with a slider and fast-forward. Live weather for your city (Open-Meteo): clouds, fog, rain, snow, thunderstorms, wet asphalt that reflects the sky and dries in the sun, snow that settles and melts. Weather can also be picked by hand.

**Play**
- Third-person citizen mode: walk, run, jump, talk to people, sit on benches, enter shops (café, bakery, market with basket and till, barber, police station…), buy and consume things.
- Hero mode: run, climb walls, swing and zip on webs, web up a thief.
- Touch controls on phones: a joystick, buttons that send the same key events, drag to look, pinch to zoom.

**The portfolio phone**
- A developer character lives in the city on a daily schedule: café in the morning, park bench in the afternoon, the stadium in the evening, the cat meeting at night, home after midnight. "Find me" flies the camera to wherever they are; they wave, take out a phone, and the phone opens.
- The phone is a standalone portfolio page in an iframe (projects, about, contact, city news) that also works on its own. The city news follows the live weather, events and match, and changes with the date and time of day.

**Interaction**
- Mouse: drag to rotate, right button to pan, the wheel zooms towards the point under the cursor. Touch: one finger rotates, two fingers zoom and pan.
- Click a building: a card with its height, floors and residents, plus add floor, remove floor, demolish, rebuild on the empty lot, cutaway.
- Preset views with smooth flights: bird's-eye, skyline, street level, clock tower.

**Three.js r128 traps**
- Set `frustumCulled = false` on every InstancedMesh. Give an InstancedMesh whose count changes a full-capacity `instanceColor`.
- Use a linear colour workflow with sRGB output, and convert `scene.background` back by hand.
- Chain `onBeforeCompile` instead of overwriting it, and give each variant its own `customProgramCacheKey`.
- Avoid z-fighting with small height offsets, `polygonOffset` and a camera `near` value that grows with distance.

**Acceptance criteria**
1. On load the whole city is visible from above, and the level indicator says "City".
2. Zooming in brings windows, trees, traffic, signs and pedestrians in order.
3. You can select a building, add and remove floors, demolish it and build on the empty lot.
4. At night, windows, street lamps and headlights are on and stars are out.
5. On a phone in portrait there is no overflow, the controls fit, and play mode has touch controls.
6. The console is clean.

**Way of working**
Bring up the scene and empty blocks first and check them in the browser. Then add, one at a time: buildings, detail levels, street furniture, traffic, pedestrians, the interface, then the larger systems. After each step, run it, look at it and check the console. Keep a `CLAUDE.md` with a file map and the rules you learn along the way.
