/* global module */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// var schema = require('utils/generate-schema')(fields);

schema.index({ name: 1 }, { unique: true, background: true });

module.exports = mongoose.model('role', schema);
