const Blockchain = require('./blockchain');
const Block = require('./block');
const cryptoHash = require('./crypto.hash');

describe('Blockchain', () => {
  let blockchain, newChain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originalChain = blockchain.chain;
  });

  it('should have chain property defined', () => {
    expect(blockchain.chain).toBeDefined();
  });

  it('should contain a chain array', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it('should begin with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesisBlock());
  });

  it('should successfully add a block to the chain', () => {
    const newData = 'Block Chain';
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe('isValidChain()', () => {
    it('should return false when the chain does not start with the Block block', () => {
      blockchain.chain[0] = { data: 'incorrect-genesis-block' };
      expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
    });

    describe('When the chain starts with the genesis block and has multiple block', () => {
      beforeEach(() => {
        blockchain.addBlock({ data: 'block-2' });
        blockchain.addBlock({ data: 'block-3' });
        blockchain.addBlock({ data: 'block-4' });
        blockchain.addBlock({ data: 'block-5' });
      });

      it('should return false when a lastHash reference has changed', () => {
        blockchain.chain[2].lastHash = 'fake-lastHash';
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });

      it('should return false when the chain contains invalid block data', () => {
        blockchain.chain[2].data = 'block-6';
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });

      it('should return false for a chain with a jumped difficulty', () => {
        const lastBlock = blockchain.chain[blockchain.chain.length - 1];
        const lastHash = lastBlock.hash;
        const timestamp = Date.now();
        const nonce = 0;
        const data = [];
        const difficulty = lastBlock.difficulty - 3;
        const hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);
        const badBlock = new Block({
          timestamp,
          lastHash,
          hash,
          data,
          difficulty,
          nonce
        });

        blockchain.chain.push(badBlock);

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
      describe('and the chain contains valid blocks', () => {
        it('should return true', () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe('replaceChain()', () => {
    let errorMock, logMock;

    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();

      global.console.error = errorMock;
      global.console.log = logMock;
    });

    describe('when the new chain is not longer than the current chain', () => {
      beforeEach(() => {
        newChain.chain[0] = { new: 'chain' };
        blockchain.replaceChain(newChain.chain);
      });

      it('it does not replace the chain', () => {
        expect(blockchain.chain).toBe(originalChain);
      });

      it('logs and error', () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('when the new chain is longer than the current chain', () => {
      beforeEach(() => {
        newChain.addBlock({ data: 'block-2' });
        newChain.addBlock({ data: 'block-3' });
        newChain.addBlock({ data: 'block-4' });
        newChain.addBlock({ data: 'block-5' });
      });

      describe('and the chain is invalid', () => {
        beforeEach(() => {
          newChain.chain[2].hash = 'fake-hash';
          blockchain.replaceChain(newChain.chain);
        });

        it('it replaces the chain', () => {
          expect(blockchain.chain).toBe(originalChain);
        });
        it('logs an error', () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe('and the chain is valid', () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });

        it('replaces the chain', () => {
          expect(blockchain.chain).toBe(newChain.chain);
        });

        it('logs the chain replacement', () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });
});
