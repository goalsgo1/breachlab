# Oracle Shield

Reproduces the attack pattern from the **Tectonic hack (2026-08-30, Cronos)** — pumping a token's price ~100x in ~20 minutes to borrow far more than it's actually worth — and the code that stops it.

**[Live interactive demo →](https://breachlab-5xg.pages.dev/demo/kit2.html)**

## What happened

Tectonic, Cronos's largest lending protocol, let an attacker inflate a thin-liquidity governance token's price ~100x in about 20 minutes, then deposit the inflated token as collateral to borrow far beyond its real value — exploiting the assumption that "price == collateral value."

## What's here

- `price-oracle-guard.js` — a TWAP (time-weighted average price) oracle that ignores momentary spot-price spikes, using a trailing average instead
- `collateral-engine.js` — collateral valuation + loan-to-value borrow limits, fed by the oracle above

The demo runs the same pump attack against two engines side by side: one trusting the raw spot price (exploitable — approves the inflated borrow), one using TWAP (rejects it — flags the deviation).

## Not production-ready

Real lending protocols layer multiple oracle sources, liquidation mechanisms, and governance delays on top of this. This demonstrates one defense mechanism in isolation, not a deployable system.

---
Part of [BreachLab](https://github.com/goalsgo1/breachlab) — free security code reproduced from real hacks.
