const badRequest = require("../../../../errors/badRequest");
const Logger = require("../../../utils/logger");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request");
const { transaction, rollBack, commit } = require("../../../utils/transaction")
const sendEmail = require("../../../utils/email");
const loanConfig = require("../../../model-config/loan-config");
const db = require("../../../../models");
const generateLoanAccountNumber = require("../../../utils/generateLoanAccountNumber");
const emiConfig = require("../../../model-config/emi-config");
const { createUUID } = require("../../../utils/uuid");


class LoanService {
    

    #associationMap = {
        emis: {
          model: emiConfig.model,
          as: 'emis', 
          //required: true
        },
      };

    async create(id,  loanTypeId, customerId, aadhar, pan, additionalDocument, loanAmount, address, durationMonths, emiAmount, loanStatus, reasonForRejection, appliedDate, approvedDate, t) {
        Logger.info("create loan Service started");
    
        if (!t) {
            t = await transaction(); // Start a new transaction if not provided
        }
    
        try {
           
            // Creating the loan entry
            // console.log(db.loan.rawAttributes);
            
            const response = await loanConfig.model.create({id,loanTypeId,customerId,aadhar,pan,additionalDocument,loanAmount,address,durationMonths,emiAmount,loanStatus,reasonForRejection,appliedDate,approvedDate,
            },
                {
                    transaction: t,
                }
            );


    
            await commit(t); // Commit transaction
            Logger.info("create loan service ended");
            
    
            return response;
        } catch (error) {
            console.log(error);
            await rollBack(t); // Rollback transaction on error
        }
    }

    async getAllLoans(query, t) {
        Logger.info("getAllLoans service started");
        if (!t) {
            t = await transaction();
        }

        try {
            let selectArray = parseSelectFields(query, loanConfig.fieldMapping);
            if (!selectArray) {
                selectArray = Object.values(loanConfig.fieldMapping);
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
                ...parseFilterQueries(query, loanConfig.filters),
                include: association
            };
            console.log(arg);
            const { count, rows } = await loanConfig.model.findAndCountAll(arg);
            await commit(t);
            Logger.info("getAllLoan service ended");
            return { count, rows };
        } catch (error) {
            Logger.error(error);
            await rollBack(t);
            throw error;
        }
    }

    

    #createAssociations(includeQuery) {
        const associations = [];
    
        if (!Array.isArray(includeQuery)) {
          includeQuery = [includeQuery];
        }
    
        // Only include associations explicitly requested in the query
        if (includeQuery.includes("emis")) {
          associations.push(this.#associationMap.emis);
        }
    
        return associations;
      }

    async updateLoan(loanId, query, t) {
        if (!t) {
            t = await transaction();
        }
        try {
            Logger.info("update loan by id service started");

            if (!validateUUID(loanId)) {
                throw new badRequest(`Invalid loanId: ${loanId}`);
            }

            let selectArray = parseSelectFields(query, loanConfig.fieldMapping);
            if (!selectArray) {
                selectArray = Object.values(loanConfig.fieldMapping);
            }

            const loan = await loanConfig.model.findByPk(loanId, {
                transaction: t,
                attributes: selectArray
            });

            if (!loan) {
                throw new Error(`Loan with id ${loanId} does not exist`);
            }

            await loan.update(query, { transaction: t });
            await commit(t);
            Logger.info("update loan by id service ended");
            return loan;
        } catch (error) {
            await rollBack(t);
            Logger.error(error);
            throw error;
        }
    }

    async deleteLoan(query, t) {
        Logger.info("deleteLoan service started");
        if (!t) {
            t = await transaction();
        }
        try {
            const arg = {
                transaction: t,
                ...parseFilterQueries(query, loanConfig.filters),
            };
            const result = await loanConfig.model.destroy(arg);

            if (result === 0) {
                throw new Error("Could not find the loan to delete");
            }

            await commit(t);
            Logger.info("deleteLoan service ended");
            return true;
        } catch (error) {
            await rollBack(t);
            Logger.error(error);
            throw error;
        }
    }

    async approveloan(loanId, query, t) {
        if (!t) {
            t = await transaction();
        }
        try {
            Logger.info("approve loan service started");
    
           
            const reqLoan = await loanConfig.model.findOne({
                where: { id: loanId },
                transaction: t,
            });
    
            if (!reqLoan) {
                throw new Error(`Loan with ID ${loanId} not found.`);
            }
    
           
            reqLoan.loanStatus = query.loanStatus;
            if (query.loanStatus === "approved") {
                reqLoan.approvedDate = query.approvedDate;
            }
    
            
            await reqLoan.save({ transaction: t });
    
            // Calculate and create EMIs
            if (query.loanStatus === "approved") {
                const { durationMonths, emiAmount } = reqLoan;
                const accountNumber = await generateLoanAccountNumber();
                
                const startDate = new Date(query.approvedDate);
                const emis = [];
    
                for (let i = 0; i < durationMonths; i++) {
                    const dueDate = new Date(startDate);
                    dueDate.setMonth(dueDate.getMonth() + i);
    
                    emis.push({
                        id: createUUID(),
                        accountNumber: accountNumber,
                        loanId: loanId,
                        amount: emiAmount,
                        paymentDate: null,
                        dueDate: dueDate,
                        status: 'Pending',
                        totalEmis: durationMonths,
                        remainingEmis: durationMonths - i,
                    });
                }
    
                await emiConfig.model.bulkCreate(emis, { transaction: t });
                Logger.info(`EMIs created for loan ID ${loanId}`);
            }
    
            await commit(t);
            Logger.info("approve loan service ended");
            return reqLoan;
        } catch (error) {
            await rollBack(t);
            Logger.error(error);
            throw error;
        }
    }




    async rejectloan(loanId, query, t) {
        if (!t) {
            t = await transaction();
        }
        try {
            Logger.info("reject loan service started");
    
            const reqLoan = await loanConfig.model.findOne({
                where: { id: loanId },
                transaction: t,
            });
    
            if (!reqLoan) {
                throw new Error(`Loan with ID ${loanId} not found`);
            }
    
            
            reqLoan.loanStatus = query.loanStatus;
            reqLoan.reasonForRejection = query.reasonForRejection;
    
         
            await reqLoan.save({ transaction: t });
    
            await commit(t);
            Logger.info("reject loan service ended");
    
            return reqLoan;
        } catch (error) {
            
            await rollBack(t);
            Logger.error(error);
            throw error;
        }
    }

}

module.exports = LoanService;