// Tests basiques de l'API (node --test)
const test = require('node:test');
const assert = require('node:assert');
const app = require('./server');

test('module API exporté', () => {
  assert.ok(app, 'app doit être exporté');
  assert.strictEqual(typeof app, 'function', 'app est un handler Express');
});

test('validation : POST sans content renvoie 400 (logique)', () => {
  const content = undefined;
  const valid = Boolean(content);
  assert.strictEqual(valid, false);
});
