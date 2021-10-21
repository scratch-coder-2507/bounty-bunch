/* global module */
'use strict';

var mongoose = require('mongoose');

var fields = {
    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
};

var schema = require('utils/generate-schema')(fields);

module.exports = mongoose.model('client', schema);
