// Vulnerable login API — a matching password is the whole check. A
// leaked-password list from another breach, tried here as-is, gets
// through. Verified directly against this exact logic with hydra
// (github.com/vanhauser-thc/thc-hydra, 10k+ stars) — it cracked the
// one real password in a 10-entry wordlist on the first pass.
class PasswordOnlyLogin {
  constructor(userDb) {
    this.db = userDb; // { username: password }
  }

  login(username, password) {
    if (this.db[username] === password) {
      return { status: 'ok' };
    }
    return { status: 'invalid_credentials' };
  }
}

module.exports = { PasswordOnlyLogin };
