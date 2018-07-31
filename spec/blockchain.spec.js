/** Tests for the blockchain */

// Running command: jasmine-node spec --autoTest --watchFolders .

const blockchain = require('../server/blockchain');
const level = require('../server/level-utilities');
const blockdata = require('./chaindata');

jasmine.getEnv().defaultTimeoutInterval = 10000;


describe('Blockchain initialization', () => {

  it("should return 'success'", (done) => {
    spyOn(level, 'getBlockHeight').and.returnValue(Promise.resolve(1));

    blockchain.init().then(response => {
      expect(level.getBlockHeight).toHaveBeenCalled();
      expect(response).toBe('Success');
      done();
    });

  });

});

describe('Add block function', () => {

  it('should return an error when called without param', (done) => {
    expect(blockchain.addBlock).toThrow(new Error("Can't create a block without data!"));
    done();
  });

  it('should generate the right block data', (done) => {
    spyOn(level, 'getBlockHeight').and.callFake( () => {
      return Promise.resolve(1)
    });
    spyOn(level, 'getBlockFromDB').and.callFake( () => {
      return Promise.resolve(blockdata[1]);
    });
    spyOn(level, 'addBlockToDB').and.callFake( () => {
      return Promise.resolve(blockdata[2]);
    });

    blockchain.addBlock("Test Data").then( response => {
      let block = JSON.parse(response);

      expect(block.height).toBe(blockdata[2].height);
      expect(block.body).toBe(blockdata[2].body);
      expect(block.previousBlockHash).toBe(blockdata[2].previousBlockHash);
      done();
    });

  });

});

describe('GetBlockHeight', () => {

  it('should return the block height', (done) => {
    spyOn(level, 'getBlockHeight').and.callFake(() => {
      return Promise.resolve(2);
    });

    blockchain.getBlockHeight().then(response => {
      expect(response).toBe(2);
      done();
    })

  });

});

describe("getBlock", () => {

  it("should return a block", (done) => {
    spyOn(level, 'getBlockFromDB').and.callFake( () => {
      return Promise.resolve(blockdata[2]);
    });

    blockchain.getBlock(2).then(block => {
      expect(block).toBe(blockdata[2]);
      done();
    });

  });
});

describe("getChain", () => {

  it("should return chain data", (done) => {
    spyOn(level, 'getChainFromDB').and.callFake(() => {
      return Promise.resolve(blockdata);
    });

    blockchain.getChain().then(chain => {
      expect(chain).toBe(blockdata);
      done();
    });
  });

});

describe("valiateChain", () => {

  it("should validate the chain", (done) => {
    spyOn(level, 'getChainFromDB').and.callFake(() => {
      return Promise.resolve(blockdata);
    });

    blockchain.validateChain().then( result => {
      expect(result).toBe('No errors detected.');
      done();
    });
  });
});

describe("validateBlock", () => {

  process.on("unhandledRejection", (error) => {
    console.error(error); // This prints error with stack included (as for normal errors)
    throw error; // Following best practices re-throw error and let the process exit with error code
  });

  it("should validate one block", (done) => {

    spyOn(level, 'getBlockFromDB').and.callFake( () => {
      return Promise.resolve(blockdata[1]);
    });

    blockchain.validateBlock(1).then(result => {
      expect(result).toBe(true);
      done();
    });

  });

});

