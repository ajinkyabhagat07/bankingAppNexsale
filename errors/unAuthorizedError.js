const ContactAppError = require("./baseError");
const { StatusCodes } = require('http-status-codes')
class UnAuthorizedError extends ContactAppError {
    constructor(specificMessage) {
        super(StatusCodes.UNAUTHORIZED, specificMessage, "UNAUTHORIZED", "UNAUTHORIZED Request")
    }
}
module.exports = UnAuthorizedError
