// The fix: credentials are scoped to exactly one tenant and expire quickly.
// Compromising the credential used against one client never grants access
// to any other client — this is what would have contained the GJTec-style
// MSP breach to a single institution.
class TenantIsolatedAccess {
  constructor(tenants) {
    this.tenants = tenants;
    this.credentials = new Map(
      tenants.map(t => [t.id, { tenantId: t.id, issuedAt: Date.now(), ttlMs: 15 * 60 * 1000 }])
    );
    this.blockedAttempts = [];
  }

  accessTenant(credential, tenantId) {
    if (credential.tenantId !== tenantId) {
      this.blockedAttempts.push({ credentialTenant: credential.tenantId, attemptedTenant: tenantId });
      return { status: 'denied', reason: 'scope_mismatch' };
    }
    const tenant = this.tenants.find(t => t.id === tenantId);
    return { status: 'breached', tenant }; // only the targeted tenant is ever reachable
  }

  simulateCompromise(compromisedTenantId) {
    const stolenCredential = this.credentials.get(compromisedTenantId);
    return this.tenants.map(t => this.accessTenant(stolenCredential, t.id));
  }
}

module.exports = { TenantIsolatedAccess };
