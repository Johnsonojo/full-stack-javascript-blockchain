const Block = require('./block');
const cryptoHash = require('./crypto.hash');

const { GENESIS_DATA } = require('./config');

describe('Block', () => {
  const timestamp = '2-day';
  const lastHash = 'the-lastHash';
  const hash = 'the-hash';
  const data = ['block', 'chain'];
  const block = new Block({ timestamp, lastHash, hash, data });

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

  describe('genesis()', () => {
    const genesisBlock = Block.genesis();

    it('returns a Block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it('should return the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe('mineBlock()', () => {
    const lastBlock = Block.genesis();
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
        cryptoHash(minedBlock.timestamp, lastBlock.hash, data)
      );
    });
  });
});
