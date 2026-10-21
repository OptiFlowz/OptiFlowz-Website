// Run against `npm run dev`; requires playwright on Node's module path.
// BASE_URL and CHROME_PATH can override the local server and browser.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  });
  try {
    for (const width of [390, 820]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(`${process.env.BASE_URL || 'http://localhost:3000'}/services/custom-video-platform`);
      await page.waitForFunction(() => {
        const stage = document.querySelector('[aria-label^="A 14-inch"]');
        return stage?.querySelector('video')?.readyState >= 2 && getComputedStyle(stage).opacity === '1';
      });
      await page.evaluate(() => {
        const video = document.querySelector('[aria-label^="A 14-inch"] video');
        window.decodedPoses = [video.currentTime];
        video.addEventListener('seeked', () => window.decodedPoses.push(video.currentTime));
        scrollTo({ top: 950, behavior: 'instant' });
      });
      await page.waitForFunction(() => {
        const video = document.querySelector('[aria-label^="A 14-inch"] video');
        return !video.seeking && video.currentTime > 5.99;
      });
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      // Mobile browser controls can resize the viewport in the middle of a swipe.
      await page.waitForTimeout(120);
      await page.setViewportSize({ width, height: 840 });
      await page.waitForFunction(() => {
        const video = document.querySelector('[aria-label^="A 14-inch"] video');
        return !video.seeking && video.currentTime < .01;
      });
      // Reverse again before the previous movement has finished.
      await page.evaluate(() => scrollTo({ top: 900, behavior: 'instant' }));
      await page.waitForTimeout(250);
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForFunction(() => {
        const video = document.querySelector('[aria-label^="A 14-inch"] video');
        return !video.seeking && video.currentTime < .01;
      });
      const poses = await page.evaluate(() => window.decodedPoses);
      assert(poses.length > 30, 'The scroll must actually decode intermediate poses');
      const largestJump = Math.max(...poses.slice(1).map((pose, index) => Math.abs(pose - poses[index])));
      const frameNumbers = poses.map(pose => Math.floor(pose * 30 + .001));
      const largestFrameStep = Math.max(...frameNumbers.slice(1).map((pose, index) => Math.abs(pose - frameNumbers[index])));
      assert(largestFrameStep <= 2, `Visible pose jumped ${largestFrameStep} frames at ${width}px`);
      assert(Math.max(...poses) > 5.9, 'The closing animation must finish');
      assert(poses.at(-1) < .04, 'Reverse scrolling must return to the first pose');
      console.log(`${width}px: ${poses.length} decoded poses, largest step ${largestJump.toFixed(4)}s`);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => Math.abs(document.querySelector('[aria-label^="A 14-inch"] video').currentTime - 3) < .04);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
