// TWAP (time-weighted average price) oracle — ignores momentary spot-price
// manipulation by anchoring to an average over a trailing window.
class PriceOracleGuard {
  constructor({ windowMs = 1200000, maxDeviation = 0.1 } = {}) {
    this.history = []; // {price, time}
    this.windowMs = windowMs; // default 20 minutes
    this.maxDeviation = maxDeviation; // allowed deviation vs TWAP, 10%
  }

  pushPrice(spotPrice) {
    const now = Date.now();
    this.history.push({ price: spotPrice, time: now });
    this.history = this.history.filter(p => now - p.time < this.windowMs);
  }

  twap() {
    if (!this.history.length) return 0;
    const sum = this.history.reduce((s, p) => s + p.price, 0);
    return sum / this.history.length;
  }

  getSafePrice(spotPrice) {
    this.pushPrice(spotPrice);
    const twap = this.twap();
    const deviation = Math.abs(spotPrice - twap) / (twap || spotPrice);
    if (deviation > this.maxDeviation) {
      return { price: twap, flagged: true, reason: 'spot_deviation_exceeded', spotPrice, twap };
    }
    return { price: spotPrice, flagged: false };
  }
}

module.exports = { PriceOracleGuard };
