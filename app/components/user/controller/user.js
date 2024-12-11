const { HttpStatusCode } = require("axios");
const { createUUID, validateUUID } = require("../../../utils/uuid");
const UserService = require("../service/user");
const { Payload } = require("../../../middleware/authService");
const bcrypt = require('bcrypt');
const { setXTotalCountHeader } = require("../../../utils/response");
const Logger = require("../../../utils/logger");
const badRequest = require("../../../../errors/badRequest");
const NotFoundError = require("../../../../errors/notFoundError");
const { BaseError } = require("sequelize");


class CustomerController{
    constructor(){
        this.userService = new UserService();
    }

    async createUser(req , res , next){
        try {
            Logger.info("createuser controller started");
            const {userName , password ,firstName , lastName , email , phoneNumber , gender , dateOfBirth , isAdmin , profileImageUrl} = req.body;
            
            if (firstName == "" || !firstName) {
                throw new badRequest("Validation Error");
            }
            if (lastName == "" || !lastName) {
                throw new badRequest("Validation Error");
            }

           

            let response = await this.userService.create(createUUID() ,userName , password ,firstName , lastName , email , phoneNumber , gender , dateOfBirth , isAdmin , profileImageUrl);

            if(!response){
              throw new Error("Error in creating user")
            }

            Logger.info("createuser controller ended");
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
          
           
          const user = await this.userService.findUser(userName);

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



    async getAll(req , res , next){
        try {
            Logger.info("getAll Controller started");
            const { count, rows } = await this.userService.getAll(req.query)
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
            //console.log(req.query);
            const response = await this.userService.getById(req.query);
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
          const { id } = req.query;
          
          if (!validateUUID(id)) {
            throw new Error("invalid user id...");
          }
          
    
          const response = await this.userService.updateCustomer(id,req.query);
          if (!response){
            throw new NotFoundError("user not found or user updation failed....");
          }
          res.status(HttpStatusCode.Ok).json({ message: `User with id ${id} is updated successfully` });
        } catch (error) {
          next(error);
        }
      }

    async deleteById(req , res , next){
        try {
            Logger.info("deleteById controller started");
            const response = await this.userService.deleteUserByID(req.query);
            if (!response){
                throw new NotFoundError("user not found or user deletion failed....");
              }
            res.status(HttpStatusCode.Ok).json(response);
            Logger.info("deleteById Controller ended");
        } catch (error) {
            next(error);
        }
    }


    async verifyToken(req, res, next) {
      try {
        Logger.info("verifyToken controller started");
        const {token} = req.body;
        if(!token){
          throw new NotFoundError("token not found")
        }
        
        let data = Payload.verifyToken(token) 
        
        if(!data){
          throw new Error("token verification failed");
        } 

        res.status(HttpStatusCode.Ok).json(data);
        Logger.info("verifyToken controller ended...");
      } catch (error) {
        next(error);
      }
  }


    
    
}

const customerController = new CustomerController();
module.exports = customerController;