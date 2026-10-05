# Card Testing Guard

Reproduces card testing (a BIN attack) against a payment gateway, and the
velocity-check fix that stops it.

**[Live interactive demo →](https://breachlab-5xg.pages.dev/en/demo/kit8.html)**

## What happened

Card testing brute-forces the digits after a known BIN (bank
identification number), using tiny (often $0 or $1) authorization attempts
to find valid card numbers before using them for real fraud elsewhere.
It's a textbook case under OWASP's Automated Threats to Web Applications
("Carding" / "Card Cracking"). Any payment endpoint that answers an
unlimited number of these attempts is, by construction, usable as a
valid-card finder.

## What's here

- `unlimited-charge-attempts.js` — a payment API with no limit on how many
  card numbers a single source can try
- `velocity-check-guard.js` — the fix: block a source outright after a
  small number of failures

## Verified against a real pentesting tool

Tested directly with **hydra** (github.com/vanhauser-thc/thc-hydra):

```
hydra -l x -P cards.txt -s 4504 127.0.0.1 http-post-form \
  "/charge-vuln:cardNumber=^PASS^:F=card_declined"
# -> 1 of 1 target successfully completed, 1 valid password found

# Sequential test against the guard, real card placed last:
4111...89 -> card_declined
4111...88 -> card_declined
4111...87 -> card_declined
4111...86 -> rate_limited_card_declined   (blocked from here on)
...
4111...81 (the real card) -> rate_limited_card_declined  — never discovered
```

## Not production-ready

An IP-only rate limit can be routed around with proxy rotation — a real
system also needs device fingerprinting and issuer-side signals. This
demonstrates one defense mechanism in isolation, not a deployable system.

---
Part of [BreachLab](https://github.com/goalsgo1/breachlab) — free security code reproduced from real hacks.
