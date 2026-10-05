# ATM Cash-out Guard

Reproduces the race-condition pattern from the **2013 prepaid-card
processor hack** — and the atomic-lock fix that stops it.

**[Live interactive demo →](https://breachlab-5xg.pages.dev/en/demo/kit7.html)**

## What happened

In 2013, hackers breached the processors behind prepaid debit cards for
Rakbank (UAE) and Bank of Muscat (Oman), removed withdrawal limits, then
coordinated cells in dozens of countries to cash out simultaneously before
any single withdrawal could be checked against an up-to-date balance. Two
waves (Dec 2012: ~$5M/20 countries; Feb 2013: ~$40M/24 countries, the
latter in just over 10 hours) netted roughly $45M combined.

The underlying bug class, independent of how the limits were actually
removed, is a textbook **TOCTOU race condition**: checking a balance and
then deducting from it are two separate steps, and concurrent requests can
all read the balance before any of them writes it back.

## What's here

- `race-condition-withdrawal.js` — a withdrawal API with a gap between the
  balance check and the deduction
- `atomic-withdrawal-guard.js` — the fix: check-and-deduct as one atomic,
  locked operation

## Verified by firing real concurrent requests

Same technique the open-source race-condition tool **race-the-web**
(github.com/insp3ctre/race-the-web) uses — all requests sent at once so
they land inside the same race window. Tested against a $500 balance with
10 concurrent $100 withdrawals:

```
race-condition-withdrawal.js: 10/10 succeeded — $1,000 drained from a $500 balance
atomic-withdrawal-guard.js:    5/10 succeeded — stopped at exactly $0, no overdraft
```

## Not production-ready

The lock here is in-memory within a single process — a real environment
with multiple server instances needs a distributed lock. This demonstrates
one defense mechanism in isolation, not a deployable system.

---
Part of [BreachLab](https://github.com/goalsgo1/breachlab) — free security code reproduced from real hacks.
