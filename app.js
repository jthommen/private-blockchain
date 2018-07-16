//### Simplechain Front-End functions to interact with the blockchain

const blockchain = require('./server/blockchain');

// Function initialize blockchain interaction
// (function() {
//   blockchain.init();
// })();

// Function test blockchain
function runTests(block=0) {
  console.log('=================');
  console.log('Starting Blockchain Testing....');
  console.log('=================');
  console.log("Chain Height: ", blockchain.getBlockHeight());
  console.log('=================');
  console.log("Adding Test Blocks...");
  generateTestBlocks();
  console.log("Chain Height: ", blockchain.getBlockHeight());
  console.log('=================');
  console.log("Validating chain...");
  blockchain.validateChain();
  console.log('=================');
  console.log('Returning one block: ', blockchain.getBlock(block));
  console.log('Validating one block: ', blockchain.validateBlock(block));
  console.log("=====\nFinished Chain Testing.");
};

// Generate test blocks for the chain
function generateTestBlocks(blocks=10){
  for(var i=0; i < blocks; i++){
    blockchain.addBlock("Test data "+i);
  }
  console.log(`Finished creating ${blocks} blocks.`);
}
