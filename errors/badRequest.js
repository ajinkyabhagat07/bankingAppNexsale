const ContactAppError = require("./baseError");
const { StatusCodes } = require('http-status-codes')
class badRequest extends ContactAppError{
    constructor(specificMessage) {
        super(StatusCodes.BAD_REQUEST, specificMessage, "Bad Request", "Invalid Request");
    }
}

module.exports = badRequest;