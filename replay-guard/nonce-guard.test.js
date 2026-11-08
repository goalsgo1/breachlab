// Standalone verification for nonce-guard.js. Run with:
//   node replay-guard/nonce-guard.test.js
const assert = require('node:assert/strict');
const { NonceGuardedTransfer } = require('./nonce-guard');

const executed = [];
global.executeTransfer = (from, to, amount) => {
  executed.push({ from, to, amount });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  // ttlMs defaults to 60s when omitted.
  const defaultGuard = new NonceGuardedTransfer(() => true);
  assert.equal(defaultGuard.ttlMs, 60000);
  console.log('default ttlMs = 60000: ok');

  // Core flow: ok -> replayed_nonce -> expired, with cleanup.
  const ttlMs = 250;
  const guard = new NonceGuardedTransfer((request) => request.signature === 'valid', ttlMs);
  const request = {
    nonce: 'nonce-1',
    timestamp: Date.now(),
    from: 'alice',
    to: 'bob',
    amount: 100,
    signature: 'valid',
  };

  assert.deepEqual(guard.transfer(request), { status: 'ok' });
  assert.equal(executed.length, 1);
  assert.equal(guard.usedNonces.has(request.nonce), true);
  console.log('1st send -> ok, executed once: ok');

  assert.deepEqual(guard.transfer(request), { status: 'replayed_nonce' });
  assert.equal(executed.length, 1);
  console.log('2nd send (replay) -> replayed_nonce: ok');

  await sleep(ttlMs + 50);
  assert.deepEqual(guard.transfer(request), { status: 'expired' });
  assert.equal(executed.length, 1);
  assert.equal(guard.usedNonces.has(request.nonce), false);
  assert.equal(guard.usedNonces.size, 0);
  console.log('3rd send after ttl -> expired, nonce pruned: ok');

  // Existing bad_signature behavior is unchanged.
  const forged = { ...request, nonce: 'nonce-2', timestamp: Date.now(), signature: 'forged' };
  assert.deepEqual(guard.transfer(forged), { status: 'bad_signature' });
  assert.equal(executed.length, 1);
  console.log('forged signature -> bad_signature: ok');

  // Expired nonces are also pruned when a later, fresh request arrives.
  const pruneGuard = new NonceGuardedTransfer(() => true, 50);
  const oldRequest = { nonce: 'old', timestamp: Date.now(), from: 'a', to: 'b', amount: 1 };
  assert.deepEqual(pruneGuard.transfer(oldRequest), { status: 'ok' });
  await sleep(80);
  const freshRequest = { nonce: 'fresh', timestamp: Date.now(), from: 'a', to: 'b', amount: 1 };
  assert.deepEqual(pruneGuard.transfer(freshRequest), { status: 'ok' });
  assert.deepEqual([...pruneGuard.usedNonces.keys()], ['fresh']);
  console.log('expired nonce pruned on next request: ok');

  // Requests without a timestamp keep the old behavior (no expiry check).
  const legacyGuard = new NonceGuardedTransfer(() => true, 50);
  const legacyRequest = { nonce: 'legacy', from: 'a', to: 'b', amount: 1 };
  assert.deepEqual(legacyGuard.transfer(legacyRequest), { status: 'ok' });
  assert.deepEqual(legacyGuard.transfer(legacyRequest), { status: 'replayed_nonce' });
  console.log('missing timestamp -> legacy behavior preserved: ok');

  console.log('nonce-guard.test.js: all assertions passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
