'use strict';
class UnprocessedError extends Error {
    constructor(message, data) {
        if(!message){
            message = "Cannot be processed";
        }
        super(message);
        this.data = data;
    }
}

module.exports = UnprocessedError;