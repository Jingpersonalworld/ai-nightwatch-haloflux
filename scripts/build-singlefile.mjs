import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const outputs = [
  'docs/haloflux/nightwatch-halo.html',
  '双击直接打开-红蓝双球攻防大屏V2.html',
];

let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
html = html.replace(/<link[^>]*rel="modulepreload"[^>]*>\s*/g, '');

let cssCount = 0;
let fontCount = 0;
html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>/g, (tag) => {
  const href = tag.match(/href="([^"]+)"/)?.[1];
  if (!href) return tag;
  cssCount++;
  let css = fs.readFileSync(path.join(dist, href.replace(/^\//, '')), 'utf8');
  // Fonts are emitted as separate files by Vite; under file:// their absolute /assets/ URLs
  // would 404, so embed them as data URIs to keep the double-click page self-contained.
  css = css.replace(/url\((["']?)(\/?assets\/[^)"']+\.woff2)\1\)/g, (_, _q, rel) => {
    const buf = fs.readFileSync(path.join(dist, rel.replace(/^\//, '')));
    fontCount++;
    return `url(data:font/woff2;base64,${buf.toString('base64')})`;
  });
  return `<style>\n${css.replace(/<\/style/gi, '<\/style')}\n</style>`;
});

let jsCount = 0;
html = html.replace(/<script[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g, (_, src) => {
  jsCount++;
  const js = fs.readFileSync(path.join(dist, src.replace(/^\//, '')), 'utf8')
    .replace(/<\/script/gi, '<\/script');
  return `<script type="module">\n${js}\n</script>`;
});

if (!cssCount || !jsCount) throw new Error('inline failed: JS/CSS not found in dist/index.html');
if (/url\(\/?assets\//.test(html)) throw new Error('inline failed: asset url() left in single-file html');
for (const file of outputs) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
console.log(`inlined ${jsCount} JS + ${cssCount} CSS + ${fontCount} fonts ->`, outputs.join(', '));
