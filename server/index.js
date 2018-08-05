/** Basic Hapi Server with GET & POST Endpoints */

'use strict';

// Basic server setup
const express = require('express');
const bodyParser = require('body-parser');

const blockchain = require('./blockchain');
const addressValidation = require('./address-validation');
const starRegistration = require('./star-registration');
const addressDB = require('./addressdb-utilities');

const PORT = process.env.PORT || 8000;
const app = express();
app.use(bodyParser.json());

// Routes here
app.get('/', (req, res) => res.send('Express works'));


// Test Helpers: Get address
app.get('/address/:address', (req, res) => {
  let address = decodeURIComponent(req.params.address);
  addressDB.getAddressInfo(address) // function sends value as error!
    .then( response => {
      console.log('Response: ', response);
      res.send(response);
    })
    .catch( err => {
      console.log('Error: ', err);
      res.send(err);
    });
});

// Test Helpers: Post address
app.post('/addAddress', (req, res) => {
  let address = req.body.address;
  console.log('Address: ', address);
  addressDB.addAddressToDB(address, 'valid')
    .then(response => res.send(response))
    .catch( err => res.send(err));;
});

// Wallet validation: Request message
app.post('/requestValidation', (req, res) => {
  let address = req.body.address;
  let response = addressValidation.start(address);
  res.send(response);
});

// Wallet validation: Post signed message
app.post('/message-signature/validate', (req, res) => {
  let address = req.body.address;
  let signature = req.body.signature;
  console.log('address: ', address);
  console.log('signature: ', signature);
  let response = addressValidation.finish(address, signature);
  res.send(response);
});

// Star Registration: Add Star

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

app.post('/block', (req, res) => {
  let address = encodeURIComponent(req.body.address);
  // verify if address is verified successfully
  // verify body (max. 250 words or 500 bytes)
  // encode ASCII payload.body in hex
  // store star in new block
  // return
  // let blockData = request.payload.body.toString();
  // let block = await blockchain.addBlock(blockData);
});


// Get Star Information  

//   // TODO: Add star look-up routines
//   // Gets Blocks from the DB in different ways and prints them out

//   // 1. Star objects per submitted address
//   // search for stars with specific address

//   // 2. Star object by hash
//   // return star object with specific block hash

//   // 3. TODO modify to return star by block height

app.get('/block/:height', (req, res) => {
  let blockHeight = parseInt(encodeURIComponent(req.params.height));
  blockchain.getBlock(blockHeight)
    .then( response => res.send(response))
    .catch( err => res.send(err));  
});

app.listen(PORT, () => console.log(`Star Registry Notary Service listening on port ${PORT}!`));
blockchain.init();
addressValidation.cleanUp();
