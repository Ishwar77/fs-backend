const JwtHelper = require("../../utils/jwtHelper");
const APIResponse = require("../../models/apiResponse");
class AuthorizeMiddleware {
    /**
     * Basic Middleware that looks for 
     * To control access to API endpoints, looks for basic JWT tokens presence
     * NOTE: Auth token must be present & lock field must be false to access the APIs
     * @param {*} req HttpRequest 
     * @param {*} res HttpResponse
     * @param {*} next any
     */
    static async verifyJWT(req, res, next) {

        const token = JwtHelper.getAuthTokenFromHeader(req);
       // console.log('Token = ', token);
        if (!token) {
            APIResponse.sendResponse(res, 403, "Authorized access only");
            return false;
        }

        // Token is present, so verify for the AuthToken validity
        const key = JwtHelper.getSecretKey();
      //  console.log('Key = ', key);
        try {
            const tokenData = await JwtHelper.verify(token, key); // Helper.verifyAuthToken(token, Helper.getSecretKey());
        //    console.log('TD = ', tokenData);
            if (!tokenData || !tokenData.data) {
                APIResponse.sendResponse(res, 401, "You are not authorized to make this request", null);
                return false;
            }

            try {
                const data = JSON.parse(tokenData.data);
                if (!data) {
                    APIResponse.sendResponse(res, 403, "Authorised access only", null);
                    return false;
                }
                // Set user role and Id into the header
                req.headers['user'] = data;
            } catch (e) {
                APIResponse.sendResponse(res, 403, "Authorised access only", null);
                return false;
            }


        } catch (e) {
            APIResponse.sendResponse(res, 401, "You are not authorized to make this request", null);
            return false;
        }

        next();
    }

    /**
     * To enable access for Admin only
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static async adminOnly(req, res, next) {

        const token = JwtHelper.getAuthTokenFromHeader(req);
        if (!token) {
            APIResponse.sendResponse(res, 403, "Authorized access only");
            return false;
        }

        // Token is present, so verify for the AuthToken validity
        const key = JwtHelper.getSecretKey();
      //  console.log('Key = ', key);
        const tokenData = await JwtHelper.verify(token, key); // Helper.verifyAuthToken(token, Helper.getSecretKey());
       // console.log('TD = ', tokenData);
        if (!tokenData || !tokenData.data) {
            APIResponse.sendResponse(res, 401, "You are not authorized to make this request", null);
            return false;
        } else {
            try {
                const data = JSON.parse(tokenData.data);
                if (!data || !data.userRole || data.userRole !== 1) {
                    APIResponse.sendResponse(res, 401, "You do not have previlate make this request", null);
                    return false;
                }
            } catch (e) {
                APIResponse.sendResponse(res, 401, "You do not have previlate make this request", null);
                return false;
            }
        }
        next();
    }

    /** provides access to Admin or Client only */
    static async adminORclientOnly(req, res, next) {

        const token = JwtHelper.getAuthTokenFromHeader(req);
        if (!token) {
            APIResponse.sendResponse(res, 403, "Authorized access only");
            return false;
        }

        // Token is present, so verify for the AuthToken validity
        const key = JwtHelper.getSecretKey();
      //  console.log('Key = ', key);
        const tokenData = await JwtHelper.verify(token, key); // Helper.verifyAuthToken(token, Helper.getSecretKey());
      //  console.log('TD = ', tokenData);
        if (!tokenData || !tokenData.data) {
            APIResponse.sendResponse(res, 401, "You are not authorized to make this request", null);
            return false;
        } else {
            try {
                const data = JSON.parse(tokenData.data);
                if (!data || !data.userRole || data.userRole !== 1 || data.userRole !== 3) {
                    APIResponse.sendResponse(res, 403, "Authorised access only", null);
                    return false;
                }
            } catch (e) {
                APIResponse.sendResponse(res, 403, "Authorised access only", null);
                return false;
            }
        }
        next();
    }


    static async clientOnly(req, res, next) {

        const token = JwtHelper.getAuthTokenFromHeader(req);
        if (!token) {
            APIResponse.sendResponse(res, 403, "Authorized access only");
            return false;
        }

        // Token is present, so verify for the AuthToken validity
        const key = JwtHelper.getSecretKey();
      //  console.log('Key = ', key);
        const tokenData = await JwtHelper.verify(token, key); // Helper.verifyAuthToken(token, Helper.getSecretKey());
       // console.log('TD = ', tokenData);
        if (!tokenData || !tokenData.data) {
            APIResponse.sendResponse(res, 401, "You are not authorized to make this request", null);
            return false;
        } else {
            try {
                const data = JSON.parse(tokenData.data);
                if (!data || !data.userRole || data.userRole !== 3) {
                    APIResponse.sendResponse(res, 401, "You do not have previlate make this request", null);
                    return false;
                }
            } catch (e) {
                APIResponse.sendResponse(res, 401, "You do not have previlate make this request", null);
                return false;
            }
        }
        next();
    }

        /**
     * To enable access for Admin and Trainer only
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static async trainerandAdmin(req, res, next) {

        const token = JwtHelper.getAuthTokenFromHeader(req);
        if (!token) {
            APIResponse.sendResponse(res, 403, "Authorized access only");
            return false;
        }

        // Token is present, so verify for the AuthToken validity
        const key = JwtHelper.getSecretKey();
      //  console.log('Key = ', key);
        const tokenData = await JwtHelper.verify(token, key); // Helper.verifyAuthToken(token, Helper.getSecretKey());
       // console.log('TD = ', tokenData);
        if (!tokenData || !tokenData.data) {
            APIResponse.sendResponse(res, 401, "You are not authorized to make this request", null);
            return false;
        } else {
            try {
                const data = JSON.parse(tokenData.data);
                if (!data || !data.userRole || data.userRole == 3 || data.userRole == 2 || data.userRole == 4 || data.userRole == 5) {
                    APIResponse.sendResponse(res, 401, "You do not have previlate make this request", null);
                    return false;
                }
            } catch (e) {
                APIResponse.sendResponse(res, 401, "You do not have previlate make this request", null);
                return false;
            }
        }
        next();
    }

}
module.exports = AuthorizeMiddleware;
