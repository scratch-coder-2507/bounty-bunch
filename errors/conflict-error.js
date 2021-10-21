'use strict';
class ConflictError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = ConflictError;