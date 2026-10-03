# Exchange Defense Kit

Reproduces the attack pattern from the **Bitget hack (2026-09-24, $387.5M)** and the code that stops it: a minimal price-time priority matching engine, plus a withdrawal-fraud guard.

**[Live interactive demo →](https://breachlab-5xg.pages.dev/en/demo/kit1.html)**

## What happened

Bitget's hack wasn't a private-key leak. The attacker compromised a third-party piece of software, used it to steal high-privilege admin-backend credentials, then issued forged withdrawal commands that the withdrawal system approved as legitimate — starting with a small test withdrawal, then draining multiple hot wallets in under 20 minutes.

## What's here

- `matching-engine.js` — price-time priority order matching (the kind of thing asked about in systems-design interviews at Coinbase/Robinhood-style companies)
- `withdrawal-defense.js` — three independent layers modeled on what actually would have stopped Bitget's attack:
  1. **Velocity check** — flags bursts of requests in a short window
  2. **Multi-approval** — large amounts can't clear on a single admin's authority
  3. **Timelock** — large withdrawals are delayed, not executed instantly

## Who this is for

Not real exchange operators — this is a learning resource for backend developers prepping for systems-design interviews or wanting a meaty portfolio project. (The real-world precedent: the open-source matching engine `exchange-core` has 2,226 GitHub stars, and "design a crypto exchange" is a recurring systems-design interview topic.)

## Not production-ready

No concurrency handling, no persistence, no real networking. This demonstrates the mechanism, not a deployable system.

---
Part of [BreachLab](https://github.com/goalsgo1/breachlab) — free security code reproduced from real hacks.
