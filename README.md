# Blockchain Developer Nanodegree - Project Stage Private Blockchain Notary Service: Star Registry
---
## API Setup
1. Clone/download repository and navigate to folder in console/terminal window
2. change into the folder
3. run ```npm i```
4. run ```node ./server/index.js```
5. Try API endpoints:
  * GET:  ```http://localhost:8000/block/0```
  * POST: Use Curl command in terminal: ```curl -X "POST" "http://localhost:8000/block" -H 'Content-Type: application/json' -d $'{"body":"Test Block Data"}'```
6. Enjoy the blockchain interaction!

## How To Register a Star
### Register your wallet address
1. Request message to sign: POST ```http://localhost:8000/requestValidation``` with POST payload: ```{"address": "BITCOIN WALLET ADDRESS"}```
2. Sign received message with your bitcoin wallet
3. Post signed message: POST ```http://localhost:8000/message-signature/validate``` with POST payload: ```{"address": " BITCOIN WALLET ADDRESS", "signature": "BITCOIN MESSAGE SIGNATURE"}```
If successful, your address is no safed and you can create a star!

### Star registration
1. Post star information: POST ```http://localhost:8000/block``` with POST payload: ```{"address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "star": {"dec": "-26° 29'"'"' 24.9", "ra": "16h 29m 1.0s", "story": "Found star using https://www.google.com/sky/"}}```. Address, star declination (dec), star right_ascension (ra) and star_story (story) are required. Magnitude (mag) and constellation (con) are optional.
If successful, you now have your own star in the star registry!

### Retrieving star information
1. Retrieving stars by star block hash: GET ```http://localhost:8000/stars/hash:STAR_BLOCK_HASH``` 
2. Retrieving stars by star creator address: GET ```http://localhost:8000/stars/address:STAR_CREATOR_ADDRESS``` 
3. Retrieving stars by star block size: GET ```http://localhost:8000/block/STAR_BLOCK_HEIGH``` 


## Technologies used
* NodeJS: v.8.11.3
* Level DB: 4.0.0
* Crypto-js: 3.1.9
* Hapi: 17.5.3
