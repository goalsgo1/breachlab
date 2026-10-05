# Credential Shield

Reproduces credential stuffing — trying passwords leaked from another
service's breach against this login — and the MFA fix that stops it.

**[Live interactive demo →](https://breachlab-5xg.pages.dev/en/demo/kit5.html)**

## What happened

Credential stuffing doesn't exploit a bug in any one system — it exploits
the fact that people reuse passwords. Attackers take a password list leaked
from breach A and try it against service B. Any login that authenticates on
a matching password alone is, by construction, vulnerable to this.

## What's here

- `password-only-login.js` — a login API that authenticates on a matching
  password alone
- `mfa-guard.js` — the fix: a second factor (TOTP-style code) is required
  in addition to the password

## Verified against a real pentesting tool

Both files were tested directly with **hydra**
(github.com/vanhauser-thc/thc-hydra, 10k+ GitHub stars), a real open-source
brute-force/credential-testing tool:

```
hydra -l alice -P wordlist.txt -s 4501 127.0.0.1 http-post-form \
  "/login-vuln:username=^USER^&password=^PASS^:F=invalid_credentials"
# -> 1 of 1 target successfully completed, 1 valid password found

hydra -l alice -P wordlist.txt -s 4501 127.0.0.1 http-post-form \
  "/login-mfa:username=^USER^&password=^PASS^&totp=000000:F=invalid_credentials"
# -> 1 of 1 target completed, 0 valid password found
```

## Not production-ready

A real system also needs account lockout, rate limiting, and anomaly
detection on top of MFA. This demonstrates one defense mechanism in
isolation, not a deployable system.

---
Part of [BreachLab](https://github.com/goalsgo1/breachlab) — free security code reproduced from real hacks.
