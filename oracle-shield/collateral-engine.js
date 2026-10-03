// Collateral valuation + borrow-limit logic — modeled on the Tectonic
// incident (2026-08-30, Cronos): attacker pumped a thin-liquidity governance
// token ~100x in ~20 minutes, then deposited it as collateral to borrow far
// more than its real value. Pass PriceOracleGuard as the price source to
// neutralize this.
class CollateralEngine {
  constructor(getPrice, { ltv = 0.7 } = {}) {
    this.getPrice = getPrice; // injected oracle price lookup
    this.ltv = ltv; // loan-to-value ratio, 70%
    this.positions = {};
  }

  deposit(user, token, amount) {
    this.positions[user] = this.positions[user] || { collateral: {}, borrowed: 0 };
    this.positions[user].collateral[token] = (this.positions[user].collateral[token] || 0) + amount;
  }

  collateralValue(user) {
    const pos = this.positions[user];
    if (!pos) return 0;
    return Object.entries(pos.collateral)
      .reduce((sum, [token, amt]) => sum + amt * this.getPrice(token), 0);
  }

  borrow(user, amount) {
    const maxBorrow = this.collateralValue(user) * this.ltv;
    const pos = this.positions[user];
    if (pos.borrowed + amount > maxBorrow) {
      return { status: 'rejected', reason: 'insufficient_collateral', maxBorrow };
    }
    pos.borrowed += amount;
    return { status: 'approved', borrowed: pos.borrowed };
  }
}

module.exports = { CollateralEngine };
