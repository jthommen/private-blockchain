/** Handles star registraion process, validation and then blockchain storage */

const validation = require('./address-validation');
const blockchain = require('./blockchain');
const addressDB = require('./utilities/addressdb-utilities');

function registration(address, data) {
  let response;

  // Validates address
  // fails if no address --> error
  return validation.verifyAddress(address)

    // Verify if address is eligible to create a star
    .then(validationResult => {
      console.log('Validation Result: ', validationResult);

      // Check if address is allowed to store star
      if(!validationResult) {
        return response = {
          registerStar: false,
          status: {
            address: address,
            message: 'Address invalid. Authorize first.' 
          }
        };
      } 

      // Check if star data is valid and convert to hex
      // return failure otherwise
      let starDataStatus = verifyStarData(data);
      console.log('Star Data Status : ', Boolean(starDataStatus));

      if(starDataStatus === false) {
        console.log('damn');
        return response = {
          registerStar: false,
          status: {
            address: address,
            message: 'Invalid star data.' 
          }
        };
      }
      
      // Build star data object    
      let starData = {
        address: address,
        star: {
          ra: data.ra,
          dec: data.dec,
          story: starDataStatus
        }
      };
      
      if(data.con) starData.star.con = data.con;
      if(data.mag) starData.star.mag = data.mag;

      return blockchain.addBlock(starData)
        .then(block => {
          response = block;
          return addressDB.removeAddressFromDB(address);
        })
        .then( status => {
          console.log('Address status: ', status);
          return response;
        });
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
