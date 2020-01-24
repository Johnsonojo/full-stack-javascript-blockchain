const Block = require('./block');
const cryptoHash = require('./crypto.hash');

class Blockchain {
  constructor() {
    this.chain = [Block.genesisBlock()];
  }

  // ADD A BLOCK TO THE CHAIN
  addBlock({ data }) {
    const lastBlock = this.chain[this.chain.length - 1];
    const newBlock = Block.mineBlock({
      lastBlock,
      data
    });

    this.chain.push(newBlock);
  }
  // VALIDATE A CHAIN
  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesisBlock())) {
      return false;
    }
    // loop through the chain
    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[i];
      const realLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      if (lastHash !== realLastHash) {
        return false;
      }
      const validHash = cryptoHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );

      if (hash !== validHash) {
        return false;
      }
      if (Math.abs(lastDifficulty - difficulty) > 1) {
        return false;
      }
    }
    return true;
  }

  // REPLACE THE CHAIN WITH NEW LONGER CHAIN
  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error('The incoming chain must be longer than the current chain');
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error('The incoming chain must be valid');
      return;
    }
    console.log('The current chain is being replaced by the new chain', chain);

    this.chain = chain;
  }
}

module.exports = Blockchain;
