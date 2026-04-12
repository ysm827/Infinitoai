const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadPatchScript(context) {
  const scriptPath = path.join(__dirname, '..', 'content', 'turnstile-screenxy-patch.js');
  const code = fs.readFileSync(scriptPath, 'utf8');
  vm.createContext(context);
  vm.runInContext(code, context, { filename: scriptPath });
}

function createPatchContext() {
  class MouseEventStub {
    constructor(type, init = {}) {
      this.type = type;
      this.clientX = Number(init.clientX) || 0;
      this.clientY = Number(init.clientY) || 0;
    }
  }

  Object.defineProperty(MouseEventStub.prototype, 'screenX', {
    configurable: true,
    get() {
      return this.clientX;
    },
  });

  Object.defineProperty(MouseEventStub.prototype, 'screenY', {
    configurable: true,
    get() {
      return this.clientY;
    },
  });

  class PointerEventStub extends MouseEventStub {}

  const math = Object.create(Math);
  math.random = () => 0.5;

  const context = {
    Math: math,
    MouseEvent: MouseEventStub,
    PointerEvent: PointerEventStub,
    screen: {
      availLeft: 0,
      availTop: 0,
      availWidth: 1920,
      availHeight: 1080,
      width: 1920,
      height: 1080,
    },
    screenX: 0,
    screenY: 0,
  };

  context.window = context;
  context.globalThis = context;
  context.self = context;
  return context;
}

test('turnstile screen patch makes screen coordinates differ from client coordinates', () => {
  const context = createPatchContext();

  loadPatchScript(context);

  const event = new context.MouseEvent('click', { clientX: 140, clientY: 220 });
  assert.notEqual(event.screenX, event.clientX);
  assert.notEqual(event.screenY, event.clientY);
  assert.equal(event.screenX > event.clientX, true);
  assert.equal(event.screenY > event.clientY, true);
});

test('turnstile screen patch is safe to evaluate twice', () => {
  const context = createPatchContext();

  assert.doesNotThrow(() => {
    loadPatchScript(context);
    loadPatchScript(context);
  });

  const event = new context.PointerEvent('pointerdown', { clientX: 50, clientY: 80 });
  assert.notEqual(event.screenX, event.clientX);
  assert.notEqual(event.screenY, event.clientY);
});

test('manifest injects the turnstile screen patch in main world before page scripts', () => {
  const manifestPath = path.join(__dirname, '..', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const patchEntry = manifest.content_scripts.find((entry) =>
    Array.isArray(entry.js) && entry.js.includes('content/turnstile-screenxy-patch.js')
  );

  assert.ok(patchEntry, 'expected manifest to register the turnstile screen patch content script');
  assert.equal(patchEntry.run_at, 'document_start');
  assert.equal(patchEntry.all_frames, true);
  assert.equal(patchEntry.world, 'MAIN');
  assert.deepEqual(
    patchEntry.matches,
    [
      'https://tmailor.com/*',
      'https://challenges.cloudflare.com/*',
    ]
  );
});
