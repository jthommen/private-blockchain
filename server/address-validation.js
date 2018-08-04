/** Functions to validate bitcoin addresses within time window  */

const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

const VALIDATION_WINDOW = 86400; //sek
const REGISTRY = 'starRegistry';
const CLEANUP_INTERVAL = 300; // sek
const validationRequests = [];


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
function finishValidation(address, signature) {
  let resonse;
  let validationTimeStamp = new Date().getTime().toString().slice(0,-3);


  // Get saved request
  let savedRequest = validationRequests.filter( request => {
    return request.address === address;
  });

  console.log('Validation Timestamp: ', validationTimeStamp);
  console.log('Saved Request: ', savedRequest);
  console.log('Saved Request Length: ', savedRequest.length);


  if( savedRequest.length === 0 || validationTimeStamp - saved.request[0].requestTimeStamp > VALIDATION_WINDOW) {
      response = {
        registerStar: false,
        status: {
          address: address,
          message: 'Validation unsuccessful, please start over.' 
        }
      }

  } else {
    response = {
      registerStar: true,
      status: {
        address: address,
        requestTimeStamp: '',
        message: '',
        validationWindow: 0,
        messageSignature: ''
      }
    };
  }

  console.log('Response: ', response);
  //let verification = bitcoinMessage.verify()

  return response;
}

// Clean-up job that discards expired validation requests
function requestCleanup() {

  // Run function at set interval
  setInterval( () => {
    let validationRequestQueue = validationRequests.length;
    let discardedRequests;

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
  cleanUp: requestCleanup
}