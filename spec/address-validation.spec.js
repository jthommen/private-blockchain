/** Tests for validating the adress validation procedure  */

const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

// Generate random keyPair
let keyPair = bitcoin.ECPair.makeRandom();

// Generate private key as buffer
const privateKey = keyPair.__d;

// Supply message und sign it
const message = 'This is a signed message';
const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);
console.log('Signature: ', signature.toString('base64'));

// Verify signed message
const publicKey = keyPair.publicKey;
const { address } = bitcoin.payments.p2pkh({ pubkey: publicKey});
const verification = bitcoinMessage.verify(message, address, signature);
console.log('Verfication result: ', verification);
