/** Helper fucntions to interact with the address levelDB */

const level = require('level');
const addressDB = './addressdata';
const db = level(addressDB);

// Add validated address to level db
function addAddressToDB(address) {
  return new Promise( (resolve, reject ) => {
    db.put(address.toString(), 'valid')
      .then( () => resolve('Stored Address.'))
      .catch(err => reject(err));
  });
}

// Checks if address exists and is eligible for star creation
function getAddressInfo(address) {
  return new Promise( (resolve, reject) => {
    db.get(address.toString(), (err, value) => {
      if(err) {
        if(err.notFound) return resolve('Not found!');
        return reject(err);
      }
      resolve(value);
    });
  });
}

module.exports = {
  addAddressToDB: addAddressToDB,
  getAddressInfo: getAddressInfo
};
