/** Handles star registraion process, validation and then blockchain storage */

const validation = require('./address-validation');
const blockchain = require('./blockchain');

function registration(address, data) {

  // Validates address
  // fails if no address --> error
  return validation.verifyAddress(address)
    .then(response => {
      if(response) {
        let starDataStatus = verifyStarData(data);
        if(!starDataStatus) return new Error('Invalid star data.');
        return starDataStatus;
      } else {
        return new Error('Address invalid. Authorize first');
      }
    })
    .then( starStoryHex => {
      // Compose star body object to add block
      let starData = {
        address: address,
        star: {
          ra: data.ra,
          dec: data.dec,
          story: starStoryHex
        }
      };
      if(data.con) starData.star.con = data.con;
      if(data.mag) starData.star.mag = data.mag;

      return blockchain.addBlock(starData);
    });
}

// Verifies star data & encodes star story
function verifyStarData(data) {

  // Check if necessary star elements are there
  if(!data.ra || !data.dec || !data.story) return false;
  let story = data.story.toString();

  // Convert story to buffer, check length and then encode in hex
  let storyBuffer = Buffer.from(story, 'utf8');
  let storyBufferSize = Buffer.byteLength(storyBuffer);
  if(storyBufferSize > 500) return false;

  return storyBuffer.toString('hex');
}

module.exports = {
  registration: registration
};
