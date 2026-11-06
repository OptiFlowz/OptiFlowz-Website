// Run with `node --test scripts/check-macbook-video.cjs`.
// Exercise the real seek controller with a decoder whose completion we control.
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const source = ts.transpileModule(readFileSync(resolve(__dirname,
  '../app/services/custom-video-platform/macbookVideo.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function setup() {
  const events = new Map();
  const frames = new Map();
  const seeks = [];
  const ready = [];
  let nextId = 0;
  let currentTime = 0;
  const video = {
    readyState: 2, duration: 181 / 30, seeking: false,
    get currentTime() { return currentTime; },
    set currentTime(value) {
      assert.equal(this.seeking, false, 'Never interrupt an in-flight decode');
      currentTime = value;
      this.seeking = true;
      seeks.push(Math.floor(value * 30));
    },
    setAttribute() {}, removeAttribute() {}, load() {}, remove() {},
    addEventListener(name, callback) { events.set(name, callback); },
    removeEventListener(name) { events.delete(name); },
  };
  const context = {
    exports: {},
    document: { createElement: () => video },
    window: { matchMedia: query => ({ matches: query === "(width < 500px)" }) },
    HTMLMediaElement: { HAVE_CURRENT_DATA: 2 },
    requestAnimationFrame(callback) { frames.set(++nextId, callback); return nextId; },
    cancelAnimationFrame(id) { frames.delete(id); },
  };
  vm.runInNewContext(source, context);
  const controls = context.exports.mountMacbookVideo({ appendChild() {} }, value => ready.push(value));
  const tick = () => {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach(callback => callback());
  };
  const decode = () => { video.seeking = false; events.get('seeked')?.(); };
  const load = () => { events.get('loadeddata')?.(); tick(); };
  return { controls, video, seeks, ready, frames, tick, decode, load };
}

test('a fast swipe catches up in one decode instead of replaying old frames', () => {
  const h = setup();
  h.load();
  h.controls.setScrollProgress(1, 1);
  h.tick();
  assert.deepEqual(h.seeks, [180]);
  h.decode();
  h.tick();
  assert.equal(h.frames.size, 0, 'Stop scheduling when the target is displayed');
  assert.deepEqual(h.ready, [true]);
});

test('a slow decoder coalesces targets and follows a reversal immediately afterward', () => {
  const h = setup();
  h.load();
  h.controls.setScrollProgress(.5, 0);
  h.tick();
  h.controls.setScrollProgress(1, 1);
  h.tick();
  h.controls.setScrollProgress(0, 0);
  h.tick();
  assert.deepEqual(h.seeks, [45], 'Keep only the active decode while busy');
  h.decode();
  h.tick();
  assert.deepEqual(h.seeks, [45, 0], 'Skip the superseded closing pose');
});

test('normal scrolling preserves intermediate smoothed poses', () => {
  const h = setup();
  h.load();
  for (const pose of [.1, .2, .3, .4, .5]) {
    h.controls.setScrollProgress(pose, 0);
    h.tick();
    h.decode();
  }
  assert.deepEqual(h.seeks, [9, 18, 27, 36, 45]);
});

test('restoration presents the requested pose only after decoding it', () => {
  const h = setup();
  h.video.readyState = 0;
  h.controls.setScrollProgress(1, 0);
  h.tick();
  assert.deepEqual(h.ready, []);
  h.video.readyState = 2;
  h.load();
  assert.deepEqual(h.seeks, [90]);
  assert.deepEqual(h.ready, []);
  h.decode();
  assert.deepEqual(h.ready, [true]);
});

test('disposing cancels pending animation work', () => {
  const h = setup();
  h.load();
  h.controls.setScrollProgress(1, 1);
  h.controls.dispose();
  h.tick();
  h.decode();
  assert.equal(h.frames.size, 0);
  assert.deepEqual(h.seeks, []);
});
