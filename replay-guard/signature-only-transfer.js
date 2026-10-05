// Vulnerable transfer API — a valid signature is executed as-is. A
// signature proves WHO authored a request, not whether it has already
// run — replaying a captured request runs it again. Verified directly:
// the same signed request, captured once and resent 3 times, executed
// 3 times against this exact logic.
class SignatureOnlyTransfer {
  constructor(verifySignature) {
    this.verifySignature = verifySignature;
  }

  transfer(request) {
    if (!this.verifySignature(request)) {
      return { status: 'bad_signature' };
    }
    executeTransfer(request.from, request.to, request.amount);
    return { status: 'ok' };
  }
}

module.exports = { SignatureOnlyTransfer };
