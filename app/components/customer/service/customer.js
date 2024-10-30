const badRequest = require("../../../../errors/badRequest");
const accountConfig = require("../../../model-config/account-config");
const customerConfig = require("../../../model-config/customer-config");
const Logger = require("../../../utils/logger");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request");
const { transaction, rollBack, commit } = require("../../../utils/transaction")
const bcrypt = require('bcrypt');


class CustomerService{

    #associationMap = {
        account: {
            model: accountConfig.model,
            required: true
        },
    }

    async create(id ,userName , password, firstName , lastName , age , gender , isAdmin , t){
        Logger.info("create customer Service started");

        if(!t){
            t = await transaction();
        }

        try {
            let hashedPassword = await bcrypt.hash(password , 10);
            let response = await customerConfig.model.create({id ,userName , password : hashedPassword, firstName , lastName , age , gender , isAdmin},{
                t
            })
            commit(t);
            Logger.info("create customer service ended");
            return response;
        } catch (error) {
            await rollBack(t);
        }
    }

    async findUser(userName){
        try {
            if(typeof userName != "string"){
                throw new badRequest("username is invalid")
            }

            let user = await customerConfig.model.findOne({ where: { userName: userName } });

            if(!user){
                throw new Error("user not found")
            }

            return user;
            
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(query , t){
        Logger.info("getAll service started");
        if(!t){
            t = await transaction();
        }
        try {
            let selectArray = parseSelectFields(query, customerConfig.fieldMapping)
            if (!selectArray) {
                selectArray = Object.values(customerConfig.fieldMapping)
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
                ...parseFilterQueries(query, customerConfig.filters),
                include: association
            }
            const { count, rows } = await customerConfig.model.findAndCountAll(arg)
            commit(t)
            Logger.info("getAll service ended")
            return { count, rows }
        } catch (error) {
            next(error);
        }
    }

    #createAssociations(includeQuery) {
        const associations = []

        if (!Array.isArray(includeQuery)) {
            includeQuery = [includeQuery]
        }
        if (includeQuery?.includes(customerConfig.association.account)) {
            associations.push(this.#associationMap.account)
        }
        return associations
    }

    async getById(query , t){
        Logger.info("getById service started");
        if(!t){
            t = await transaction();
        }
        try {
            let selectArray = parseSelectFields(query, customerConfig.fieldMapping)
            if (!selectArray) {
                selectArray = Object.values(customerConfig.fieldMapping)
            }

            const includeQuery = query.include || []
            let association = []
            if (includeQuery) {
                association = this.#createAssociations(includeQuery)
            }

            const arg = {
                attributes: selectArray,
                transaction: t,
                ...parseFilterQueries(query, customerConfig.filters),
                include: association
            }
            const response = await customerConfig.model.findOne(arg)
            commit(t)
            Logger.info("getAll service ended")
            return response;
            
        } catch (error) {
            next(error);
        }
    }

    async updateCustomerById(userId, parameter, value, t) {
        if (!t) {
          t = await transaction();
        }
        try {
          Logger.info("update user by id service started");
    
          const user = await userConfig.model.findOne(userId, { transaction: t });
    
          if (!user) {
            throw new NotFoundError(`User with id ${userId} does not exist.`);
          }
    
          user[parameter] = value;
    
          await user.save({ transaction: t });
    
          commit(t);
          Logger.info("update user by id service ended");
          return user;
        } catch (error) {
          await rollBack(t);
          Logger.error(error);
          throw error;
        }

    }

    async deleteUserByID(query , t){
        Logger.info("delete customer service started");
        if(!t){
            t = await transaction();
        }
        try{
            const arg = {
                transaction: t,
                ...parseFilterQueries(query, customerConfig.filters),
            }
            const result = await customerConfig.model.destroy(arg);

            if(result===0){
                throw new Error("could not found the user");
            }

            commit(t)
            Logger.info("delete service ended")

            return true;
        }
        catch(error){
            await rollBack(t);
        }
    }

}


module.exports = CustomerService;