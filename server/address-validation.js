/** Functions to validate bitcoin addresses within time window  */

const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const adressdb = require('./utilities/addressdb-utilities');

const VALIDATION_WINDOW = 300; //sek
const REGISTRY = 'starRegistry';
const CLEANUP_INTERVAL = 30; // sek
const validationRequests = []; // In-memory DB for expiring validation requests


// Returns an object that allows client side message signing for a specified address
function startValidation(address) {
  let requestTime  = new Date().getTime().toString().slice(0,-3);
  let message = `${address}:${requestTime}:${REGISTRY}`;
  let response = {
    address: address,
    requestTimeStamp: requestTime,
    message: message, 
    validationWindow: VALIDATION_WINDOW
  };

  validationRequests.push({
    address: address, 
    requestTimeStamp: parseInt(requestTime),
    message: message
  });

  return response;
}

// Takes an address and signature and validates them
function finishValidation(walletAddress, signature) {
  let response;
  let validationTimeStamp = new Date().getTime().toString().slice(0,-3);


  // Get saved request
  let savedRequest = validationRequests.filter( request => {
    return request.address === walletAddress;
  });

  // SUGGESTION: Loop over requests found and check if one is valid

  // Get's saved properties from validation step 1
  let savedMessage = savedRequest[0].message;
  let savedRequestTimeStamp = savedRequest[0].requestTimeStamp;
  let savedAddress = savedRequest[0].address;
  let validationWindow = validationTimeStamp - savedRequestTimeStamp;

  // Checks if there is valid stored validation request
  // Returns unsuccessful otherwise
  if( savedRequest.length === 0 || validationTimeStamp - savedRequest[0].requestTimeStamp > VALIDATION_WINDOW) {
      response = {
        registerStar: false,
        status: {
          address: walletAddress,
          message: 'Validation unsuccessful, please start over.' 
        }
      }
  } else {

    // Checks if signature provided is valid
    // Returns unsuccessful otherwise
    let signatureValidation = bitcoinMessage.verify(savedMessage, walletAddress, signature);

    if(!signatureValidation) {
      response = {
        registerStar: false,
        status: {
          address: walletAddress,
          message: 'Validation unsuccessful, please start over.' 
        }
      };
    } else {

      // If all checks pass, build success response
      response = {
        registerStar: true,
        status: {
          address: savedAddress,
          requestTimeStamp: savedRequestTimeStamp,
          message: savedMessage,
          validationWindow: validationWindow,
          messageSignature: 'valid'
        }
      };

      storeValidatedAddress(savedAddress);
    }
    
  }
  return response;
}

// Looks up an address in the adressDB and verifies it
function verifyAddress(address) {
  return adressdb.getAddressInfo(address)
    .then(value => {
      return value === 'valid' ?  true :  false;
    })
    .catch(err => console.log('An error Occured: ', err));
}

// Stores an address in the addressDB
function storeValidatedAddress(address) {
  adressdb.addAddressToDB(address, 'valid')
  .then( value => console.log(value))
  .catch( err => console.log(err));
}

// Clean-up job that discards expired validation requests on regular interval
function requestCleanup() {

  // Run function at set interval
  setInterval( () => {
    let validationRequestQueue = validationRequests.length;
    let discardedRequests = 0;

    console.log('Validation Requests cached: ', validationRequestQueue);

    // Only run when requests are queued
    if(validationRequests.length > 0) {

      // Get new timestamp at interval start
      let timeStamp = new Date().getTime().toString().slice(0,-3);

      // Loop over array and find first request with valid timestamp
      validationRequests.forEach( (request, i) => {
        if(timeStamp - request.requestTimeStamp > VALIDATION_WINDOW) {
          validationRequests.splice(0, i);
          discardedRequests = i;
        }
      });

      console.log('Validation Requests discarded: ', discardedRequests);
    }

  }, CLEANUP_INTERVAL * 1000);
}


module.exports = {
  start: startValidation,
  finish: finishValidation,
  verifyAddress: verifyAddress,
  storeValidatedAddress: storeValidatedAddress,
  cleanUp: requestCleanup
}
