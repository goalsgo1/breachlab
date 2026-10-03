// The fix: every lookup is bound to the caller's own session identity.
// A request for any other customer's id is rejected and logged, regardless
// of what the client sends — this is what should have stopped the Shinhan
// Bank-style IDOR bypass.
class SessionBoundLoanLookup {
  constructor(customerDb) {
    this.db = customerDb;
    this.deniedAttempts = [];
  }

  lookup(session, requestedId) {
    if (!session || !session.customerId) {
      return { status: 'unauthenticated' };
    }
    if (requestedId !== session.customerId) {
      this.deniedAttempts.push({
        sessionOwner: session.customerId,
        attemptedId: requestedId,
        at: Date.now(),
      });
      return { status: 'denied', reason: 'session_id_mismatch' };
    }
    const record = this.db[requestedId];
    if (!record) return { status: 'not_found' };
    return { status: 'ok', record };
  }
}

module.exports = { SessionBoundLoanLookup };
