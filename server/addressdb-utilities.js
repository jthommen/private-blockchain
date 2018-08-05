/** Helper fucntions to interact with the address levelDB */

const level = require('level');
const addressDB = './adressdata';
const db = level(addressDB);

function addAddressToDB(address) {
  return new Promise( (resolve, reject ) => {
    db.put(address.toString(), 'valid')
      .then( () => resolve('Stored Address.'))
      .catch(err => reject(err));
  });
}

// Checks how many stars an address still can create
function getAddressInfo(address) {
  return new Promise( (reject, resolve) => {
    db.get(address.toString())
      .then(value => resolve(value))
      .catch(err => reject(err));
  });
}

module.exports = {
  addAddressToDB: addAddressToDB,
  getAddressInfo: getAddressInfo
};
