const { HttpStatusCode } = require("axios");
const { createUUID, validateUUID } = require("../../../utils/uuid");
const { Payload } = require("../../../middleware/authService");
const bcrypt = require('bcrypt');
const { setXTotalCountHeader } = require("../../../utils/response");
const Logger = require("../../../utils/logger");
const badRequest = require("../../../../errors/badRequest");
const NotFoundError = require("../../../../errors/notFoundError");
const { BaseError } = require("sequelize");
const LoanService = require("../service/loan");
const generateLoanAccountNumber = require("../../../utils/generateLoanAccountNumber");



class LoanController{
    constructor(){
        this.loanService = new LoanService();
    }

    async createLoan(req, res, next) {
        try {
            Logger.info("createLoan controller started");
    
            
            const {loanTypeId,customerId,aadhar , pan , additionalDocument , loanAmount,address,durationMonths,emiAmount,loanStatus,reasonForRejection,appliedDate,approvedDate} = req.body;
    
            // Validate required fields
            if (!loanTypeId || loanTypeId.trim() === "") {
                throw new badRequest("Validation Error: loanTypeId is required");
            }
    
            if (!customerId || customerId.trim() === "") {
                throw new badRequest("Validation Error: customerId is required");
            }
    
            if (!loanAmount || isNaN(loanAmount)) {
                throw new badRequest("Validation Error: loanAmount must be a valid number");
            }
    
            if (!durationMonths || isNaN(durationMonths)) {
                throw new badRequest("Validation Error: durationMonths must be a valid number");
            }
    
            if (!loanStatus || loanStatus.trim() === "") {
                throw new badRequest("Validation Error: loanStatus is required");
            }

           
    
            
            let response = await this.loanService.create(createUUID(), loanTypeId,customerId,aadhar , pan , additionalDocument , loanAmount,address,durationMonths,emiAmount,loanStatus,reasonForRejection,appliedDate,approvedDate);
    
       
            if (!response) {
                throw new Error("Error in creating loan");
            }
    
            Logger.info("createLoan controller ended");
            res.status(HttpStatusCode.Created).json(response);
        } catch (error) {
            next(error);
        }
    }
    


    async getAllLoans(req , res , next){
        try {
            Logger.info("getAllLoans Controller started");
            const { count, rows } = await this.loanService.getAllLoans(req.query)
            setXTotalCountHeader(res, count)
            res.status(HttpStatusCode.Ok).json(rows);
            Logger.info("getAllLoan Controller ended");
        } catch (error) {
            next(error);
        }
    }

    async updateLoan(req, res, next) {
        try {
          Logger.info("update loan controller started...");
          const { id } = req.query;
          
          if (!validateUUID(id)) {
            throw new Error("invalid loan id...");
          }
          
    
          const response = await this.loanService.updateLoan(id,req.query);
         
          if (!response) {
            throw new NotFoundError(`Loan with id ${id} not found or update failed.`);
          }
          res.status(HttpStatusCode.Ok).json({ message: `loan with id ${id} is updated successfully` });
        } catch (error) {
          next(error);
        }
      }

    async deleteLoan(req , res , next){
        try {
            Logger.info("deleteLoan controller started");
            const response = await this.loanService.deleteLoan(req.query);
            if (!response){
                throw new NotFoundError("loan  not found or loan deletion failed....");
              }
            res.status(HttpStatusCode.Ok).json(response);
            Logger.info("deleteLoan Controller ended");
        } catch (error) {
            next(error);
        }
    }

    async approveloan(req , res , next){
        try {
            const {id} = req.query;

            if (!validateUUID(id)) {
                throw new Error("invalid loan id...");
            }

            const response = await this.loanService.approveloan(id,req.query);

            if (!response) {
                throw new NotFoundError(`Loan with id ${id} not found or approve failed.`);
              }
            res.status(HttpStatusCode.Ok).json({ message: `loan with id ${id} is approved successfully` });
        } catch (error) {
            next(error)
        }
    }

    async rejectloan(req, res, next) {
        try {
            const { id } = req.query;
    
            
            if (!validateUUID(id)) {
                throw new Error("Invalid loan ID.");
            }
    
            if (!req.query.reasonForRejection || req.query.reasonForRejection.trim() === "") {
                throw new Error("Reason for rejection is required.");
            }
    
            // Call the service to reject the loan
            const response = await this.loanService.rejectloan(id, req.query);
    
           
            if (!response) {
                throw new NotFoundError(`Loan with ID ${id} not found or rejection failed.`);
            }
    
           
            res.status(HttpStatusCode.Ok).json({ message: `Loan with ID ${id} was rejected successfully.`});
        } catch (error) {
            next(error); 
        }
    }

    

    
    
}

const loanController = new LoanController();
module.exports = loanController;