const { HttpStatusCode } = require("axios");
const { createUUID, validateUUID } = require("../../../utils/uuid");
const { Payload } = require("../../../middleware/authService");
const bcrypt = require('bcrypt');
const { setXTotalCountHeader } = require("../../../utils/response");
const Logger = require("../../../utils/logger");
const badRequest = require("../../../../errors/badRequest");
const NotFoundError = require("../../../../errors/notFoundError");
const { BaseError } = require("sequelize");
const LoanTypeService = require("../service/loanType");



class LoanTypeController{
    constructor(){
        this.loanTypeService = new LoanTypeService();
    }

    async createLoanType(req, res, next) {
        try {
            Logger.info("createLoanType controller started");
    
            // Destructure required fields from the request body
            const {loanName,requiredDocuments,interestRate,minAmount,maxAmount,minRepayTenure,maxRepayTenure,eligibilityCriteria , minAge , minSalary} = req.body;
    
            // Validate required fields
            if (!loanName || loanName.trim() === "") {
                throw new badRequest("Validation Error: loanName is required");
            }
    
            if (!interestRate || isNaN(interestRate)) {
                throw new badRequest("Validation Error: interestRate must be a valid number");
            }
    
            if (!minAmount || isNaN(minAmount)) {
                throw new badRequest("Validation Error: minAmount must be a valid number");
            }
    
            if (!maxAmount || isNaN(maxAmount) || Number(maxAmount) < Number(minAmount)) {
                throw new badRequest("Validation Error: maxAmount must be greater than or equal to minAmount");
            }
    
            if (!minRepayTenure || isNaN(minRepayTenure)) {
                throw new badRequest("Validation Error: minRepayTenure must be a valid number");
            }
    
            if (!maxRepayTenure || isNaN(maxRepayTenure) || Number(maxRepayTenure) < Number(minRepayTenure)) {
                throw new badRequest("Validation Error: maxRepayTenure must be greater than or equal to minRepayTenure");
            }
    
           
            let response = await this.loanTypeService.create(createUUID(),loanName,requiredDocuments,interestRate,minAmount,maxAmount,minRepayTenure,maxRepayTenure,eligibilityCriteria, minAge , minSalary);
    
          
            if (!response) {
                throw new Error("Error in creating loan type");
            }
    
            Logger.info("createLoanType controller ended");
            res.status(HttpStatusCode.Created).json(response);
        } catch (error) {
            next(error);
        }
    }


    async getAllLoanTypes(req , res , next){
        try {
            Logger.info("getAllLoanType Controller started");
            const { count, rows } = await this.loanTypeService.getAllLoanTypes(req.query)
            setXTotalCountHeader(res, count)
            res.status(HttpStatusCode.Ok).json(rows);
            Logger.info("getAllAllType Controller ended");
        } catch (error) {
            next(error);
        }
    }

    async updateLoanType(req, res, next) {
        try {
          Logger.info("update loantype controller started...");
          const { id } = req.query;
          
          if (!validateUUID(id)) {
            throw new Error("invalid user id...");
          }
          
    
          const response = await this.loanTypeService.updateLoanType(id,req.query);
          if (!response){
            throw new NotFoundError("loan type not found or loanType updation failed....");
          }
          res.status(HttpStatusCode.Ok).json({ message: `loanType with id ${id} is updated successfully` });
        } catch (error) {
          next(error);
        }
      }

    async deleteLoanType(req , res , next){
        try {
            Logger.info("deleteLoanType controller started");
            const response = await this.loanTypeService.deleteLoanType(req.query);
            if (!response){
                throw new NotFoundError("loan type not found or loan deletion failed....");
              }
            res.status(HttpStatusCode.Ok).json(response);
            Logger.info("deleteLoanType Controller ended");
        } catch (error) {
            next(error);
        }
    }

    

    
    
}

const loanTypeController = new LoanTypeController();
module.exports = loanTypeController;