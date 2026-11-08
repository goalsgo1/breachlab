// The fix: a nonce (one-time token) rides inside the signed payload, and
// a nonce the server has already seen is rejected even though the
// signature itself is still perfectly valid. Verified: replaying the
// same captured request against this logic processed it once, then
// rejected the 2nd and 3rd copies as replayed_nonce.
//
// A request whose timestamp is older than ttlMs is rejected as expired,
// and nonces past that window are pruned from usedNonces so the set does
// not grow without bound.
class NonceGuardedTransfer {
  constructor(verifySignature, ttlMs = 60000) {
    this.verifySignature = verifySignature;
    this.ttlMs = ttlMs;
    this.usedNonces = new Map(); // nonce -> timestamp of the request that used it
  }

  transfer(request) {
    if (!this.verifySignature(request)) {
      return { status: 'bad_signature' };
    }

    const now = Date.now();
    this.pruneExpiredNonces(now);

    if (Number.isFinite(request.timestamp) && now - request.timestamp > this.ttlMs) {
      this.usedNonces.delete(request.nonce);
      return { status: 'expired' };
    }

    if (this.usedNonces.has(request.nonce)) {
      return { status: 'replayed_nonce' }; // signature valid, but reused
    }

    this.usedNonces.set(
      request.nonce,
      Number.isFinite(request.timestamp) ? request.timestamp : now
    );
    executeTransfer(request.from, request.to, request.amount);
    return { status: 'ok' };
  }

  pruneExpiredNonces(now = Date.now()) {
    for (const [nonce, timestamp] of this.usedNonces) {
      if (now - timestamp > this.ttlMs) {
        this.usedNonces.delete(nonce);
      }
    }
  }
}

module.exports = { NonceGuardedTransfer };
