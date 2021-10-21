let mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

let fields = {
    gameName: {
        type: String,
        required: true
    },
    gameStatus: {
        type: String,
        enum: 'Inactive|Active'.split('|'),
        default: 'Active'
    },
    gameCategory: {
        type: ObjectId,
        ref: 'gameCategory',
        required: true
    },
    rules: {
        type: String
    },
    // tournment: {
    //     type: String,
    //     required: false
    // },
    description: {
        type: String
    },
    gameType: {
        type: String,
        enum: 'SinglePlayer|MultiPlayer'.split('|'),
        default: 'SinglePlayer',
        required: true
    },
    type: {
        type: String,
        enum: 'Free|Paid'.split('|'),
        default: 'Free'
    },
    noOfParticipants: {
        type: Number
    },
    totalParticipants: Number,
    icon: {
        type: String
    },
    bundleIdentifier:{
        type: String
    },
    banner: [{
        type: String
    }],
    gameResults: {

    },
    enable:{
        type:Boolean,
        default: true
    }
};

let Schema = require('utils/generate-schema')(fields);


Schema.index({ gameName: 1 }, { background: true });

module.exports = Schema;