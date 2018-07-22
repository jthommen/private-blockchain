/** Tests for the blockchain */

// Running command: jasmine-node spec --autotest --watch .

const blockchain = require('../server/blockchain');
const level = require('../server/level-utilities');
jasmine.getEnv().defaultTimeoutInterval = 10000;


describe("Blockchain initialization", () => {

  it("should return 'Blockchain initialized' on success", (done) => {
    blockchain.init().then( (response) => {
      //expect(response.status).toBe('Blockchain initialized.');
      done();
    });
  });

});
