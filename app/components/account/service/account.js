const accountConfig = require("../../../model-config/account-config");
const bankConfig = require("../../../model-config/bank-config");
const ledgerConfig = require("../../../model-config/ledger-config");
const passbookConfig = require("../../../model-config/passbook-config");
const Logger = require("../../../utils/logger");
const { parseFilterQueries, parseSelectFields, parseLimitAndOffset } = require("../../../utils/request");
const { transaction, commit, rollBack } = require("../../../utils/transaction");
const { validateUUID, createUUID } = require("../../../utils/uuid");

class accountService{

    #associationMap = {
        passbook: {
          model: passbookConfig.model,
          required: true,
        },
      };

    #createAssociations(includeQuery) {
        const associations = [];
    
        if (!Array.isArray(includeQuery)) {
          includeQuery = [includeQuery];
        }
        if (includeQuery?.includes(accountConfig.association.passbook)) {
          associations.push(this.#associationMap.passbook);
        }

        return associations;
      }

    async createAccount(id,customerId ,accountNumber , bankId , t){
        Logger.info("createAccount Service started");
        if(!t){
            t = await transaction();
        }

        try {
            let accountBalance = 1000;
            validateUUID(id);
            let response = await accountConfig.model.create({id,accountNumber,customerId, bankId,accountBalance},{
                t
            })
            commit(t);
            Logger.info("createAccount service ended");
            return response;
        } catch (error) {
            await rollBack(t);
        }
    }

    async getBalance(query , t){
        Logger.info("getAccountBalance Service started");
        if(!t){
            t = await transaction();
        }

        try {
            const arg = {
                transaction: t,
                ...parseFilterQueries(query, accountConfig.filters),
            }
            const accounts = await accountConfig.model.findAll(arg);

            const totalBalance = accounts.reduce((sum, account) => {
                return sum + account.accountBalance;
            }, 0);

            commit(t);
            Logger.info("getAccountBalance controller ended");
            return totalBalance;
            
        } catch (error) {
            await rollBack(t);
        }

    }

    async getAccountBalance(query , t){
        Logger.info("getAccountBalance Service started");
        if(!t){
            t = await transaction();
        }

        try {
            const arg = {
                transaction: t,
                ...parseFilterQueries(query, accountConfig.filters),
            }
            let account = await accountConfig.model.findOne(arg);

            // console.log(account);
            account = account.dataValues;


            commit(t);
            Logger.info("getAccountBalance controller ended");
    
            return account.accountBalance;
            
        } catch (error) {
            await rollBack(t);
        }
    }

    async getAccountByAccountNumber(query , t){
        Logger.info("getAccountNumber Service started");
        if(!t){
            t = await transaction();
        }

        try {
            Logger.info("get account by id service called...");
            //console.log(query.include);
            let selectArray = parseSelectFields(query, accountConfig.fieldMapping);
            if (!selectArray) {
              selectArray = Object.values(accountConfig.fieldMapping);
            }
      
            const includeQuery = query.include || [];
            let association = [];
            if (includeQuery) {
              association = this.#createAssociations(includeQuery);
            }

        
      
            const arg = {
                attributes: selectArray,
                ...parseLimitAndOffset(query),
                transaction: t,
                ...parseFilterQueries(query, accountConfig.filters),
                include: association
            }
            //console.log(arg);
      
            const response = await accountConfig.model.findOne(arg);
            await commit(t);
            Logger.info("get account by number service ended...");
            return response;
          } catch (error) {
            console.log(error);
            await rollBack(t);
          }
    }
    

    async deposit(customerId , accountNumber , amount , t){
        Logger.info("deposite service started")
        if(!t){
            t = await transaction();
        }
         try {
            const arg = {
                transaction: t,
                where: { customerId: customerId, accountNumber: accountNumber }
            }
            const account = await accountConfig.model.findOne(arg);

       
           if (!account) {
              throw new Error("Account not found or does not belong to the customer.");
           }

           if(account.customerId)

       
           account.accountBalance += amount;

        
           await account.save({ transaction: t });

       
           Logger.info("create passbook entry started...");
           let currentDate = new Date();
           let entry = `Amount of ${amount} has been deposited in account id : ${account.id} with bankID : ${account.bankId} at ${currentDate}`;
           const id = createUUID();
           await passbookConfig.model.create(
             {
               id,
               entry: entry,
               accountId: account.id,
             },
             { t }
           );
           await commit(t);
           Logger.info("create passbook entry ended...");
     
           Logger.info("deposit user account service ended...");
           return { newBalance: account.accountBalance };

        } catch (error) {
            console.log(error);
            await rollBack(t);   
            
        }   
    }

    async withdraw(customerId, accountNumber, amount, t) {
        Logger.info("withdraw service started");
        if (!t) {
            t = await transaction();
        }
        try {
            const arg = {
                transaction: t,
                where: { customerId: customerId, accountNumber: accountNumber }
            };
            const account = await accountConfig.model.findOne(arg);
    
            if (!account) {
                throw new Error("Account not found or does not belong to the customer.");
            }
    
            if (account.accountBalance < amount) {
                throw new Error("Insufficient funds for withdrawal.");
            }
    
            account.accountBalance -= amount;
            await account.save({ transaction: t });
            const balance = account.accountBalance;

            Logger.info("create passbook entry started...");
            let currentDate = new Date();
            let entry = `Amount of ${amount} has been withdrawn  from  account id : ${account.id} with bankID : ${account.bankId} at ${currentDate} and the remaining balance is ${balance}`;
            const id = createUUID();
            await passbookConfig.model.create(
                {
                    id,
                    entry: entry,
                    accountId: account.id,
                },
                { t }
            );
            await commit(t);
            Logger.info("create passbook entry ended...");

            Logger.info("withdraw  user account service ended...");
            return { newBalance: account.accountBalance };
    
        } catch (error) {
            await rollBack(t);
  
        }
    }

    async transfer(senderCustomerId, senderAccountNumber, receiverAccountNumber, amount, t) {
        Logger.info("transfer service started");
        if (!t) {
            t = await transaction();
        }
        try {
            const senderArg = {
                transaction: t,
                where: { customerId: senderCustomerId, accountNumber: senderAccountNumber }
            };
            const senderAccount = await accountConfig.model.findOne(senderArg);
    
            const receiverArg = {
                transaction: t,
                where: { accountNumber: receiverAccountNumber }
            };
            const receiverAccount = await accountConfig.model.findOne(receiverArg);
    
            if (!senderAccount) {
                throw new Error("Sender account not found or does not belong to the customer.");
            }
    
            if (!receiverAccount) {
                throw new Error("Receiver account not found or does not belong to the customer.");
            }
    
            if (senderAccount.accountBalance < amount) {
                throw new Error("Insufficient funds for transfer.");
            }
    
            senderAccount.accountBalance -= amount;
            receiverAccount.accountBalance += amount;
    
            await senderAccount.save({ transaction: t });
            await receiverAccount.save({ transaction: t });
            Logger.info("sender passbook entry started...");
            let senderBank = await bankConfig.model.findOne({
                where : {id : senderAccount.bankId}
            }, {t})
            let receiverBank = await bankConfig.model.findOne({
                where : {id : receiverAccount.bankId}
            }, {t})
            let currentDate = new Date();
            let senderEntry = `Amount of ${amount} has been debited  from  account number : ${senderAccount.accountNumber} with bank name : ${senderBank.abbreviation}  credited to receiver ${receiverAccount.accountNumber} with bank name : ${receiverBank.abbreviation} at ${currentDate} and the remaining balance is ${senderAccount.accountBalance}`;
            const senderPassbookId = createUUID();
            await passbookConfig.model.create(
            {
                id: senderPassbookId,
                entry: senderEntry,
                accountId: senderAccount.id,
             },
            { t }
            );

            Logger.info("sender passbook entry ended...");
            Logger.info("receiver passbook entry started...");
            let receiverEntry = `Amount of ${amount} has been debited  from  account number : ${senderAccount.accountNumber} with bank name : ${senderBank.abbreviation}  credited to receiver ${receiverAccount.accountNumber} with bank name : ${receiverBank.abbreviation} at ${currentDate} and the remaining balance is ${receiverAccount.accountBalance}`;
            const receiverPassbookId = createUUID();
            await passbookConfig.model.create(
            {
                id: receiverPassbookId,
                entry: receiverEntry,
                accountId: receiverAccount.id,
            },
            { t }
            );

            Logger.info("receiver passbook entry ended...");
            await this.ledgerEntry(
                senderBank.id,
                receiverBank.id,
                senderBank.abbreviation,
                receiverBank.abbreviation,
                amount
              );
            await commit(t);
            Logger.info("transfer servide ended");
            return { newSenderBalance: senderAccount.accountBalance };
    
        } catch (error) {
            console.log(error);
            await rollBack(t);
        }
    }


    async ledgerEntry(
        senderBankId,
        receiverBankId,
        senderBankName,
        receiverBankName,
        amount,
        t
      ) {
        if (!t) {
          t = await transaction();
        }
    
        try {
          Logger.info("ledger entry service started");
          let senderToReceiver = await ledgerConfig.model.findOne(
            {
              where: {
                senderBankId: senderBankId,
                receiverBankId: receiverBankId,
              },
            },
            { transaction: t }
          );
    
          if (!senderToReceiver) {
            await ledgerConfig.model.create({
                senderBankId: senderBankId,
                receiverBankId: receiverBankId,
                senderBankName: senderBankName,
                receiverBankName: receiverBankName,
                totalAmount: -amount,
              },
              { transaction: t }
            );
          } else {
            await senderToReceiver.reload({ transaction: t });
            senderToReceiver.totalAmount -= amount;
            senderToReceiver.lastUpdated = new Date();
    
            let receiverToSender = await ledgerConfig.model.findOne(
              {
                where: {
                  senderBankId: receiverBankId,
                  receiverBankId: senderBankId,
                },
              },
              { transaction: t,
              }
            );
           
            if (receiverToSender) {
              await receiverToSender.reload({ transaction: t });
              receiverToSender.totalAmount = new Decimal(receiverToSender.totalAmount).plus(amount).toFixed(2);
              
              receiverToSender.lastUpdated = new Date();
            } else {
              throw new Error("Receiver to sender entry not found");
            }
    
            await senderToReceiver.save({ transaction: t });
            await receiverToSender.save({ transaction: t });
          }
    
          await commit(t);
          Logger.info("ledger entry service ended");
        } catch (error) {
          await rollBack(t);
          throw error;
        }
      }
}


module.exports = accountService;