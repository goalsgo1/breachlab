// The fix: count failures per source (IP, etc.), and once a source
// crosses a threshold, every further attempt is blocked outright —
// without even looking at the card number. Verified: sequentially
// testing 9 candidates (the real card placed last) hit the block after
// 3 failures; the real card, arriving 6th in line past the block, was
// never checked at all.
class VelocityCheckGuard {
  constructor(validCards, blockAfter = 3) {
    this.validCards = validCards;
    this.blockAfter = blockAfter;
    this.failuresBySource = new Map();
  }

  charge(cardNumber, source) {
    const fails = this.failuresBySource.get(source) || 0;
    if (fails >= this.blockAfter) {
      return { status: 'rate_limited' }; // won't say even for a real card now
    }
    if (this.validCards.has(cardNumber)) {
      return { status: 'card_valid' };
    }
    this.failuresBySource.set(source, fails + 1);
    return { status: 'card_declined' };
  }
}

module.exports = { VelocityCheckGuard };
