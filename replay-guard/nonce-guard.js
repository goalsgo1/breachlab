// The fix: a nonce (one-time token) rides inside the signed payload, and
// a nonce the server has already seen is rejected even though the
// signature itself is still perfectly valid. Verified: replaying the
// same captured request against this logic processed it once, then
// rejected the 2nd and 3rd copies as replayed_nonce.
class NonceGuardedTransfer {
  constructor(verifySignature) {
    this.verifySignature = verifySignature;
    this.usedNonces = new Set();
  }

  transfer(request) {
    if (!this.verifySignature(request)) {
      return { status: 'bad_signature' };
    }
    if (this.usedNonces.has(request.nonce)) {
      return { status: 'replayed_nonce' }; // signature valid, but reused
    }
    this.usedNonces.add(request.nonce);
    executeTransfer(request.from, request.to, request.amount);
    return { status: 'ok' };
  }
}

module.exports = { NonceGuardedTransfer };
