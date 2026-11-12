// Checks who may call a BackgroundService. Run with `npm test`, which builds dist first.
const assert = require('node:assert');

let onMessage;
globalThis.window = globalThis;
globalThis.location = { origin: 'moz-extension://test' };
globalThis.chrome = { runtime: { id: 'test' } };
globalThis.browser = {
  runtime: { id: 'test', onMessage: { addListener: (listener) => (onMessage = listener) } },
  extension: { getBackgroundPage: () => globalThis },
};

const { BackgroundService } = require('../dist/BackgroundService');

class Echo extends BackgroundService {
  getServiceName() {
    return 'Echo';
  }
  initializeBackground() {}
  async execute(input) {
    return input;
  }
}
Echo.getInstance();

const message = { type: 'weeg.backgroundService.Echo', payload: 'hi' };
(async () => {
  assert.strictEqual(await onMessage(message, { url: 'moz-extension://test/popup.html' }), 'hi');
  // A content script reports the page it runs in.
  await assert.rejects(onMessage(message, { url: 'https://example.com/' }));
  await assert.rejects(onMessage(message, { url: 'moz-extension://test.example.com/popup.html' }));
  await assert.rejects(onMessage(message, {}));
  console.log('ok');
})();
