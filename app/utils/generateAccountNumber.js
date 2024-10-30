var rn = require('random-number');

var gen = rn.generator({
  min:  1000
, max:  2000
, integer: true
})


const generateAccountNumber = () =>{
    return gen();
}

module.exports = generateAccountNumber;