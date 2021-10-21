/* global module */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    created: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'user',
        required: false
    },
    modified: {
        type: Date
    },
    modifiedBy: {
        type: Schema.ObjectId,
        ref: 'user',
        required: false
    }
};

