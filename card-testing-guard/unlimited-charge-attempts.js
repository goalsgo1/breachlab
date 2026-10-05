// Vulnerable payment API — checks a card's validity as many times as
// asked. Each individual charge looks small (or $0), but an attacker
// abuses the response itself as a valid-card finder. Verified directly
// with hydra: found the one real card number in a 10-entry wordlist.
class UnlimitedChargeAttempts {
  constructor(validCards) {
    this.validCards = validCards; // Set<cardNumber>
  }

  charge(cardNumber) {
    if (this.validCards.has(cardNumber)) {
      return { status: 'card_valid' };
    }
    return { status: 'card_declined' };
  }
}

module.exports = { UnlimitedChargeAttempts };
