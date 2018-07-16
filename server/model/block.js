//### Define Block constructor

const SHA256 = require('crypto-js/sha256');

module.exports = function Constructor() {
  this.hash  = SHA256(JSON.stringify(this)).toString();
  this.height =  0;
  this.body = "";
  this.time = new Date().getTime().toString().slice(0,-3);
  this.previousBlockHash =  ""
}
