/** Basic Hapi Server with GET & POST Endpoints */

'use strict';

// Basic server setup
const Hapi = require('hapi');
const blockchain = require('./blockchain');

const addressValidation = require('./address-validation');
const starRegistration = require('./star-registration');
const addressDB = require('./addressdb-utilities');

const server = Hapi.server({
    port: 8000,
    host: 'localhost'
});

// Server routes
server.route({
  method: 'POST',
  path: '/requestValidation',
  options: {
    handler: (request, h) => {
      try {
        let address = request.payload.address.toString();
        let response = addressValidation.start(address);
        return response;
      } catch(err) { throw new Error(err) }
    }
  }
});

// Finish validation
server.route({
  method: 'POST',
  path: '/message-signature/validate',
  options: {
    handler: (request, h) => {
      try {
        let address = request.payload.address.toString();
        let signature = request.payload.signature.toString();
        let response = addressValidation.finish(address, signature);
        console.log(response);
        return response;
      } catch(err) { throw new Error(err) }
    }
  }
});


// Example response:
// {
//   "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
//   "height": 1,
//   "body": {
//     "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
//     "star": {
//       "ra": "16h 29m 1.0s",
//       "dec": "-26° 29' 24.9",
//       "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
//     }
//   },
//   "time": "1532296234",
//   "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
// }
// Saves a new block in the DB
// Example POST request:
// curl -X "POST"
  // "http://localhost:8000/block"
  // -H 'Content-Type: application/json'
  // -d $'{"body":"block body contents"}'
  server.route({
    method: 'POST',
    path: '/block',
    options: {
      handler: async (request, h) => {
        try {
          // TODO: modify endpoint
          let address = request.payload.address;
          // verify if address is verified successfully
          // verify payload.body (max. 250 words or 500 bytes)
          // encode ASCII payload.body in hex
          // store star in new block
          // return
          // let blockData = request.payload.body.toString();
          // let block = await blockchain.addBlock(blockData);
          // return block;
        } catch(err) { throw new Error(err)}
      }
    }
  });

  // Helper to Add Address
  server.route({
    method: 'POST',
    path: '/addAddress',
    options: {
      handler: async (request, h) => {
        try {
          let address = request.payload.address;
          let response = await addressDB.addAddressToDB(address, 'valid');
          return response;
        } catch(err) { throw new Error(err) }
      }
    }
  });
  
  // Helper to retrieve address
  server.route({
    method: 'GET',
    path: '/address/{address}',
    config: {
      handler: async (request, h) => {
        let address = encodeURIComponent(request.params.address);
        let status = await addressDB.getAddressInfo(address);
        console.log(status);
        return status;
      },
      description: 'Get address validation',
      notes: 'address GET request',
      tags: ['api']
    }
  });

  // Testing route without level response
  server.route({
    method: 'GET',
    path: '/addressTest/{address}',
    handler: (request, h) => {
      let address = encodeURIComponent(request.params.address);
      console.log('Test Address: ', address);
      console.log('Test Address Type. ', typeof address);
      let response = `Everything okay with address: ${address}.`;
      return h.response(response).type('text/html').code(200);
    }
  });

  // TODO: Add star look-up routines
  // Gets Blocks from the DB in different ways and prints them out

  // 1. Star objects per submitted address
  // search for stars with specific address

  // 2. Star object by hash
  // return star object with specific block hash

  // 3. TODO modify to return star by block height
  server.route({
    method: 'GET',
    path: '/block/{height}',
    handler: async (request, h) => {
      try {
        let blockHeight = parseInt(encodeURIComponent(request.params.height));
        let block = await blockchain.getBlock(blockHeight);
        return block;
      } catch(err) { throw new Error(err) }
    }
  });

// Initialize server
const init = async () => {
    await blockchain.init();
    await server.start();
    addressValidation.cleanUp();
    console.log(`Server running at: ${server.info.uri}`);
    return;

};

// Error handling
process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
