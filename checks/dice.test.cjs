const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createDiceToy } = require('../dist/dice');

test('dice API accepts bounded rolls and rejects invalid queries', async (t) => {
  const app = await createDiceToy();
  await app.listen(0, '127.0.0.1');
  t.after(() => app.close());
  const base = await app.getUrl();
  assert.deepEqual(await (await fetch(`${base}/health`)).json(), { status: 'ok' });
  for (const [query, sides, count] of [['', 6, 1], ['?sides=20&count=10', 20, 10]]) {
    const response = await fetch(`${base}/roll${query}`);
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.sides, sides);
    assert.equal(result.rolls.length, count);
    assert.ok(result.rolls.every(value => Number.isInteger(value) && value >= 1 && value <= sides));
    assert.equal(result.total, result.rolls.reduce((sum, value) => sum + value, 0));
  }
  for (const query of ['sides=1', 'sides=101', 'sides=no', 'sides=3.5', 'count=0', 'count=11', 'count=', 'other=1', 'sides=6&sides=8']) {
    assert.equal((await fetch(`${base}/roll?${query}`)).status, 400, query);
  }
});
