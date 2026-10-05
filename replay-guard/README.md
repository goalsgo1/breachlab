# Replay Guard

Reproduces a replay attack — capturing a validly-signed request and
resending it as-is — and the nonce fix that stops it.

**[Live interactive demo →](https://breachlab-5xg.pages.dev/en/demo/kit6.html)**

## What happened

A signature proves who authored a request. It does not prove whether that
exact request has already been processed. Any API that checks a signature
and nothing else will happily execute the same captured request every time
it's resent — a classic replay attack.

## What's here

- `signature-only-transfer.js` — a transfer API that checks the signature
  but never whether the request was already processed
- `nonce-guard.js` — the fix: a one-time nonce inside the signed payload;
  an already-used nonce is rejected regardless of signature validity

## Verified by capture-and-replay

Tested directly: a legitimate transfer request was signed once, then sent
3 times in a row against each implementation.

```
# signature-only-transfer.js
1st send -> {"status":"ok","newBalance":900}
2nd send (replay) -> {"status":"ok","newBalance":800}
3rd send (replay) -> {"status":"ok","newBalance":700}
# all 3 executed — the balance drained 3x from one captured request

# nonce-guard.js
1st send -> {"status":"ok","newBalance":900}
2nd send (replay) -> {"status":"replayed_nonce"}
# only the first copy executed
```

## Not production-ready

Nonces live in a single in-memory `Set` here — a real system needs a
storage layer safe across distributed instances, plus an expiry policy.
This demonstrates one defense mechanism in isolation, not a deployable
system.

---
Part of [BreachLab](https://github.com/goalsgo1/breachlab) — free security code reproduced from real hacks.
