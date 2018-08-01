/** Basic Hapi Server with GET & POST Endpoints */

'use strict';

// Basic server setup
const Hapi = require('hapi');
const blockchain = require('./blockchain');

const server = Hapi.server({
    port: 8000,
    host: 'localhost'
});

// Server routes

// TODO: verification request
// Example request:
// curl -X "POST" "http://localhost:8000/requestValidation" \
//      -H 'Content-Type: application/json; charset=utf-8' \
//      -d $'{
//   "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
// }'
// Example response:
// {
//   "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
//   "requestTimeStamp": "1532296090",
//   "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry",
//   "validationWindow": 300
// }
server.route({
  method: 'POST',
  path: '/requestValidation',
  config: {
    handler: async (request, reply) => {
      try {
        let address = request.payload.address.toString();
        // TODO: compose response
        // Message to verify:
        // [walletAddress]:[timeStamp]:starRegistry
        // save response in levelDB instance
      } catch(err) { throw new Error(err) }
    }
  }
});

// TODO: Message signature validation
// Example request:
// curl -X "POST" "http://localhost:8000/message-signature/validate" \
//      -H 'Content-Type: application/json; charset=utf-8' \
//      -d $'{
//   "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
//   "signature": "H6ZrGrF0Y4rMGBMRT2+hHWGbThTIyhBS0dNKQRov9Yg6GgXcHxtO9GJN4nwD2yNXpnXHTWU9i+qdw5vpsooryLU="
// }'
// Example response:
// {
//   "registerStar": true,
//   "status": {
//     "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
//     "requestTimeStamp": "1532296090",
//     "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry",
//     "validationWindow": 193,
//     "messageSignature": "valid"
//   }
// }
server.route({
  method: 'POST',
  path: '/message-signature/validate',
  config: {
    handler: async (request, response) => {
      try {
        let address = request.payload.address.toString();
        let signature = request.payload.signature.toString();
        // TODO: compose response
        // search levelDB for request of address
        // verify if request exists and is still valid
        // validate with bitcoin identity: bitcoinjs-message & bitcoinjs-lib
        // compose response & grant or deny access
      } catch(err) { throw new Error(err) }
    }
  }
});

// TODO: Create star registry entry
// Example request:
// curl -X "POST" "http://localhost:8000/block" \
//      -H 'Content-Type: application/json; charset=utf-8' \
//      -d $'{
//   "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
//   "star": {
//     "dec": "-26° 29'"'"' 24.9",
//     "ra": "16h 29m 1.0s",
//     "story": "Found star using https://www.google.com/sky/"
//   }
// }'
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
    config: {
      handler: async (request, reply) => {
        try {
          // TODO: modify endpoint
          // verify if address is verified successfully
          // verify payload.body (max. 250 words or 500 bytes)
          // encode ASCII payload.body in hex
          // store star in new block
          // return
          let blockData = request.payload.body.toString();
          let block = await blockchain.addBlock(blockData);
          return block;
        } catch(err) { throw new Error(err)}
      }
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
    handler: async (request, reply) => {
      let blockHeight = parseInt(encodeURIComponent(request.params.height));
      let block = await blockchain.getBlock(blockHeight);
      return block;
    }
  });

// Initialize server
const init = async () => {
    await blockchain.init();
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    return;

};

// Error handling
process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
