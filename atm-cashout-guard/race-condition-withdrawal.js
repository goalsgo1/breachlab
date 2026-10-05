// Vulnerable withdrawal API — modeled on the 2013 prepaid-card processor
// hack. The balance CHECK and the deduction ACT are two separate steps;
// the gap between them (a realistic DB round-trip) is a race window
// where concurrent requests all see the balance from BEFORE any of them
// has written back. Verified: firing 10 concurrent $100 withdrawals
// against a $500 balance let all 10 through.
class RaceConditionWithdrawal {
  constructor(account) {
    this.account = account; // { balance }
  }

  async withdraw(amount) {
    const current = this.account.balance; // CHECK
    await simulatedDbRoundTrip(); // the race window
    if (current < amount) return { status: 'insufficient_funds' };
    this.account.balance = current - amount; // ACT — based on a stale read
    return { status: 'ok', newBalance: this.account.balance };
  }
}

module.exports = { RaceConditionWithdrawal };
