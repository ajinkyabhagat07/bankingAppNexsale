const db = require("../../models");
const crypto = require('crypto');

async function generateLoanAccountNumber(prefix = 'LN', length = 12) {
    const accountNumberLength = length - prefix.length;
  
    if (accountNumberLength <= 0) {
      throw new Error('Account number length must be greater than the prefix length.');
    }
  
    let isUnique = false;
    let accountNumber;
  
    while (!isUnique) {
     
      const randomNumber = crypto.randomInt(
        Math.pow(10, accountNumberLength - 1),
        Math.pow(10, accountNumberLength) 
      ).toString();
  
      accountNumber = `${prefix}${randomNumber}`;
  
     
      const existingAccount = await db.emi.findOne({
        where: { accountNumber },
        attributes: ['accountNumber'],
      });
  
      isUnique = !existingAccount; 
    }
  
    return accountNumber;
  }
  
  module.exports = generateLoanAccountNumber;