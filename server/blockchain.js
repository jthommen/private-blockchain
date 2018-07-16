//### Blockchain management functions

const Block = require('./model/block');
const level = require('./level-utilities');

// Function checks if chain already exists
// creates genesis block otherwise
// or returns blockheight
function init() {
  let blockHeight = level.getBlockHeight();
  if(blockHeight === undefined) {
    console.log('New Blockchain created.');
    addBlock("genesis");
  } else {
    console.log(`Blockchain already exist with ${blockHeight} blocks.`);
  }
}

  // call constructor to create new block
  // Overwrite properties in object
  // add block to chain in levelDB
  // return success or error message
function addBlock(data) {
  let newBlock = new Block();
  level.increaseBlockHeight();
  let blockHeight = level.getBlockHeight();

  console.log(blockHeight);
  
  if(data === 'genesis') {
    newBlock.body = "First block in the chain - Genesis block";
  } else {
    newBlock.body = data;
    newBlock.height = blockHeight+1;
    newBlock.previousBlockHash = level.getBlockFromDB.blockHash;
  }
  level.addBlockToDB(newBlock.height, newBlock);
}

function getBlockHeight() {
// Function get block height
  // get all blockchain data from levelDB
  // get length
  // return length
  return level.getBlockHeight();
}

function getBlock(blockHeight) {
// Function get block
  // check for block in levelDB
  // return block data
  return level.getBlockFromDB(blockHeight);
}

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
