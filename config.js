const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;

const GENESIS_BLOCK_DATA = {
  timestamp: 2020,
  lastHash: 'none',
  hash: 'genesis',
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: []
};

module.exports = { GENESIS_BLOCK_DATA, MINE_RATE };
