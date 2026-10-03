// Forged-withdrawal defense — modeled on the Bitget incident (2026-09-24, $387.5M)
// Real attack path: compromised third-party software -> stolen admin backend
// credentials -> forged withdrawal commands approved as if legitimate.
class WithdrawalGuard {
  constructor({ velocityWindowMs = 10000, velocityThreshold = 3, timelockMs = 10000 } = {}) {
    this.recent = [];
    this.velocityWindowMs = velocityWindowMs;
    this.velocityThreshold = velocityThreshold;
    this.timelockMs = timelockMs;
  }

  request(amount, approvals = 1) {
    const now = Date.now();
    this.recent = this.recent.filter(r => now - r.time < this.velocityWindowMs);
    this.recent.push({ amount, time: now });

    // 1) Velocity check: too many requests in a short window
    if (this.recent.length > this.velocityThreshold) {
      return { status: 'blocked', reason: 'velocity_check' };
    }

    // 2) Multi-approval: large amounts can't clear on a single admin's authority
    const requiredApprovals = amount > 1000 ? 2 : 1;
    if (approvals < requiredApprovals) {
      return { status: 'pending', reason: 'multi_approval_required' };
    }

    // 3) Timelock: large withdrawals are delayed instead of executed instantly
    if (amount > 1000) {
      return { status: 'timelocked', releaseAt: now + this.timelockMs };
    }

    return { status: 'approved' };
  }
}

module.exports = { WithdrawalGuard };
