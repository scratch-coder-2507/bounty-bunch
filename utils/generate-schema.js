'use strict';
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = function (fields) {
    let finalFields = _.assignIn(_.cloneDeep(require('models/base-schema')), fields);
    var schema = new Schema(finalFields);
    schema.statics.getFields = function () {
        _(finalFields).forEach(function (value, key) {
            var result;
            var originalValue = value;

            if (_.isArray(value)) {
                result = [];
                value = value[0];
            }
            if (_.has(value, 'paths')) {
                value = _.mapValues(value.paths, function (value) {
                    return value.options;
                });
                value = _.omit(value, ['_id']);
            }
            if (_.isArray(originalValue)) {
                result.push(value);
            } else {
                result = value;
            }

            finalFields[key] = result;
        });
        return finalFields;
    };

    return schema;
};