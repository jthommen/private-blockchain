/** Blockchain management functions */

const Block = require('./model/block');
const chaindb = require('./utilities/chaindb-utilities');
const SHA256 = require('crypto-js/sha256');


// Function checks if chain already exists
// creates genesis block otherwise
// or returns blockheight
function init() {
    return chaindb.getBlockHeight()
      .then(blockHeight => {
        if(blockHeight === undefined) {
          console.log('New Blockchain created.');
          return addBlock("genesis");
        } else {
          let length = parseInt(blockHeight) + 1;
          console.log(`Blockchain already exist with ${length} block(s).`);
        }
        console.log("Blockchain initialized.");
        return 'Success';
      })
      .catch(err => console.log(err));
}

// Calls constructor to create new block
// overwrite properties in object
// add block to chain in chaindbDB
function addBlock(data) {
  if(!data) throw new Error("Can't create a block without data!");
  let newBlock = new Block();
  return chaindb.getBlockHeight()
    .then(blockHeight => {
      if(data === 'genesis') {
        newBlock.body = "First block in the chain - Genesis block";
        return;
      } else {
        newBlock.body = data;
        newBlock.height = blockHeight + 1;
        return chaindb.getBlockFromDB(blockHeight);
      }
    }).then((block) => {
      if(data !== 'genesis') newBlock.previousBlockHash = block.hash;

      newBlock.time = new Date().getTime().toString().slice(0,-3);
      newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

      let key = newBlock.height;
      let value  = JSON.stringify(newBlock);

      return chaindb.addBlockToDB(key, value);
    }).then( () => {
      let block = JSON.stringify(newBlock);
      console.log("New Block added to Chain.");
      return block;
    })
    .catch(err => console.log(err));
}

// Prints blockheight from blockchain db
function getBlockHeight() {
  return chaindb.getBlockHeight()
    .then( height => {
      console.log(`The block height is ${height}, there are ${height+1}
       block(s) in the chain.`)
       return height;
    })
    .catch(err => console.log(err));
}

// Prints block from blockchain db
function getBlock(blockHeight) {
  return chaindb.getBlockFromDB(blockHeight)
    .then( block => {
      return block;
    })
    .catch(err => {throw new Error(err)});
}

// Returns block from chain db
function getBlockByHash(hash) {
  return chaindb.getBlockByHash(hash)
    .then(block => {
      return block;
    })
    .catch(err => {throw new Error(err)});
}

// Returns array of blocks from chain db
function getBlocksByAddress(address) {
  return chaindb.getBlocksByAddress(address)
    .then(blocks => {
      return blocks;
    })
    .catch(err => {throw new Error(err)});
}

// Prints whole chain data
function getChain() {
  return chaindb.getChainFromDB()
    .then(chain => {return chain;})
    .catch(err => console.log(err));
}

// Validates whole chain
// get all blockchain data from chaindbDB
// run validation on single block and linkage
function validateChain(){
  return chaindb.getChainFromDB()
    .then(chain => {
      let errorLog = [];

      // validate genesis block
      if (!validation(chain[0])) errorLog.push(0);

      // validate rest of the blocks
      for (let i = 1; i < chain.length; i++) {
        // validate bock
        if (!validation(chain[i])) errorLog.push(i);
        // compare blocks hash link
        let previousBlockHash = chain[i].previousBlockHash;
        let blockHashPrevious = chain[i-1].hash;
        if (previousBlockHash !== blockHashPrevious) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+ errorLog);
        return errorLog;
      } else {
        console.log('No errors detected.');
        return 'No errors detected.';
      }
    });
}

// Calls the validation function to validate a single block
function validateBlock(blockHeight) {
  return chaindb.getBlockFromDB(blockHeight.toString())
    .then(block => {
      if(!validation(block)) {
        console.log(`Block ${blockHeight} is corrupted!`);
        return false;
      } else {
        console.log(`Block ${blockHeight} is secure.`);
        return true;
      }
    })
    .catch(err => console.log(err));
}

// Validation helper function
function validation(block){

  // Clone object so it's not corrupted for further testin
  let clone = Object.assign({}, block);

  // get block hash
  let blockHash = clone.hash;
  // remove block hash to test block integrity
  clone.hash = '';
  // generate block hash
  let validBlockHash = SHA256(JSON.stringify(clone)).toString();
  // Compare
  if (blockHash===validBlockHash) {
      return true;
    } else {
      console.log('Block #'+clone.height+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
      return false;
  }
}

module.exports = {
  init: init,
  addBlock: addBlock,
  getBlockHeight: getBlockHeight,
  getBlock: getBlock,
  getBlockByHash: getBlockByHash,
  getBlocksByAddress: getBlocksByAddress,
  getChain: getChain,
  validateBlock: validateBlock,
  validateChain: validateChain
}
