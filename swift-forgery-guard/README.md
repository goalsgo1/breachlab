# SWIFT Transfer Forgery Guard

Reproduces the stolen-credential pattern from the **Bangladesh Bank SWIFT
heist (2016-02-04, $81M)** — and the secondary-approval fix that stops it.

**[Live interactive demo →](https://breachlab-5xg.pages.dev/en/demo/kit9.html)**

## What happened

Attackers who had stolen Bangladesh Bank's SWIFT Alliance Access
credentials used them to submit transfer instructions that looked
completely legitimate to the receiving bank — of 35 attempted transfers
totaling roughly $951M, only 4 succeeded, totaling $81M. The rest were
stopped by a misspelled beneficiary name and fraud-detection flags, not by
anything in the authentication step itself.

The underlying mechanism, regardless of how the credentials were stolen,
is that a **static credential alone was treated as permanent, sufficient
proof of authenticity** — no matter the amount or destination.

## What's here

- `static-credential-transfer.js` — a transfer API that executes on a
  matching static credential alone
- `secondary-approval-guard.js` — the fix: large or unfamiliar-destination
  transfers additionally require a one-time out-of-band approval code
  (modeling the controls SWIFT's Customer Security Programme introduced
  after this incident)

## Verified against a real pentesting tool

Tested directly with **hydra** (github.com/vanhauser-thc/thc-hydra),
simulating an attacker who already possesses the stolen credential and is
confirming it's sufficient on its own:

```
hydra ... "/swift-transfer-vuln:credential=^PASS^&amount=5000000&destination=UNKNOWN-MULE-ACCT:S=transfer_executed"
# -> 1 of 1 target successfully completed, 1 valid password found

hydra ... "/swift-transfer-guard:credential=^PASS^&amount=5000000&destination=UNKNOWN-MULE-ACCT:S=transfer_executed"
# -> 1 of 1 target completed, 0 valid password found
```

## Not production-ready

The real SWIFT network isn't something the public can test — this code
isolates and generalizes just the "one stolen static credential = permanent
authentication" mechanism. This demonstrates one defense mechanism in
isolation, not a deployable system.

---
Part of [BreachLab](https://github.com/goalsgo1/breachlab) — free security code reproduced from real hacks.
