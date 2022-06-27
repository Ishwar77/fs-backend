module.exports = class JWTPayload {

    constructor(userId = -1, userRole = 2, created_on = null, isGuest = true, clientSignature = null) {
        this.userId = userId;
        this.userRole = userRole; // 2 = guest
        this.created_on = created_on;
        this.isGuest = isGuest;
        this.clientSignature = clientSignature;
}
// static getAuthInfoFromRequestObj(reqObj, updateableFields = false) {

//       const locked = reqObj.locked === undefined || reqObj.locked === null ? false : reqObj.locked;
//       return new Auth(reqObj.userId || -1, reqObj.created_on || null, reqObj.isGuest || true, locked );
//   }

  static getTokenFromReqObj(reqObj, tokenPropName) {
      if(!reqObj || !tokenPropName) return null;

      // 1. Try to fetch directly
      const token = reqObj[`${tokenPropName}`];
      if(token) return token;

      // 2. Try fetching by props match
      const propsAry = Object.getOwnPropertyNames(reqObj);
      propsAry.forEach(prop => {
          if(prop === tokenPropName) {
              return reqObj.prop;
          }
      });
      return null;
  }
}
