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

// Gets Blocks from the DB and prints them out
server.route({
  method: 'GET',
  path: '/block/{height}',
  handler: async (request, reply) => {
    let blockHeight = parseInt(encodeURIComponent(request.params.height));
    let block = await blockchain.getBlock(blockHeight);
    return block;
  }
});

// Saves a new block in the DB
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
        let blockData = request.payload.body.toString();
        let block = await blockchain.addBlock(blockData);
        return block;
      } catch(err) { throw new Error(err)}
    }
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
