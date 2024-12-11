const badRequest = require("../../../../errors/badRequest");
const Logger = require("../../../utils/logger");
const { transaction, rollBack, commit } = require("../../../utils/transaction")
const sendEmail = require("../../../utils/email");
const db = require("../../../../models");
const emiConfig = require("../../../model-config/emi-config");



class EmiService {   

    async payEmi(emiId, t) {
       
        if (!t) {
            t = await transaction();
        }
    
        try {
            Logger.info("Pay EMI service started");
    
           
            const reqEmi = await emiConfig.model.findOne({
                where: { id: emiId },
                transaction: t,
            });
    
            
            if (!reqEmi) {
                throw new Error(`EMI with ID ${emiId} not found.`);
            }
    
            
            reqEmi.status = "Paid"; 
            reqEmi.paymentDate = new Date(); 
    
            
            await reqEmi.save({ transaction: t });
    
          
            await commit(t);
    
            Logger.info("Pay EMI service ended successfully");
            return reqEmi;
        } catch (error) {
            await rollBack(t);
            Logger.error("Error in Pay EMI service:", error);
            throw error;
        }
    }


    

}

module.exports = EmiService;