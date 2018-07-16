//### Helper functions to interact with levelDB

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Get single block data
function getBlockFromDB(blockHeight){
  db.get(blockHeight, function(err, block) {
    if (err) {
      console.log('Not found!', err);
      return;
    }
    return block;
  });
}

// Get whole blockchain data
function getChainFromDB(){
  let chain = [];
  db.createReadStream().on('data', function(block) {
      chain.push(block);
    }).on('error', function(err) {
      console.log('Unable to read data stream!', err);
      return chain;
    }).on('close', function() {
      console.log(`Chain data retrieved: ${height} blocks.`);
      return chain;
    });
}

// Add block to chain
function addBlockToDB(height, block){
  db.put(height, block, function(err) {
    if (err) return console.log(`Block ${height} submission failed`, err);
    return console.log(`Block ${height} added to chain.`);
  })
}

function increaseBlockHeight(){
  db.get('height', (err, height) => {
    if(err) {
      if(err.notFound) {
        setBlockHeight();
        return;
      } else {
        return console.log('IncreaseBlockHeight Error occured: ', err);
      }
    }
    let incrementHeight = height++;
    db.put('height', incrementHeight, err => console.log('Error occured: ', err));
  });
  
}

function getBlockHeight(){
  db.get('height', (err, height) => {
    if(err) {
      if(err.notFound) {
        setBlockHeight();
        return 0;
      } else {
        return console.log('IncreaseBlockHeight Error occured: ', err);
      }
    }
    return height;
  });
}

function setBlockHeight(){
  db.put('height', 0, err => {
    if(err) return console.log('setBlockHeight Error occured: ', err)
  });
}

module.exports = {
  getBlockFromDB: getBlockFromDB,
  getChainFromDB: getChainFromDB,
  addBlockToDB: addBlockToDB,
  increaseBlockHeight: increaseBlockHeight,
  getBlockHeight: getBlockHeight
}
