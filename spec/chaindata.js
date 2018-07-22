const blockchain = [
  {
    hash: 'c7136673ac571004127202df1669035de29418d4a197e79a8ff8816f38ca8524',
    height: 0,
    body: 'First block in the chain - Genesis block',
    time: '1532265501',
    previousBlockHash: ''
  },
  {
    hash: '1fbd268b303a81b26e2db35e999067dfd6407ee935c7dfbf2e7bf862a428692c',
    height: 1,
    body: 'Test Data',
    time: '1532265510',
    previousBlockHash: 'c7136673ac571004127202df1669035de29418d4a197e79a8ff8816f38ca8524'
  },
  {
    hash: '8b987218df49adf38fe0985057f3ab9738c3295ada296f9e4c5a8e5f35f3e258',
    height: 2,
    body: 'Test Data',
    time: '1532265517',
    previousBlockHash: '1fbd268b303a81b26e2db35e999067dfd6407ee935c7dfbf2e7bf862a428692c'
  }
];

module.exports = blockchain;
