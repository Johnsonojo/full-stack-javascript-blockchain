const sha256 = require('sha256');
const crypto = require('crypto');

const cryptoHash = (...args) => {
  const hash = crypto.createHash('sha256').update(args.sort().join(' '));

  return hash.digest('hex');
};

module.exports = cryptoHash;
