const cryptoHash = require('./crypto.hash');
const { GENESIS_BLOCK_DATA } = require('./config');

class Block {
  constructor({ timestamp, lastHash, hash, data }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  // GENESIS BLOCK
  static genesisBlock() {
    return new Block(GENESIS_BLOCK_DATA);
  }

  // MINE A BLOCK
  static mineBlock({ lastBlock, data }) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = cryptoHash(timestamp, lastHash, data);

    return new Block({
      timestamp,
      lastHash,
      hash,
      data
    });
  }
}

module.exports = Block;
