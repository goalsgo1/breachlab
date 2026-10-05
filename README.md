# BreachLab

Every time a real security incident hits crypto exchanges or fintech/banking platforms, I reproduce the attack pattern and publish the code that would have stopped it. Free.

**[Live site & catalog →](https://breachlab-5xg.pages.dev/en/)**

## Rule for what gets added here

Two tracks feed this repo, run side by side:

- **Track A — breaking incidents** (no cap): a new incident becomes a repo
  here as soon as it passes all three — **mechanism clarity** (explainable
  in 3 steps or fewer), **safe reproducibility** (fake data only, never a
  working exploit), and **relevance** (an actively discussed, real
  incident).
- **Track B — historical incidents** (paced to actual build capacity, not
  stockpiled): same mechanism-clarity and safe-reproducibility bar, but
  "relevance" is swapped for **canonical status** — is this incident the
  textbook example people already cite for this attack class (e.g. the
  Bangladesh Bank SWIFT heist for stolen-credential forgery)?

Every product, from either track, is also cross-validated against at least
one real, popular open-source pentesting tool (hydra, mitmproxy-style
capture/replay, etc.) before it's published here — see each folder's
README for the exact command and result.

## Products so far

| Product | Incident reproduced | Difficulty |
|---|---|---|
| [exchange-defense-kit](./exchange-defense-kit) | Bitget hack — $387.5M, 2026-09-24 (compromised admin backend → forged withdrawals) | Medium |
| [oracle-shield](./oracle-shield) | Tectonic hack — Cronos, 2026-08-30 (price pump → over-collateralized borrow) | Medium |
| [auth-bypass-guard](./auth-bypass-guard) | Shinhan Bank incident — South Korea, 2026-10-01 (identity-verification bypass → IDOR data leak) — also verified against the real ARTEX AI pentesting agent | Easy |
| [supply-chain-guard](./supply-chain-guard) | "Korean Leaks" campaign — GJTec/Qilin ransomware, 2025-11 (one compromised MSP credential → 28 institutions breached) | Medium |
| [credential-shield](./credential-shield) | Credential stuffing (general technique) — verified with hydra | Easy |
| [replay-guard](./replay-guard) | Replay attacks (general technique) — verified by capture-and-replay | Easy |
| [atm-cashout-guard](./atm-cashout-guard) | Prepaid-card processor hack — $45M, 2013-02 (TOCTOU race condition → withdrawal-limit bypass) | Hard |
| [card-testing-guard](./card-testing-guard) | Card testing / BIN attacks (general technique) — verified with hydra | Easy |
| [swift-forgery-guard](./swift-forgery-guard) | Bangladesh Bank SWIFT heist — $81M, 2016-02-04 (stolen static credential → forged transfer messages) | Hard |

More are planned: bridge message forgery, flash loan attacks, reentrancy, MEV front-running, SIM swapping, address poisoning, and more — tracked against real and canonical incidents as they happen.

## Why this exists

I got curious watching a breakdown of the Bitget hack and decided to actually rebuild the attack and the defense instead of just reading about it. Turned out to be a good way to learn how exchange backends actually work — and a decent portfolio piece, since "design a crypto exchange" is a recurring systems-design interview topic (see [exchange-core](https://github.com/mzheravin/exchange-core), 2,226★, for the real-world version of this at production scale).

Not a product for real exchange operators. This is learning material.

## License

Code in this repo is free to use for learning and portfolio purposes. See individual folders for details.

## Contact

Questions, or want to know when a deeper paid version ships: goalsgo7574@gmail.com
