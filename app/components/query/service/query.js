const Logger = require("../../../utils/logger");
const queryConfig = require("../../../model-config/query-config");
const { transaction, commit, rollBack } = require("../../../utils/transaction");
const { validateUUID } = require("../../../utils/uuid");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request");
const sendEmail = require("../../../utils/email");
const db = require("../../../../models");

class QueryService {
  async createQuery(id, userId, title, description, email ,t) {
    Logger.info("createQuery service started");

    if (!t) {
      t = await transaction();
    }

    try {
      const response = await queryConfig.model.create(
        { id, userId, title, description, status: "Pending" },
        { transaction: t }
      );

      await sendEmail(email , title , description);

      commit(t);
      Logger.info("createQuery service ended");
      return response;
    } catch (error) {
      Logger.error("Error in createQuery service:", error);
      await rollBack(t);
      throw error;
    }
  }

  async updateQuery(id, data  , t) {
    Logger.info("updateQuery service started");

    if (!t) {
      t = await transaction();
    }

    try {
      if (!validateUUID(id)) {
        throw new Error("Invalid query ID");
      }

      const query = await queryConfig.model.findByPk(id, { transaction: t });
      console.log(query);

      if (!query) {
        throw new Error(`Query with ID ${id} not found`);
      }

      // Update the query with new data
      await query.update(data, { transaction: t });


      commit(t);
      Logger.info("updateQuery service ended");
      return query;
    } catch (error) {
      Logger.error("Error in updateQuery service:", error);
      await rollBack(t);
      throw error;
    }
  }

  async getAllQueries(query, t) {
    Logger.info("getAllQueries service started");

    if (!t) {
      t = await transaction();
    }

    try {
      let selectArray = parseSelectFields(query, queryConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(queryConfig.fieldMapping);
      }

      const arg = {
        attributes: selectArray,
        ...parseLimitAndOffset(query),
        transaction: t,
        ...parseFilterQueries(query, queryConfig.filters),
        include: [
            {
              model: db.user, 
              as: "user", 
              attributes: ["email"], 
            },
          ],
      };

      const { count, rows } = await queryConfig.model.findAndCountAll(arg);

      commit(t);
      Logger.info("getAllQueries service ended");
      return { count, rows };
    } catch (error) {
      Logger.error("Error in getAllQueries service:", error);
      await rollBack(t);
      throw error;
    }
  }

  
  async deleteById(queryId, t) {
    Logger.info("deleteQuery service started");
    if (!t) {
        t = await transaction();
    }
    try {
        const arg = {
            where: { id: queryId },
            transaction: t,
        };

        const result = await queryConfig.model.destroy(arg);

        if (result === 0) {
            throw new Error(`Query with ID ${queryId} does not exist.`);
        }

        await commit(t);
        Logger.info("deleteQuery service ended");
        return true;
    } catch (error) {
        await rollBack(t);
        Logger.error("Error in deleteQuery service:", error);
        throw error;
    }
}
}

module.exports = QueryService;