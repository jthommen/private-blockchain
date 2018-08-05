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
// Wallet validation: Request message
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
// Wallet validation: Post signed message
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

  // Star Registration Endpoint
  server.route({
    method: 'POST',
    path: '/block',
    options: {
      handler: async (request, h) => {
        try {
          // TODO: modify endpoint
          let address = request.payload.address.toString();
          let star = request.payload.star;
          let status = await starRegistration.registration(address, star);
          return h.response(status).header('Content-Type', 'application/json');
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
        try {
          let address = encodeURIComponent(request.params.address);
          let status = await addressDB.getAddressInfo(address);
          console.log(status);
          return status;
        } catch(err) { throw new Error(err) }
      },
      description: 'Get address validation',
      notes: 'address GET request',
      tags: ['api']
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
