'use strict';
let AccessDenialError = require('./access-denial');
let ValidationError = require('./validation-error');
let ConflictError = require('./conflict-error');
let AuthenticationFailure = require('./authentication-failure');
let UnprocessedError = require('./unprocessed-error');
var _ = require('lodash');

function handleValidationError(err){
    let messages = [];
    for (let field in err.errors) {
        messages.push(err.errors[field].message);
    }
    return messages;
}

function handleException(err, next) {
    console.log(err);
    let message = err.message;
    let data = err.data;
    let status = 500;
    if (err.name === 'MongoError' && _.startsWith(err.message, 'E11000')) {
        status = err.status || 422;
        message = 'Duplicate record';
    } else if (err instanceof ValidationError) {
        status = 412;
    }else if (err instanceof AccessDenialError) {
        status = 403;
    }else if(err.name === 'ValidationError'){
        message = handleValidationError(err);
    } else if(err instanceof  UnprocessedError) {
        status = 422;
    }
    if(err.statusCode) {
        status = err.statusCode;
    }
    console.log(err.stack);
    next({message, status, data});
}

module.exports = {
    AccessDenialError,
    ValidationError,
    ConflictError,
    handleException,
    AuthenticationFailure,
    UnprocessedError
};


