// The fix: BOTH the password AND a second factor (TOTP-style) are
// required. Even a 100% correct leaked password is useless to an
// attacker who doesn't have the code that changes in real time.
// Verified: the same hydra run that cracked password-only-login.js
// found 0 valid passwords against this endpoint.
class MfaGuardedLogin {
  constructor(userDb, totpProvider) {
    this.db = userDb;
    this.totp = totpProvider; // .currentCode(username)
  }

  login(username, password, totpCode) {
    if (this.db[username] !== password) {
      return { status: 'invalid_credentials' };
    }
    if (totpCode !== this.totp.currentCode(username)) {
      return { status: 'invalid_credentials' }; // never reveal which part was wrong
    }
    return { status: 'ok' };
  }
}

module.exports = { MfaGuardedLogin };
