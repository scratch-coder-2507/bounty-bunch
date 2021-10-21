'use strict';
class AccessDenialError extends Error {
    constructor(message) {
        if(!message){
            message = "Access Denied";
        }
        super(message);
    }
    static validateUpdationPermission(orderVisibleTo = [], bidVisibleTo = [], companyId) {
        let canUpdate = false;
        let allCompanys = orderVisibleTo.concat(bidVisibleTo);
        for(let i = 0; i < allCompanys.length; i++){
            if(allCompanys[i].toString() === companyId.toString()){
                canUpdate = true;
                break;
            }
        }
        if(!canUpdate){
            throw new Error("Access Denied");
        }
    }
}

module.exports = AccessDenialError;