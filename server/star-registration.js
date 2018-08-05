const validation = require('./address-validation');

function registration(address, data) {
  // Validates address
  return validation.verifyAddress(address);
  // Calls blockchain.addBlock()
  // Then adds blockchain data to response
  // returns response
}

module.exports = {
  registration: registration
};
