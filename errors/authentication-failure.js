'use strict';
class AuthenticationFailure extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = AuthenticationFailure;