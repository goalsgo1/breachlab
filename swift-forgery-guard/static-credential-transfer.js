// Vulnerable transfer messaging API — modeled on the Bangladesh Bank
// incident (2016-02-04, $81M). A single static credential is treated as
// permanent proof the message is genuine — steal it once, and it works
// forever, for any amount, to any destination. Verified directly with
// hydra: the stolen credential alone executed a large transfer to an
// unknown destination.
class StaticCredentialTransfer {
  constructor(validCredential) {
    this.validCredential = validCredential;
  }

  transfer({ credential, amount, destination }) {
    if (credential !== this.validCredential) {
      return { status: 'invalid_credential' };
    }
    executeTransfer(amount, destination); // no regard for amount or destination
    return { status: 'transfer_executed' };
  }
}

module.exports = { StaticCredentialTransfer };
