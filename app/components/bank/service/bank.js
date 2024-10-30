const accountConfig = require("../../../model-config/account-config");
const bankConfig = require("../../../model-config/bank-config");
const Logger = require("../../../utils/logger");
const { parseFilterQueries, parseSelectFields, parseLimitAndOffset } = require("../../../utils/request");
const { transaction, commit, rollBack } = require("../../../utils/transaction");

class bankService{

    #associationMap = {
        account: {
            model: accountConfig.model,
            required: true
        },
    }


    async create(id , bankName , abbreviation , t){
        Logger.info("create bank Service started");

        if(!t){
            t = await transaction();
        }

        try {
            let response = await bankConfig.model.create({id , bankName , abbreviation},{
                t
            })
            commit(t);
            Logger.info("create bank service ended");
            return response;
        } catch (error) {
            await rollBack(t);
        }
    }

    async findBankId(abbreviation , t){
        Logger.info("findBankId service started");
        if(!t){
            t = await transaction();
        }

        try {
            let response = await bankConfig.model.findOne({
                where: {
                    abbreviation : abbreviation
                }},{
                t
            })
            commit(t);
            Logger.info("findBankId service ended");
            return response.id;
        } catch (error) {
            await rollBack(t);
        }
    }

    async getAllBank(query , t){
        Logger.info("getAllBank service started");
        if(!t){
            t = await transaction();
        }
        try {
            let selectArray = parseSelectFields(query, bankConfig.fieldMapping)
            if (!selectArray) {
                selectArray = Object.values(bankConfig.fieldMapping)
            }

            const includeQuery = query.include || []
            let association = []
            if (includeQuery) {
                association = this.#createAssociations(includeQuery)
            }


            const arg = {
                attributes: selectArray,
                ...parseLimitAndOffset(query),
                transaction: t,
                ...parseFilterQueries(query, bankConfig.filters),
                include: association
            }
            const { count, rows } = await bankConfig.model.findAndCountAll(arg)
            commit(t)
            Logger.info("getAllBank service ended")
            return { count, rows }
        } catch (error) {
            console.log(error);
        }
    }

    #createAssociations(includeQuery) {
        const associations = []

        if (!Array.isArray(includeQuery)) {
            includeQuery = [includeQuery]
        }
        if (includeQuery?.includes(bankConfig.association.account)) {
            associations.push(this.#associationMap.account)
        }
        return associations
    }


      async updateBankById(bankId, parameter, value, t) {
        if (!t) {
          t = await transaction();
        }
    
        try {
          Logger.info("update bank by id service called...");
          const bank = await bankConfig.model.findByPk(bankId, { transaction: t });
          if (!bank){
            throw new NotFoundError(`Bank with id ${bankId} does not exists...`);
          }
    
          bank[parameter] = value;
          await bank.save({ transaction: t });
    
          commit(t);
          Logger.info("update bank by id service ended...");
          return bank;
        } catch (error) {
          Logger.error(error);
        }
      }  

    async deleteBank(query){
        Logger.info("deleteBank service started");
        if(!t){
            t = await transaction();
        }

        try {
            const arg = {
                transaction: t,
                ...parseFilterQueries(query, bankConfig.filters),
            }
            const result = await bankConfig.model.destroy(arg);

            if(result===0){
                throw new Error("could not found the bank");
            }

            commit(t)
            Logger.info("deleteBank service ended")

            return true;
        } catch (error) {
            await rollBack(t);
        }
    }

    

}


module.exports = bankService;