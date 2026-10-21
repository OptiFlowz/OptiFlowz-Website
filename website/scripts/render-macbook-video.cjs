/* Regenerate the responsive scroll videos from the production Three.js scene.
 * Requires esbuild, playwright and @ffmpeg-installer/ffmpeg (via NODE_PATH),
 * plus the local Next dev server. Run: node scripts/render-macbook-video.cjs
 */
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const { build } = require('esbuild');
const { chromium } = require('playwright');
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const sharp = require('sharp');

async function main() {
  const root = path.resolve(__dirname, '..');
  const work = await fs.mkdtemp(path.join(os.tmpdir(), 'macbook-video-'));
  const output = path.join(root, 'public/video-platform');
  const source = path.join(root, 'app/services/custom-video-platform/macbookScene.ts');
  // Instrument only the offline bundle; the production renderer stays untouched.
  const result = await build({
    entryPoints: [source], bundle: true, write: false, format: 'iife',
    globalName: 'MacbookCapture', platform: 'browser',
    plugins: [{ name: 'capture', setup(builder) {
      builder.onLoad({ filter: /macbookScene\.ts$/ }, async () => ({
        contents: (await fs.readFile(source, 'utf8')).replace(
          'setScrollProgress(progress, exit) {',
          `capture(progress, exit) {
            scrollProgress = progress; exitProgress = exit;
            showVideo(); videoTexture.needsUpdate = true;
            updateLid(); updateCamera(); renderer.render(scene, camera);
            return renderer.domElement.toDataURL('image/png');
          },
          setScrollProgress(progress, exit) {`,
        ), loader: 'ts', resolveDir: path.dirname(source),
      }));
    } }],
  });
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    headless: true,
  });
  try {
    for (const variant of [
      { name: 'small', viewport: 390, width: 780, height: 718 },
      { name: 'medium', viewport: 900, width: 1200, height: 900 },
    ]) {
      const page = await browser.newPage({ viewport: { width: variant.viewport, height: 1000 }, deviceScaleFactor: 1 });
      await page.goto(process.env.CAPTURE_URL || 'http://localhost:3000');
      await page.setContent(`<div id="stage" style="width:${variant.width}px;height:${variant.height}px"></div><video id="demo" muted playsinline src="/video-platform/platform-tour.mp4"></video>`);
      await page.addScriptTag({ content: result.outputFiles[0].text });
      await page.evaluate(async () => {
        const demo = document.querySelector('#demo');
        await new Promise((resolve, reject) => {
          demo.onloadeddata = resolve; demo.onerror = reject; demo.load();
        });
        window.brand = new Image();
        window.brand.src = '/video-platform/powered-by-optiflowz.fa79794a.svg';
        await window.brand.decode();
        await new Promise((resolve, reject) => {
          window.captureScene = MacbookCapture.mountMacbookScene(document.querySelector('#stage'), demo,
            ready => ready ? resolve() : reject(new Error('Scene failed to load')));
        });
      });
      const frames = path.join(work, variant.name);
      await fs.mkdir(frames);
      for (let index = 0; index <= 180; index++) {
        const png = await page.evaluate(async ({ index, width, height }) => {
          const progress = Math.min(1, index / 90);
          const closing = Math.max(0, (index - 90) / 90);
          const demo = document.querySelector('#demo');
          if (index) await new Promise(resolve => {
            demo.addEventListener('seeked', resolve, { once: true });
            demo.currentTime = index / 30;
          });
          const laptop = new Image();
          laptop.src = window.captureScene.capture(progress, closing);
          await laptop.decode();
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#090a0b'; ctx.fillRect(0, 0, width, height);
          const ease = t => t * t * (3 - 2 * t);
          // Invert the live easing so the brand reveals at the same scroll point.
          let low = 0, high = 1;
          for (let n = 0; n < 24; n++) {
            const mid = (low + high) / 2;
            if (ease(mid) < closing) low = mid; else high = mid;
          }
          ctx.globalAlpha = ease(Math.min(1, Math.max(0, ((low + high) / 2 - .15) / .65)));
          const brandWidth = Math.min(width * .62, 560 * (width / document.documentElement.clientWidth));
          const brandHeight = brandWidth * 141 / 1934;
          ctx.drawImage(window.brand, (width - brandWidth) / 2, height * .53 - brandHeight / 2, brandWidth, brandHeight);
          ctx.globalAlpha = 1;
          ctx.drawImage(laptop, 0, 0, width, height);
          return canvas.toDataURL('image/png').split(',')[1];
        }, { index, ...variant });
        await fs.writeFile(path.join(frames, `${String(index).padStart(4, '0')}.png`), Buffer.from(png, 'base64'));
        if (index % 45 === 0) console.log(`${variant.name}: ${index}/180`);
      }
      execFileSync(ffmpeg, ['-y', '-framerate', '30', '-i', path.join(frames, '%04d.png'),
        '-c:v', 'libx264', '-crf', '19', '-preset', 'slow',
        '-vf', 'scale=out_range=full:out_color_matrix=bt601', '-pix_fmt', 'yuvj420p',
        '-color_range', 'pc', '-colorspace', 'bt470bg',
        '-g', '1', '-movflags', '+faststart', '-an', path.join(output, `macbook-scroll-${variant.name}.mp4`)], { stdio: 'ignore' });
      await sharp(path.join(frames, '0000.png')).webp({ quality: 88 })
        .toFile(path.join(output, `macbook-scroll-${variant.name}.webp`));
      await page.close();
    }
  } finally {
    await browser.close();
    await fs.rm(work, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
