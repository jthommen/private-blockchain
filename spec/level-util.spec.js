/** Tests for the level-utilities */

// Running command: jasmine-node spec --autotest --watch .

const level = require('../server/level-utilities');

describe('Level Utilities', () => {

  it("should return block from DB", (done) => {
    level.getBlockFromDB(2).then(block => {
      expect(block.hash).toBeTruthy();
      expect(block.height).toBeTruthy();
      expect(block.body).toBeTruthy();
      expect(block.time).toBeTruthy();
      expect(block.previousBlockHash).toBeTruthy();
      done();
    });
  });

});
