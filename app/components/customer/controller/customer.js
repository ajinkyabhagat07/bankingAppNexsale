const { HttpStatusCode } = require("axios");
const { createUUID } = require("../../../utils/uuid");
const CustomerService = require("../service/customer");
const { Payload } = require("../../../middleware/authService");
const bcrypt = require('bcrypt');
const { setXTotalCountHeader } = require("../../../utils/response");
const Logger = require("../../../utils/logger");
const badRequest = require("../../../../errors/badRequest");
const NotFoundError = require("../../../../errors/notFoundError");

class CustomerController{
    constructor(){
        this.customerService = new CustomerService();
    }

    async createAdmin(req , res , next){
        try {
            Logger.info("createAdmin controller started");
            const {userName , password ,firstName , lastName , age , gender} = req.body;
            if (firstName == "" || !firstName) {
                throw new badRequest("Validation Error");
            }
            if (lastName == "" || !lastName) {
                throw new badRequest("Validation Error");
            }

            let response = await this.customerService.create(createUUID() ,userName , password, firstName , lastName , age , gender , true);

            Logger.info("createAdmin controller ended");
            res.status(HttpStatusCode.Created).json(response);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
          Logger.info("Login controller started");
          const { userName, password} = req.body;
          if (typeof userName != "string"){
            throw new badRequest("invalid username type");
          }
           
          if (typeof password != "string"){
            throw new badRequest("invalid password type");
          }
            
          const user = await this.customerService.findUser(userName);

          if (!user){
            throw new NotFoundError("user does not exists...");
          }

           
    
          if (await bcrypt.compare(password, user.password)) {
            let payload = Payload.newPayload(user.id, user.isAdmin);
    
            let token = payload.signPayload();
            res.cookie("auth", `Bearer ${token}`);
    
            res.set("auth", `Bearer ${token}`)
            res.status(200).send(token);
          } else {
            res.status(403).json({
              message: "password incorrect",
            });
          }
          Logger.info("Login controller ended...");
        } catch (error) {
          next(error);
        }
    }

    async createUser(req , res , next){
        try {
            Logger.info("createUser controller started");
            const {userName , password , firstName , lastName , age , gender} = req.body;
            if (firstName == "" || !firstName) {
                throw new badRequest("Validation Error");
            }
            if (lastName == "" || !lastName) {
                throw new badRequestr("Validation Error");
            }

            let response = await this.customerService.create(createUUID() ,userName , password, firstName , lastName , age , gender , false);
            Logger.info("createUser controller ended");
            res.status(HttpStatusCode.Created).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req , res , next){
        try {
            Logger.info("getAll Controller started");
            const { count, rows } = await this.customerService.getAll(req.query)
            setXTotalCountHeader(res, count)
            res.status(HttpStatusCode.Ok).json(rows);
            Logger.info("getAll Controller ended");
        } catch (error) {
            next(error);
        }
    }

    async getById(req , res , next){
        try {
            Logger.info("getById controller started");
            const response = await this.customerService.getById(req.query);
            if (!response){
                throw new NotFoundError("user not found....");
              }
            res.status(HttpStatusCode.Ok).json(response);
            Logger.info("getById Controller ended");
        } catch (error) {
            next(error)
        }
    }

    async updateCustomerById(req, res, next) {
        try {
          Logger.info("update user by id controller started...");
          const { userId } = req.params;
          const { parameter, value } = req.body;
          if (typeof parameter != "string")
            throw new badRequest("invalid parameter type....");
          if (!validateUUID(userId)) {
            throw new Error("invalid user id...");
          }
    
          const response = await this.userService.updateCustomerById(userId,parameter,value);
          if (!response){
            throw new NotFoundError("user not found or user updation failed....");
          }
          res.status(HttpStatusCode.Ok).json({ message: `User with id ${userId} is updated successfully` });
        } catch (error) {
          next(error);
        }
      }

    async deleteById(req , res , next){
        try {
            Logger.info("deleteById controller started");
            const response = await this.customerService.deleteUserByID(req.query);
            if (!response){
                throw new NotFoundError("user not found or user deletion failed....");
              }
            res.status(HttpStatusCode.Ok).json(response);
            Logger.info("deleteById Controller ended");
        } catch (error) {
            next(error);
        }
    }

    
    
}

const customerController = new CustomerController();
module.exports = customerController;