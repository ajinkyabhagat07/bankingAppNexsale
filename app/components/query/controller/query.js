const { HttpStatusCode } = require("axios");
const { createUUID, validateUUID } = require("../../../utils/uuid");
const Logger = require("../../../utils/logger");
const badRequest = require("../../../../errors/badRequest");
const NotFoundError = require("../../../../errors/notFoundError");
const QueryService = require("../service/query");
const sendEmail = require("../../../utils/email");

class QueryController {
  constructor() {
    this.queryService = new QueryService();
  }

  
  async createQuery(req, res, next) {
    try {
      Logger.info("createQuery controller started");
      const { userId, title, description , email} = req.body;

      // Basic validation
      if (!userId || !validateUUID(userId)) {
        throw new badRequest("Invalid or missing userId");
      }
      if (!title || title.trim() === "") {
        throw new badRequest("Title is required");
      }
      if (!description || description.trim() === "") {
        throw new badRequest("Description is required");
      }

      const response = await this.queryService.createQuery(
        createUUID(),
        userId,
        title,
        description,
        email
      );

      if (!response) {
        throw new Error("Failed to create query");
      }

      Logger.info("createQuery controller ended");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Update an existing query
  async updateQuery(req, res, next) {
    try {
      Logger.info("updateQuery controller started");
      const { id } = req.query;
      const { adminRemarks, status , email } = req.body;
     

    if (!validateUUID(id)) {
      throw new Error("Invalid query ID");
    }

    const query = await this.queryService.updateQuery(id, { adminRemarks  , status});

    if (!query) {
      throw new NotFoundError("Query not found or update failed.");
    }

    

     await sendEmail(email, "Query Update", `Your query remark was updated to: ${adminRemarks}`);


      Logger.info("updateQuery controller ended");
      res.status(HttpStatusCode.Ok).json({ message: `Query with ID ${id} updated successfully` });
    } catch (error) {
      next(error);
    }
  }

  async getAllQueries(req, res, next) {
    try {
      Logger.info("getAllQueries controller started");
      const { count, rows } = await this.queryService.getAllQueries(req.query);
      res.set("X-Total-Count", count); 
      res.status(HttpStatusCode.Ok).json(rows);
      Logger.info("getAllQueries controller ended");
    } catch (error) {
      next(error);
    }
  }

  async deleteQuery(req, res, next) {
    try {
      Logger.info("deleteQuery controller started");
      const { id } = req.query;

      if (!id) {
        throw new badRequest("Query ID is required");
      }

      const response = await this.queryService.deleteById(id);
      if (!response) {
        throw new NotFoundError(
          `Query with ID ${id} not found or could not be deleted.`
        );
      }

      res.status(HttpStatusCode.Ok).json({message: `Query with ID ${id} has been deleted successfully.`,});
      Logger.info("deleteQuery controller ended");
    } catch (error) {
      next(error);
    }
  }
}

const queryController = new QueryController();
module.exports = queryController;
