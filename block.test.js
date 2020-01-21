const hexToBinary = require('hex-to-binary');
const Block = require('./block');
const cryptoHash = require('./crypto.hash');
const { GENESIS_BLOCK_DATA, MINE_RATE } = require('./config');

describe('Block', () => {
  const timestamp = 2000;
  const lastHash = 'the-lastHash';
  const hash = 'the-hash';
  const data = ['block', 'chain'];
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty
  });

  it('has a timestamp property', () => {
    expect(block.timestamp).toEqual(timestamp);
  });

  it('has a lastHash property', () => {
    expect(block.lastHash).toEqual(lastHash);
  });

  it('has a hash property', () => {
    expect(block.hash).toEqual(hash);
  });

  it('has a data property', () => {
    expect(block.data).toEqual(data);
  });

  it('has a data property', () => {
    expect(block.nonce).toEqual(nonce);
  });

  it('has a data property', () => {
    expect(block.difficulty).toEqual(difficulty);
  });

  describe('genesisBlock()', () => {
    const genesisBlock = Block.genesisBlock();

    it('returns a Block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it('should return the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_BLOCK_DATA);
    });
  });

  describe('mineBlock()', () => {
    const lastBlock = Block.genesisBlock();
    const data = 'data to mine';
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it('returns a Block instance', () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it('should have the `lastHash` equal to the `hash` of the last block', () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it('should have the data set', () => {
      expect(minedBlock.data).toEqual(data);
    });

    it('should have the `timestamp` property', () => {
      expect(minedBlock.timestamp).toBeDefined();
    });

    it('creates a sha-256 `hash` based on the proper inputs', () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.nonce,
          minedBlock.difficulty,
          lastBlock.hash,
          data
        )
      );
    });

    it('sets a `hash` that matches the difficulty', () => {
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual('0'.repeat(minedBlock.difficulty));
    });

    it('adjusts the difficulty when mining a block', () => {
      const possibleDifficultyResult = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1
      ];
      expect(possibleDifficultyResult.includes(minedBlock.difficulty)).toBe(
        true
      );
    });
  });

  describe('adjustDifficulty()', () => {
    it('raises the difficulty for a quickly mined block', () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100
        })
      ).toEqual(block.difficulty + 1);
    });

    it('lowers the difficulty for a slowly mined block', () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100
        })
      ).toEqual(block.difficulty - 1);
    });

    it('sets lower of the difficulty to 1', () => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
    });
  });
});
