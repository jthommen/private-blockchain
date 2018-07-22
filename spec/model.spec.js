/** Tests for the block model */

// Running command: jasmine-node spec --autotest --watch .

const Block = require('../server/model/block');

describe("Block model", () => {

  it("should return a new block", () => {
    let block = new Block();

    expect(block.hash).toBe("");
    expect(block.height).toBe(0);
    expect(block.body).toBe("");
    expect(block.time).toBe("");
    expect(block.previousBlockHash).toBe("");

  });
});
