const jwt = require('jsonwebtoken');
const Logger = require('../utils/logger');
const UnAuthorizedError = require('../../errors/unAuthorizedError');

const secrateKey = 'ascvyudhaijkms'

function checkJwtHS256( req, res, next) {
  
    next()
}


class Payload {
    constructor(id , isAdmin) {
        this.id = id;
       
        this.isAdmin = isAdmin;
    }
    static newPayload(id  , isAdmin) {
        try {
            return new Payload(id , isAdmin);
        } catch (error) {
            throw error;
        }
    }
    
    signPayload() {
       try {
        return `Bearer ${jwt.sign({
            id: this.id,
            isAdmin: this.isAdmin
        }, secrateKey, {
            expiresIn: '10hr'
        })}`
       } catch (error) {
        console.log(error);
       }
    }

    static verifyToken(token) {
        //remove Bearer
        const cleanedToken = token.split(" ").pop();
        let payload = jwt.verify(cleanedToken, secrateKey)
        return payload;

    }

}

const verifyAdmin = (req, res, next) => {
    try {
        Logger.info("verifyAdmin started");

        let token;

       

        // Check for token in Authorization header
        if (req.headers['authorization']) {
            const authHeader = req.headers['authorization'];
            token = authHeader.split(" ").pop(); // Extract the token
        }

        // If not found in header, check in cookies
        if (!token && req.cookies['auth']) {
            token = req.cookies['auth']; // Extract the token from cookies
            token = token.replace(/Bearer\s+/g, "").trim();
        }

        // If token is still not found, throw an error
        if (!token) {
            throw new UnAuthorizedError("Token not found in Authorization header or cookies");
        }

        // Verify the token
        let payload = Payload.verifyToken(token);

        // Check if the user is an admin
        if (!payload.isAdmin) {
            throw new UnAuthorizedError("Only admin can access this route");
        }

        Logger.info("verifyAdmin ended");
        next();
    } catch (error) {
        Logger.error("Error in verifyAdmin middleware", error);
        next(error);
    }
};

const verifyStaff = (req, res, next) => {
    try {
        Logger.info("verifystaff started")
        if (!req.cookies['auth'] && !req.headers['authorization']) {
            throw new UnAuthorizedError("token not found...")
        }
        let token;

        

        // Check for token in Authorization header
        if (req.headers['authorization']) {
            const authHeader = req.headers['authorization'];
            token = authHeader.split(" ").pop(); // Extract the token
        }

        // If not found in header, check in cookies
        if (!token && req.cookies['auth']) {
            token = req.cookies['auth']; // Extract the token from cookies
            token = token.replace(/Bearer\s+/g, "").trim();
        }

        // If token is still not found, throw an error
        if (!token) {
            throw new UnAuthorizedError("Token not found in Authorization header or cookies");
        }

        // Verify the token
        let payload = Payload.verifyToken(token);
        
       
        if (payload.isAdmin) {
            throw new UnAuthorizedError("Admin cant do this oprations , only user can do...")
        }
        Logger.info("verifystaff ended")
        Logger.info("next called")
        req.id = payload.id;
        next();
    } catch (error) {
       next(error);
    }
}


module.exports = {
    checkJwtHS256 , Payload , verifyAdmin , verifyStaff
};