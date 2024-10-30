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
        let payload = jwt.verify(token, secrateKey)
        return payload;

    }

}

const verifyAdmin = (req, res, next) => {
    try {
        
        Logger.info("verifyAdmin started")
    
        if (!req.cookies['auth'] && !req.headers['Auth']) {
            throw new UnAuthorizedError("Cookie Not Found")
        }

        //token??
        let token = req.cookies['auth'].split(" ")[2];
        
       
        let payload = Payload.verifyToken(token);

        
        if (!payload.isAdmin) {
            throw new UnAuthorizedError("only user can access this route..")
        }
        Logger.info("verifyAdmin ended")
        Logger.info("next called")
        next();
    } catch (error) {
       next(error);
    }
}

const verifyStaff = (req, res, next) => {
    try {
        Logger.info("verifystaff started")
        if (!req.cookies['auth'] && !req.headers['auth']) {
            throw new UnAuthorizedError("token not found...")
        }
        //token??
        let token = req.cookies['auth'].split(" ")[2];
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