(function installTurnstileScreenCoordinatePatch() {
  const root = typeof globalThis !== 'undefined' ? globalThis : self;
  if (!root || root.__MULTIPAGE_TURNSTILE_SCREENXY_PATCH_INSTALLED__) {
    return;
  }
  root.__MULTIPAGE_TURNSTILE_SCREENXY_PATCH_INSTALLED__ = true;

  function asFiniteNumber(value, fallback) {
    return Number.isFinite(value) ? value : fallback;
  }

  function buildCoordinateOffset(axis) {
    const screenInfo = root.screen || {};
    const windowOffset = axis === 'x'
      ? asFiniteNumber(root.screenX, asFiniteNumber(screenInfo.availLeft, 0))
      : asFiniteNumber(root.screenY, asFiniteNumber(screenInfo.availTop, 0));
    const minJitter = axis === 'x' ? 72 : 88;
    const maxJitter = axis === 'x' ? 168 : 196;
    const jitter = Math.floor((minJitter + Math.random() * (maxJitter - minJitter + 1)));
    return windowOffset + jitter;
  }

  function patchMousePrototype(prototype) {
    if (!prototype) {
      return;
    }

    const offsetX = buildCoordinateOffset('x');
    const offsetY = buildCoordinateOffset('y');

    try {
      Object.defineProperty(prototype, 'screenX', {
        configurable: true,
        get() {
          return asFiniteNumber(this?.clientX, 0) + offsetX;
        },
      });
    } catch {}

    try {
      Object.defineProperty(prototype, 'screenY', {
        configurable: true,
        get() {
          return asFiniteNumber(this?.clientY, 0) + offsetY;
        },
      });
    } catch {}
  }

  patchMousePrototype(root.MouseEvent?.prototype);
  if (root.PointerEvent?.prototype && root.PointerEvent.prototype !== root.MouseEvent?.prototype) {
    patchMousePrototype(root.PointerEvent.prototype);
  }
})();
