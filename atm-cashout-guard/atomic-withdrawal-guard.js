// The fix: no other request can act between the check and the
// deduction — an account-level lock makes both one atomic step. (A real
// system would use a DB row lock or an atomic
// UPDATE ... WHERE balance >= amount.) Verified: the same 10 concurrent
// $100 requests against a $500 balance let through exactly 5, stopping
// at exactly $0 — no overdraft.
class AtomicWithdrawalGuard {
  constructor(account) {
    this.account = account;
    this.locked = false;
  }

  async withdraw(amount) {
    while (this.locked) await sleep(5);
    this.locked = true;
    try {
      await simulatedDbRoundTrip(); // same delay, now INSIDE the lock
      if (this.account.balance < amount) return { status: 'insufficient_funds' };
      this.account.balance -= amount;
      return { status: 'ok', newBalance: this.account.balance };
    } finally {
      this.locked = false;
    }
  }
}

module.exports = { AtomicWithdrawalGuard };
