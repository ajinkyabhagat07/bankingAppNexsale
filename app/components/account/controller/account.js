

const { HttpStatusCode } = require("axios");
const generateAccountNumber = require("../../../utils/generateAccountNumber");
const { createUUID } = require("../../../utils/uuid");

const bankService = require("../../bank/service/bank");
const accountService = require("../service/account");
const Logger = require("../../../utils/logger");



class AccountController{
    constructor(){
        this.accountService = new accountService();
        this.bankService = new bankService();
    }

    async createAccount(req , res , next){
        try {
            Logger.info("createAccount controller started");
            const {abbreviation} = req.body;
            console.log(abbreviation);
            let bankId = await this.bankService.findBankId(abbreviation);
            let customerId = req.query.id;
            let response = await this.accountService.createAccount(createUUID(), customerId ,generateAccountNumber(), bankId);
            Logger.info("createAccount controller ended");
            res.status(HttpStatusCode.Created).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getAccountByAccountNumber(req , res , next){
        try {
            Logger.info("getAccountByAccountNumber controller started");
            let response = await this.accountService.getAccountByAccountNumber(req.query);
            Logger.info("getAccountByAccountNumber controller ended");
            res.status(HttpStatusCode.Ok).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getBalance(req , res , next){
        try {
            Logger.info("getAccountBalance controller started");
            let response = await this.accountService.getBalance(req.query);
            Logger.info("getAccountBalance controller ended");
            res.status(HttpStatusCode.Ok).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getAccountBalance(req , res , next){
        try {
            Logger.info("getAccountBalance controller started");
            let response = await this.accountService.getAccountBalance(req.query);
            Logger.info("getAccountBalance controller ended");
            res.status(HttpStatusCode.Ok).json(response);
        } catch (error) {
            next(error);
        }
    }

    async deposit(req , res , next){
        try {
            Logger.info("deposite controller started");
            const customerId = req.id;
            const {accountNumber , amount} = req.body;
            let response = await this.accountService.deposit(customerId , accountNumber , amount);
            Logger.info("deposite controller ended");
            res.status(HttpStatusCode.Ok).json(response);
        } catch (error) {
            next(error);
        }
    }

    async withdraw(req , res , next){
        try {
            Logger.info("withdraw controller started");
            const customerId = req.id;
            const {accountNumber , amount} = req.body;
            let response = await this.accountService.withdraw(customerId , accountNumber , amount);
            Logger.info("withdraw controller ended");
            res.status(HttpStatusCode.Ok).json(response);
        } catch (error) {
            next(error);
        }
    }

    async transfer(req , res, next){
        try {
            Logger.info("transfer controller started");
            const senderCustomerId = req.id;
            const {senderAccountNumber, receiverAccountNumber, amount} = req.body;
            let response = await this.accountService.transfer(senderCustomerId, senderAccountNumber, receiverAccountNumber, amount);
            Logger.info("transfer controller ended");
            res.status(HttpStatusCode.Ok).json(response);
            
        } catch (error) {
            next(error);
        }
    }

}

const accountController = new AccountController();
module.exports = accountController;