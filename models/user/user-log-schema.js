const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

let fields = {
    userId: {
        type: ObjectId,
        ref: 'user'
    },
    lastLoginDate: {
        type: Date,
        default: Date.now
    },
    logIn:{
        type: Date,
        default:Date.now
    },
    logOut:{
        type:Date
    }
};

let Schema = require('utils/generate-schema')(fields);

Schema.index({ userId: 1 }, { background: true });

module.exports = mongoose.model('user_logs', Schema);