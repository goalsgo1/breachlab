// Vulnerable loan-lookup endpoint — modeled on the Shinhan Bank incident
// (2026-10-01): identity verification on a loan-broker service was bypassed,
// exposing ~25,000 customers' personal data. The flaw: the endpoint trusts
// whatever customer id the CLIENT sends, instead of deriving it from the
// caller's authenticated session.
class VulnerableLoanLookup {
  constructor(customerDb) {
    this.db = customerDb; // { customerId: {name, rrn, ci, phone, income, loanLimit} }
  }

  // `session` is the caller's authenticated identity.
  // `requestedId` is a client-supplied parameter — e.g. ?customerId=CUST-1042.
  // BUG: requestedId is used directly, session is never checked against it.
  lookup(session, requestedId) {
    const record = this.db[requestedId];
    if (!record) return { status: 'not_found' };
    return { status: 'ok', record }; // leaks any customer's data to anyone logged in
  }
}

module.exports = { VulnerableLoanLookup };
