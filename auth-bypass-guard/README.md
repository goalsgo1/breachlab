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

## Verified against a real AI pentesting agent

The demo above shows one defense mechanism in isolation. Separately, a deeper 4-layer version of this defense was tested in a network-isolated Docker sandbox against **ARTEX** itself — the actual open-source autonomous AI pentesting agent (github.com/Autumn-27/ARTEX) linked to the Shinhan Bank incident — with no access to any real infrastructure, synthetic data only:

1. **Per-identity violation tracking** (not per-token) — re-authenticating for a fresh session token doesn't reset the count
2. **Cross-identity source correlation** — once one source has caused violations under more than one identity, that source is blocked outright, closing the "get blocked, log back in as someone else" evasion
3. **Velocity/breadth logging** — informational, not used to block, since speed alone is an unreliable signal against a patient attacker
4. **An Isolation Forest anomaly model** (self-contained, no external ML dependency) as a general safety net for patterns none of the above specifically target — e.g. a single identity querying its own record at inhuman speed, which isn't an authorization violation but isn't normal either

Both ARTEX and a plain scripted scanner (no AI involved) were run against this, to confirm the defense catches the underlying *mechanism*, not just one tool's attack style. Neither exfiltrated beyond the deliberately-permissive threshold built into the test target.

**Known gaps, stated plainly:** cross-institution/distributed attacks are out of scope (a shared detection hub would introduce its own single-point-of-failure risk); the detection logic's own implementation hasn't been adversarially tested for bugs; and no finite test can prove resistance to attack techniques that don't exist yet. Detection is a supporting layer — the actual fix is `session-bound-guard.js` denying any ownership mismatch outright, from the first attempt.

## Not production-ready

Real identity-verification systems layer session management, rate limiting, and anomaly detection on top of this. This demonstrates one defense mechanism in isolation, not a deployable system.

---
Part of [BreachLab](https://github.com/goalsgo1/breachlab) — free security code reproduced from real hacks.
