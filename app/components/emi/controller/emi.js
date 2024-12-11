const { HttpStatusCode } = require("axios");
const { createUUID, validateUUID } = require("../../../utils/uuid");
const NotFoundError = require("../../../../errors/notFoundError");
const EmiService = require("../service/emi");




class EmiController{
    constructor(){
        this.emiService = new EmiService();
    }



    async payEMI(req , res , next){
        try {
            const {id} = req.query;

            if (!validateUUID(id)) {
                throw new Error("invalid loan id...");
            }

            const response = await this.emiService.payEmi(id);

            if (!response) {
                throw new NotFoundError(`EMI with ID ${id} not found or payment failed.`);
            }
            res.status(HttpStatusCode.Ok).json({ message: `EMI with ID ${id} has been paid successfully.` });
        } catch (error) {
            next(error)
        }
    }
    

    
    
}

const emiController = new EmiController();
module.exports = emiController;