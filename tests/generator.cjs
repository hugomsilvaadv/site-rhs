// Generator contracts that need no browser: the checked-in pages equal the generator output,
// EN/ES copy keeps the same structure, a third language can be added without being published,
// and the hero swap only uses approved product captures.
const { spawnSync } = require('node:child_process'); const path = require('node:path'); const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const python = String.raw`
import copy, json, sys
sys.path.insert(0, 'tools')
import render, sections
results = {}
for code in render.published():
    results['current_' + code] = open(render.route_file(code)).read() == render.render(code, render.capture_manifest())
render.check_parity()
broken = copy.deepcopy(render.PAGE['es']); broken['nav'] = broken['nav'][:-1]
saved = render.PAGE['es']; render.PAGE['es'] = broken
try:
    render.check_parity(); results['parity_guard'] = False
except ValueError:
    results['parity_guard'] = True
render.PAGE['es'] = saved
# A third language, registered but unpublished, leaves the published pages untouched.
render.LANGUAGES['xx'] = {'path': '/xx/', 'og_locale': 'xx_XX', 'label': 'XX', 'name': 'Example', 'published': False}
for table in (render.PAGE, render.HERO, sections.COPY):
    table['xx'] = copy.deepcopy(table['en'])
for item in render.HERO_CONCEPT + render.HERO_PRODUCT:
    item['name']['xx'] = item['name']['en']; item['alt']['xx'] = item['alt']['en']
manifest = render.capture_manifest()
results['unpublished_hidden'] = '/xx/' not in render.render('en', manifest) and render.published() == ['en', 'es']
render.LANGUAGES['xx']['published'] = True
render.check_parity()
en, xx = render.render('en', manifest), render.render('xx', manifest)
results['published_linked'] = 'hreflang="xx" href="/xx/"' in en and 'data-language="xx"' in en
results['third_page'] = '<html lang="xx">' in xx and 'og:locale" content="xx_XX"' in xx and 'rel="canonical" href="/xx/"' in xx
results['third_file'] = str(render.route_file('xx')).endswith('xx/index.html')
render.LANGUAGES['xx']['published'] = False
# Hero swap: approved captures replace the concept art and the badge says product UI.
screens = {name: {'approved': True, 'hero': {'path': 'assets/hero/' + name + '.webp', 'width': 1586, 'height': 992}} for name in ['player-360-summary', 'withdrawals-queue', 'reports']}
swapped = render.render('en', {'screens': screens, 'hero': {'active': True}})
results['swap_images'] = all('src="/assets/hero/' + name + '.webp"' in swapped for name in screens)
results['swap_badge'] = 'data-hero-images="product"' in swapped and 'PRODUCT UI' in swapped and 'ILLUSTRATIVE CONCEPT' not in swapped
results['swap_preload'] = 'rel="preload" href="/assets/hero/player-360-summary.webp"' in swapped
screens['reports']['approved'] = False
try:
    render.render('en', {'screens': screens, 'hero': {'active': True}}); results['swap_guard'] = False
except ValueError:
    results['swap_guard'] = True
print(json.dumps(results))
`;
const run = spawnSync('python3', ['-c', python], { cwd: root, encoding: 'utf8' });
assert.equal(run.status, 0, run.stderr);
const results = JSON.parse(run.stdout.trim().split('\n').pop());
for (const [name, ok] of Object.entries(results)) assert.equal(ok, true, name);
assert.ok(results.current_en && results.current_es, 'pages regenerated');
console.log('PASS: generator parity (checked-in pages = output), EN/ES structure guard, unpublished third language, hero swap only with approved captures');
