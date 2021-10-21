/*
 * Phone
 */
var Phone = {
    countryCode: {
        type: String,
        default: '91'
    },
    number: {
        type: String,
        required: true
    },
    primary: {
        type: Boolean,
        default: false
    }
};

/* global module */
module.exports = Phone;
