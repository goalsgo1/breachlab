// The fix: the credential becomes necessary but no longer sufficient. A
// large amount or a never-seen-before destination additionally requires
// a one-time approval code delivered out-of-band (modeling the secondary
// controls SWIFT's Customer Security Programme introduced after this
// incident). Verified: the same stolen credential that executed a
// transfer against static-credential-transfer.js was rejected here as
// secondary_approval_required.
class SecondaryApprovalGuard {
  constructor(validCredential, knownDestinations, largeAmountThreshold) {
    this.validCredential = validCredential;
    this.knownDestinations = knownDestinations; // Set<destination>
    this.largeAmountThreshold = largeAmountThreshold;
  }

  transfer({ credential, amount, destination, approvalCode }) {
    if (credential !== this.validCredential) {
      return { status: 'invalid_credential' };
    }
    const isUnusual = amount >= this.largeAmountThreshold || !this.knownDestinations.has(destination);
    if (isUnusual && !verifyOutOfBand(approvalCode)) {
      return { status: 'secondary_approval_required' }; // credential valid, but not enough
    }
    executeTransfer(amount, destination);
    return { status: 'transfer_executed' };
  }
}

module.exports = { SecondaryApprovalGuard };
