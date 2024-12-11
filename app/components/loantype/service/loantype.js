const badRequest = require("../../../../errors/badRequest");

const Logger = require("../../../utils/logger");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request");
const { transaction, rollBack, commit } = require("../../../utils/transaction")

const sendEmail = require("../../../utils/email");
const loanTypeConfig = require("../../../model-config/loantype-config");


class LoanTypeService{

    #associationMap = {
        loans: {
            model: loanTypeConfig.model,
            required: true
        },
    }

    async create(id, loanName,requiredDocuments,interestRate,minAmount,maxAmount,minRepayTenure,maxRepayTenure,eligibilityCriteria , minAge , minSalary, t) {
        Logger.info("create loan type Service started");
    
        if (!t) {
            t = await transaction();
        }
    
        try {
    
          
            let response = await loanTypeConfig.model.create({id, loanName,requiredDocuments,interestRate,minAmount,maxAmount,minRepayTenure,maxRepayTenure,eligibilityCriteria , minAge , minSalary},
                {
                    transaction: t
                }
            );
    
            await commit(t);
            Logger.info("create loan type service ended");
    
            return response;
        } catch (error) {
            console.log(error);
            await rollBack(t);
            throw error;
        }
    }
    

    

    async getAllLoanTypes(query , t){
        Logger.info("getAllLoanType service started");
        if(!t){
            t = await transaction();
        }
        try {
            let selectArray = parseSelectFields(query, loanTypeConfig.fieldMapping)
            if (!selectArray) {
                selectArray = Object.values(loanTypeConfig.fieldMapping)
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
                ...parseFilterQueries(query, loanTypeConfig.filters),
                include: association
            }
            const { count, rows } = await loanTypeConfig.model.findAndCountAll(arg)
            commit(t)
            Logger.info("getAllLoanType service ended")
            return { count, rows }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    #createAssociations(includeQuery) {
        const associations = []

        if (!Array.isArray(includeQuery)) {
            includeQuery = [includeQuery]
        }
        if (includeQuery?.includes(loanTypeConfig.association.loan)) {
            associations.push(this.#associationMap.loans)
        }
        return associations
    }


    async updateLoanType(loanTypeId, query, t) {
        if (!t) {
          t = await transaction();
        }
        try {
            
          Logger.info("update loan type by id service started");
          
          let selectArray = parseSelectFields(query, loanTypeConfig.fieldMapping);

          if (!selectArray) {
            selectArray = Object.values(loanTypeConfig.fieldMapping);
          }

          

          const loanType = await loanTypeConfig.model.findByPk(loanTypeId , {
            transaction : t,
            attributes : selectArray
          })

          

          if (!loanType) {
            throw new Error(`loantype with id ${loanTypeId} does not exist`);
          }

          //console.log(query);
      
         
          await loanType.update(query, { transaction: t });
          
    
          commit(t);
          Logger.info("update loan type by id service ended");
          return loanType;
        } catch (error) {
            console.log(error);
          await rollBack(t);
        }

    }

    async deleteLoanType(query , t){
        Logger.info("deleteLoanType  service started");
        if(!t){
            t = await transaction();
        }
        try{
            const arg = {
                transaction: t,
                ...parseFilterQueries(query, loanTypeConfig.filters),
            }
            const result = await loanTypeConfig.model.destroy(arg);

            if(result===0){
                throw new Error("could not found the deleteLoanType");
            }

            commit(t)
            Logger.info("deleteLoanType service ended")

            return true;
        }
        catch(error){
            await rollBack(t);
        }
    }


   
   
   

}


module.exports = LoanTypeService;