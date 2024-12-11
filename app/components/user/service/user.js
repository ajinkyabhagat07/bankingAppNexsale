const badRequest = require("../../../../errors/badRequest");
const userConfig = require("../../../model-config/user-config");
const Logger = require("../../../utils/logger");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request");
const { transaction, rollBack, commit } = require("../../../utils/transaction")
const bcrypt = require('bcrypt');
const { createUUID } = require("../../../utils/uuid");
const sendEmail = require("../../../utils/email");
const loanConfig = require("../../../model-config/loan-config");
const queryConfig = require("../../../model-config/query-config");


class UserService{

    #associationMap = {
        loans: {
            model: loanConfig.model,
            as: "loans",
            required: false,
          },
          queries: {
            model: queryConfig.model,
            as: "queries", 
            required: false,
          },
    }

    

    async create(id ,userName , password ,firstName , lastName , email , phoneNumber , gender , dateOfBirth , isAdmin , profileImageUrl,  t){
        Logger.info("create customer Service started");

        if(!t){
            t = await transaction();
        }

        try {
            let hashedPassword = await bcrypt.hash(password , 10);

            console.log(profileImageUrl);
            
            let response = await userConfig.model.create({id ,userName , password: hashedPassword ,firstName , lastName , email , phoneNumber , gender , dateOfBirth , isAdmin , profileImageUrl},{
                t
            })

           
         
            //let r = await kycConfig.model.create({id:createUUID(),userId:id},{t});

            //await sendEmail(email,"Registration successful",`Hi ${firstName}! your registration has been successful. you username is - ${userName} and password is - ${password}. please visit localhost:3000 to login.`)
        
            commit(t);
            Logger.info("create customer service ended");
            
            return response;
        } catch (error) {
            console.log(error);
            await rollBack(t);
        }
    }

    async findUser(userName){
        try {
            if(typeof userName != "string"){
                throw new badRequest("username is invalid")
            }

            let user = await userConfig.model.findOne({ where: { userName: userName } });

            if(!user){
                throw new Error("user not found")
            }

            return user;
            
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(query, t) {
        Logger.info("getAll service started");
        if (!t) {
            t = await transaction();
        }
        try {
            let selectArray = parseSelectFields(query, userConfig.fieldMapping);
            if (!selectArray) {
                selectArray = Object.values(userConfig.fieldMapping);
            }
    
            const includeQuery = query.include || []
            let association = []
            if (includeQuery) {
                association = this.#createAssociationsgetAll(includeQuery)
            }
    
            const arg = {
                attributes: selectArray,
                ...parseLimitAndOffset(query),
                transaction: t,
                ...parseFilterQueries(query, userConfig.filters),
                include: association,
            };
    
            const { count, rows } = await userConfig.model.findAndCountAll(arg);
    
           
            commit(t);
            Logger.info("getAll service ended");
            return { count, rows };
        } catch (error) {
            console.log(error);
            await rollBack(t);
        }
    }


    #createAssociationsgetAll(includeQuery) {
        const associations = []

        if (!Array.isArray(includeQuery)) {
            includeQuery = [includeQuery]
        }
        if (includeQuery?.includes(userConfig.association.loan)) {
            associations.push(this.#associationMap.loans)
        }
        if (includeQuery?.includes(userConfig.association.query)) {
            associations.push(this.#associationMap.queries);
        }
        return associations
    }



    #createAssociations(includeQuery, query = {}) {
    const associations = [];
    if (!Array.isArray(includeQuery)) {
        includeQuery = [includeQuery];
    }

    const pagination = parseLimitAndOffset(query);
    
        if (includeQuery?.includes(userConfig.association.loan)) {
        associations.push({
            ...this.#associationMap.loans,
            separate: true, 
            limit: pagination.limit || null,
            offset: pagination.offset || null,
        });
    }
    if (includeQuery?.includes(userConfig.association.query)) {
        associations.push(this.#associationMap.queries);
    }

    return associations;
}

    

    async getById(query , t){
        Logger.info("getById service started");
        if(!t){
            t = await transaction();
        }
        try {
            let selectArray = parseSelectFields(query, userConfig.fieldMapping);
        if (!selectArray) {
            selectArray = Object.values(userConfig.fieldMapping);
        }

        const includeQuery = query.include || [];
        const pagination = parseLimitAndOffset(query);

        const arg = {
            attributes: selectArray,
            transaction: t,
            ...parseFilterQueries(query, userConfig.filters),
            include: this.#createAssociations(includeQuery, query),
        };

        // console.log(arg);
            const response = await userConfig.model.findOne(arg)
            commit(t)
            Logger.info("getAll service ended")
            return response;
            
        } catch (error) {
            next(error);
        }
    }

    async updateCustomer(userId, query, t) {
        if (!t) {
          t = await transaction();
        }
        try {
            
          Logger.info("update user by id service started");
          
          let selectArray = parseSelectFields(query, userConfig.fieldMapping);

          if (!selectArray) {
            selectArray = Object.values(userConfig.fieldMapping);
          }

          const user = await userConfig.model.findByPk(userId , {
            transaction : t,
            attributes : selectArray
          })

          

          if (!user) {
            throw new Error(`Bank with id ${userId} does not exist`);
          }

          //console.log(query);
      
         
          await user.update(query, { transaction: t });
          
    
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
                ...parseFilterQueries(query, userConfig.filters),
            }
            const result = await userConfig.model.destroy(arg);

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


module.exports = UserService;