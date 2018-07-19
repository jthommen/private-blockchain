//### Blockchain management functions

const Block = require('./model/block');
const level = require('./level-utilities');
const SHA256 = require('crypto-js/sha256');


// Function checks if chain already exists
// creates genesis block otherwise
// or returns blockheight
function init() {
    level.getBlockHeight()
    .then(blockHeight => {
      if(blockHeight === undefined) {
        console.log('New Blockchain created.');
        return addBlock("genesis");
      } else {
        let length = parseInt(blockHeight) + 1;
        console.log(`Blockchain already exist with ${length} block(s).`);
      }
      console.log("Blockchain initialized.");
    })
    .catch(err => console.log(err));
}

// call constructor to create new block
// Overwrite properties in object
// add block to chain in levelDB
// return success or error message
function addBlock(data) {
  if(!data) throw new Error("Can't create a block without data!");
  let newBlock = new Block();
  level.getBlockHeight()
    .then(blockHeight => {
      if(data === 'genesis') {
        newBlock.body = "First block in the chain - Genesis block";
        return;
      } else {
        newBlock.body = data;
        newBlock.height = blockHeight + 1;
        return level.getBlockFromDB(blockHeight);
      }
    }).then((block) => {
      if(data !== 'genesis') newBlock.previousBlockHash = block.hash;

      newBlock.time = new Date().getTime().toString().slice(0,-3);
      newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

      let key = newBlock.height;
      let value  = JSON.stringify(newBlock);

      return level.addBlockToDB(key, value);
    }).then( (msg) => console.log(msg))
    .catch(err => console.log(err));
}

// Prints blockheight from blockchain db
function getBlockHeight() {
  level.getBlockHeight()
    .then( height => console.log("The block height is: ", height))
    .catch(err => console.log(err));
}

// prints block from blockchain db
function getBlock(blockHeight) {
  level.getBlockFromDB(blockHeight)
    .then( block => {
      console.log(block);
    })
    .catch(err => console.log(err));
}

// TODO: Write with promises
function validateBlock(blockHeight){
// Function validate block
  // check for block data from levelDB
  // run validation
  // return result
let block = getBlock(blockHeight);
// get block hash
let blockHash = block.hash;
// remove block hash to test block integrity
block.hash = '';
// generate block hash
let validBlockHash = SHA256(JSON.stringify(block)).toString();
// Compare
if (blockHash===validBlockHash) {
    return true;
  } else {
    console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
    return false;
  }
}

// TODO: Write with promises
function validateChain(){
// Function validate chain
  // get all blockchain data from levelDB
  // run validation
  // return result

  // Validate blockchain
  let chain = level.getChainFromDB();
  let blockHeight = level.getBlockHeight();
  let errorLog = [];
  for (var i = 0; i < blockHeight; i++) {
    // validate block
    if (!validateBlock(i)) errorLog.push(i);
    // compare blocks hash link
    let blockHash = chain[i].hash;
    let previousHash = chain[i+1].previousBlockHash;
    if (blockHash!==previousHash) {
      errorLog.push(i);
    }
  }
  if (errorLog.length>0) {
    console.log('Block errors = ' + errorLog.length);
    console.log('Blocks: '+errorLog);
  } else {
    console.log('No errors detected');
  }
}

module.exports = {
  init: init,
  addBlock: addBlock,
  getBlockHeight: getBlockHeight,
  getBlock: getBlock,
  validateBlock: validateBlock,
  validateChain: validateChain
}
