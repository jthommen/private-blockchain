/** Simplechain Front-End functions to interact with the blockchain */

const blockchain = require('./server/blockchain');

// Function initializes blockchain interaction
(function() {
  blockchain.init();
})();
