const Blockchain = require('./blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'genesis data' });

const lastBlock = blockchain.chain[blockchain.chain.length - 1];
console.log(lastBlock);

let previousTimeStamp, nextTimeStamp, nextBlock, timeDifference, averageTime;

const times = [];

// mine 10,000 block
for (let i = 0; i < 1000; i++) {
  // Get previous time stamp
  previousTimeStamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

  // Add the 10,000 blocks
  blockchain.addBlock({ data: `this is block ${i}` });
  // get the next block
  nextBlock = blockchain.chain[blockchain.chain.length - 1];

  // Get the next timestamp
  nextTimeStamp = nextBlock.timestamp;
  // Get the time difference between each block
  timeDifference = nextTimeStamp - previousTimeStamp;
  times.push(timeDifference);

  // Calculate the average time it takes to mine a block
  averageTime = times.reduce((total, item) => total + item) / times.length;

  console.log(
    `Block ${i}. Time taken to mine block: ${timeDifference}ms.
      Difficulty: ${nextBlock.difficulty}.
      Average time: ${averageTime}ms`
  );
}
