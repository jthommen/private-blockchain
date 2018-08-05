/** Helper functions to interact with the blockchain levelDB */

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Get single block data from levelDB
function getBlockFromDB(blockHeight){
  return new Promise( (resolve, reject) => {
    let key = blockHeight.toString();
    db.get(key)
    .then(block => resolve(JSON.parse(block)))
    .catch(err => reject( new Error('Not found! ', err)));
  });
}

// Get block from chainDB by hash value
function getBlockByHash(hash)  {
  return new Promise( (resolve, reject) => {
    db.createReadStream()
      .on('data', data => {
        let parsed = JSON.parse(data.value);
        if(parsed.hash === hash) resolve(parsed);
      })
      .on('error', err => {
        reject(new Error('Unable to read data stream!', err));
      });
  });
}

// Get blocks from chainDB by creation address
function getBlocksByAddress(address) {
  return new Promise( (resolve, reject) => {
    let results = [];
    db.createReadStream()
      .on('data', data => {
        let parsed = JSON.parse(data.value);
        if(parsed.body.address === address) results.push(parsed);
      })
      .on('error', err => {
        reject(new Error('Unable to read data stream!', err));
      })
      .on('close', () => {
        resolve(results);
      });
  });
}

// Get whole blockchain data from levelDB
function getChainFromDB(){
  return new Promise( (resolve, reject) => {
    let chain = [];
    db.createValueStream()
      .on('data', block => {
        chain.push(JSON.parse((block)));
      }).on('error', (err) => {
        reject(new Error('Unable to read data stream!', err));
      }).on('close', () => {
        resolve(chain);
      });
  });
}

// Add block to chain in levelDB
function addBlockToDB(height, block) {
  return new Promise( (resolve, reject) => {
    db.put(height, block)
      .then( block => resolve(block))
      .catch( err => reject(new Error(`Block ${height} submission failed `, err)));
  });
}

// Checks last block in DB and returns the block height
function getBlockHeight(){
  return new Promise( (resolve, reject) => {
    let dataLength = 0;
    db.createKeyStream({reverse: true, limit: 1})
      .on('data', (key) => {
        dataLength++;
        resolve(parseInt(key));
      })
      .on('close', function () {
        if(dataLength < 1) {
          resolve(undefined);
        }
      })
      .on('error', err => {
        reject(new Error("getBlockHeight - Error occured reading block height: ", err));
      })
  });
}

module.exports = {
  getBlockFromDB: getBlockFromDB,
  getBlockByHash: getBlockByHash,
  getBlocksByAddress: getBlocksByAddress,
  getChainFromDB: getChainFromDB,
  addBlockToDB: addBlockToDB,
  getBlockHeight: getBlockHeight
}
