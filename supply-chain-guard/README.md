# Supply Chain Guard

Reproduces the attack pattern from the **"Korean Leaks" campaign (GJTec / Qilin ransomware)** — a single compromised managed-service-provider (MSP) credential cascading into a breach of 28 downstream financial institutions — and the code that contains it.

**[Live interactive demo →](https://breachlab-5xg.pages.dev/en/demo/kit4.html)**

## What happened

Attackers (Qilin ransomware, reportedly working alongside the North Korea-linked Moonstone Sleet) compromised South Korean IT service provider GJTec. Because GJTec held a single, broadly-scoped credential with access to many client systems, that one compromise cascaded into a breach of 28 financial institutions, with over 1 million files (~2TB) exfiltrated before ransomware deployment.

This is the generic MSP/supply-chain blast-radius problem: when a third-party vendor's access to its clients isn't isolated per-client, compromising the vendor once compromises everyone downstream at once.

## What's here

- `shared-credential-access.js` — a vulnerable MSP access model where one admin credential has standing access to every client tenant
- `tenant-isolated-access.js` — the fix: per-tenant scoped, short-lived credentials, so compromising access to one client never grants access to another

The demo simulates credential theft against both: one cascades across every client, the other is contained to the single tenant that was actually targeted.

## Not production-ready

Real MSP security also needs credential rotation, anomaly detection on cross-tenant access patterns, and incident response playbooks. This demonstrates the isolation principle in isolation, not a deployable system.

---
Part of [BreachLab](https://github.com/goalsgo1/breachlab) — free security code reproduced from real hacks.
