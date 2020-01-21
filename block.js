const hexToBinary = require('hex-to-binary');
const cryptoHash = require('./crypto.hash');
const { GENESIS_BLOCK_DATA, MINE_RATE } = require('./config');

class Block {
  constructor({ timestamp, lastHash, hash, nonce, difficulty, data }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
    this.data = data;
  }

  // GENESIS BLOCK
  static genesisBlock() {
    return new Block(GENESIS_BLOCK_DATA);
  }

  // MINE A BLOCK
  static mineBlock({ lastBlock, data }) {
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 0;

    // Proof of work
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp
      });
      hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty)
    );

    return new Block({
      timestamp,
      lastHash,
      hash,
      data,
      nonce,
      difficulty
    });
  }

  // ADJUST THE MINE RATE OF BLOCKS
  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;

    if (difficulty < 1) return 1;
    const timeDifference = timestamp - originalBlock.timestamp;
    if (timeDifference > MINE_RATE) {
      return difficulty - 1;
    }

    return difficulty + 1;
  }
}

module.exports = Block;
