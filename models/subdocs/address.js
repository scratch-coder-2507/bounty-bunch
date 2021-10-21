/*
 * Address
 */
var AddressSchema = {
    name: String,
    line1: {
        type: String,
        required: true
    },
    line2: String,
    locality: String,
    landmark: String,
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    primary: {
        type: Boolean,
        default: false
    }
};

/* global module */
module.exports = AddressSchema;
