'use strict';
class ValidationError extends Error {
    constructor(message, data) {
        if(!message){
            message = "Authentication Failure";
        }
        super(message);
        this.data = data;
    }
}

module.exports = ValidationError;