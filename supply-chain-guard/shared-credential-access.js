// Vulnerable MSP access model — modeled on the "Korean Leaks" campaign:
// a single compromised GJTec credential cascaded into a breach of 28
// downstream financial institutions. The flaw: one credential has standing
// access to every client tenant the MSP manages.
class SharedCredentialAccess {
  constructor(tenants) {
    this.tenants = tenants; // [{id, name}, ...]
    this.credential = { id: 'msp-admin', scope: 'all-tenants' };
  }

  // A stolen credential can act against ANY tenant — no isolation.
  accessTenant(credential, tenantId) {
    if (credential.scope !== 'all-tenants') return { status: 'denied' };
    const tenant = this.tenants.find(t => t.id === tenantId);
    return { status: 'breached', tenant };
  }

  simulateCompromise() {
    // Attacker has the one credential; every tenant is reachable.
    return this.tenants.map(t => this.accessTenant(this.credential, t.id));
  }
}

module.exports = { SharedCredentialAccess };
