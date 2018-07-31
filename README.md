# Blockchain Developer Nanodegree - Project Stage NodeJS API Framework
---
## API usage
1. Clone/download repository and navigate to folder in console/terminal window
2. change into the folder
3. run ```npm i```
4. run ```./server/index.js```
5. Try API endpoints:
  * GET:  ```http://localhost:8000/block/0```
  * POST: Use Curl command in terminal: ```curl -X "POST" "http://localhost:8000/block" -H 'Content-Type: application/json' -d $'{"body":"Test Block Data"}'```
6. Enjoy the blockchain interaction!

## Server-Side Chain Interaction
1. Alternatively, after running ```npm i```
2. You can start a node REPL with ```node```
3. Copy the content of app.js into the REPL
4. Start interacting with the chain:
  * Initialize
  * Add blocks
  * Get the block height
  * Get a block by height
  * Get the whole chain data
  * Validate a block
  * Validate the whole chain

## Technologies used
* NodeJS: v.8.9.4
* Level DB: 4.0.0
* Crypto-js: 3.1.9
* Hapi: 17.5.2
