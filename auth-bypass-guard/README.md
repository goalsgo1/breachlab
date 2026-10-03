# Auth Bypass Guard

Reproduces the attack pattern from the **Shinhan Bank incident (2026-10-01, South Korea)** — bypassing identity verification on a loan-broker service to pull other customers' personal data — and the code that stops it.

**[Live interactive demo →](https://breachlab-5xg.pages.dev/en/demo/kit3.html)**

## What happened

An unauthorized party bypassed the identity-verification step on Shinhan Bank's loan-broker (대출모집인) service and accessed personal data for roughly 25,000 customers — resident registration numbers, connecting information (CI), names, phone numbers, annual income, and loan limits. Traces of a Chinese-language autonomous penetration-testing tool ("ARTEX") were found on infrastructure linked to the attack, though whether it was actually used is unconfirmed by regulators.

The underlying vulnerability class, regardless of how it was found, is a textbook **IDOR (Insecure Direct Object Reference)**: a lookup endpoint trusts a client-supplied identifier instead of verifying it against the caller's authenticated session.

## What's here

- `vulnerable-lookup-api.js` — a loan-lookup API that trusts whatever customer ID the client sends, letting anyone enumerate other customers' records
- `session-bound-guard.js` — the fix: every lookup is bound to the server-side session identity, and any request for a mismatched ID is rejected and logged

The demo runs a simulated bypass attempt against both: one leaks every record requested, the other blocks every one of them and logs the attempt.

## Not production-ready

Real identity-verification systems layer session management, rate limiting, and anomaly detection on top of this. This demonstrates one defense mechanism in isolation, not a deployable system.

---
Part of [BreachLab](https://github.com/goalsgo1/breachlab) — free security code reproduced from real hacks.
