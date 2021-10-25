const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');

const Address = require('models/subdocs/address');
const Phone = require('models/subdocs/phone');

let fields = {
    fullName: {
        type: String
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    userName: {
        type: String,
    },
    gender: {
        type: String
    },
    email: {
        type: String,
    },
    moduleAccess:[{
        type:ObjectId,
        ref: 'game'
    }],
    department: {
        type: String
    },
    phoneNumber: {
        type: Phone
    },
    address: {
        type: Address
    },
    isBot: {
        type: Boolean,
        default: false
    },
    botType:{
        type: String
    },
    botAvailability:{
        type: String,
        enum: 'Available|Engaged'.split('|')
    },
    country: String,
    pincode: Number,
    profileImg: String,
    role: {
        type: ObjectId,
        ref: 'role'
    },
    status: {
        type: String,
        enum: 'Inactive|Active|Locked'.split('|'),
        default: 'Active'
    },
    hashedPassword: {
        type: String,
        required: false
    },
    salt: {
        type: String,
        required: false
    },
    userWallet:{
        type: String,
        required: false
    },
    enable:{
        type:Boolean,
        default: true
    }

};

let Schema = require('utils/generate-schema')(fields);

//Schema.index({ email: 1 }, { background: true });
//Schema.index({ email: 1, fullName: 1, role: 1 }, { background: true });
//Schema.index({ phoneNumber: 1 }, { background: true });


Schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('hex');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

module.exports = Schema;