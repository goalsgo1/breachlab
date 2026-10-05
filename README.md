# BreachLab

Every time a real security incident hits crypto exchanges or fintech/banking platforms, I reproduce the attack pattern and publish the code that would have stopped it. Free.

**[Live site & catalog →](https://breachlab-5xg.pages.dev/en/)**

## Rule for what gets added here

A new incident becomes a repo here only if it passes all three:
1. **Mechanism clarity** — the attack can be explained in 3 steps or fewer
2. **Safe reproducibility** — it can be simulated with fake data, never a working exploit
3. **Relevance** — it's an actively discussed, real incident

## Products so far

| Product | Incident reproduced | Difficulty |
|---|---|---|
| [exchange-defense-kit](./exchange-defense-kit) | Bitget hack — $387.5M, 2026-09-24 (compromised admin backend → forged withdrawals) | Medium |
| [oracle-shield](./oracle-shield) | Tectonic hack — Cronos, 2026-08-30 (price pump → over-collateralized borrow) | Medium |
| [auth-bypass-guard](./auth-bypass-guard) | Shinhan Bank incident — South Korea, 2026-10-01 (identity-verification bypass → IDOR data leak) — also verified against the real ARTEX AI pentesting agent | Easy |
| [supply-chain-guard](./supply-chain-guard) | "Korean Leaks" campaign — GJTec/Qilin ransomware, 2025-11 (one compromised MSP credential → 28 institutions breached) | Medium |

More are planned: bridge message forgery, flash loan attacks, reentrancy, MEV front-running, credential stuffing, and more — tracked against real incidents as they happen.

## Why this exists

I got curious watching a breakdown of the Bitget hack and decided to actually rebuild the attack and the defense instead of just reading about it. Turned out to be a good way to learn how exchange backends actually work — and a decent portfolio piece, since "design a crypto exchange" is a recurring systems-design interview topic (see [exchange-core](https://github.com/mzheravin/exchange-core), 2,226★, for the real-world version of this at production scale).

Not a product for real exchange operators. This is learning material.

## License

Code in this repo is free to use for learning and portfolio purposes. See individual folders for details.

## Contact

Questions, or want to know when a deeper paid version ships: goalsgo7574@gmail.com
