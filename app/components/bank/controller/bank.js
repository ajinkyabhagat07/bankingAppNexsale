const { HttpStatusCode } = require("axios");
const { createUUID } = require("../../../utils/uuid");
const bankService = require("../service/bank");
const { setXTotalCountHeader } = require("../../../utils/response");
const Logger = require("../../../utils/logger");
const badRequest = require("../../../../errors/badRequest");



class BankController{
    constructor(){
        this.bankService = new bankService();
    }

    async create(req , res , next){
        try {
            Logger.info("createBank controller started");
            const {bankName , abbreviation} = req.body;
            if (bankName == "" || !bankName) {
                throw new badRequest("Validation Error");
            }
            if (abbreviation == "" || !abbreviation) {
                throw new badRequest("Validation Error");
            }

            

            let response = await this.bankService.create(createUUID() ,bankName , abbreviation);

            Logger.info("createBank controller ended");
            res.status(HttpStatusCode.Created).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getAllBank(req , res , next){
        try {
            Logger.info("getAllBank Controller started");
            const { count, rows } = await this.bankService.getAllBank(req.query)
            setXTotalCountHeader(res, count)
            res.status(HttpStatusCode.Ok).json(rows);
            Logger.info("getAllBank Controller ended");
        } catch (error) {
            next(error);
        }
    }

    async updateBankById(req, res, next) {
        try {
          Logger.info("update bank by id controller started...");
          const { bankId } = req.params;
          const { parameter, value } = req.body;
    
          if (typeof parameter != "string")
            throw new badRequest("invalid parameter type....");
          if (!validateUUID(userId)) {
            throw new Error("invalid user id...");
          }
    
          const response = await this.bankService.updateBankById(bankId,parameter,value);
          if (!response){
            throw new NotFoundError("bank not found or bank updation failed...");
          }
          res.status(HttpStatusCode.Ok).json({ message: `Bank with id ${bankId} is updated successfully` });
        } catch (error) {
          next(error);
        }
      }


    async deleteBank(req , res , next){
        try {
            Logger.info("delete Bank controller started");
            const abbreviation = req.body;
            let response = await this.bankService.deleteBank(req.query);
            Logger.info("delete Bank controller ended");
            res.status(HttpStatusCode.Ok).json(response);
        } catch (error) {
            console.log(error);
        }
    }

   
}

const bankController = new BankController();
module.exports = bankController;