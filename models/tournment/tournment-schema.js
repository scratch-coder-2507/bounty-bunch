const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;
let fields = {
    gameId: {
        type: ObjectId,
        ref: 'game'
    },
    tableName: {
        type: String,
        required: false
    },
    attempts: {
        type: String
    },
    tableImage: {
        type: String,
        required: false
    },
    noOfAttempts: {
        type: String
    },
    entryFee: {
        type: String
    },
    winningAmount: {
        type: String
    },
    adminStake: {
        type: String
    },
    tournmentSize: {
        type: String,
        required: false
    },
    noOfWinners: {
        type: String,
        required: false
    },
    winners: [{
        winnerCount: {
            type: String
        },
        prize: {
            type: Number
        }
    }],
    description: {
        type: String
    },
    rules: {
        type: String
    },
    tourStartDateAndTime: {
        type: Date,
        default: new Date()
    },
    tourEndDateAndTime: {
        type: Date,
        default: new Date()
    },
    regStartDateAndTime: {
        type: Date,
        default: new Date()
    },
    regEndDateAndTime: {
        type: Date,
        default: new Date()
    },
    mode:{
        type: String
    },
    alternateTourStartDateAndTime: {
        type: Date,
        default: new Date()
    },
    alternateTourEndDateAndTime: {
        type: Date,
        default: new Date()
    },
    alternateRegStartDateAndTime: {
        type: Date,
        default: new Date()
    },
    alternateRegEndDateAndTime: {
        type: Date,
        default: new Date()
    },
    
    section: {
        type: String,
        enum: 'Tournment|Live|Demo'.split('|'),
        default: 'Tournment',
        required: false
    },
    tournmentType: {
        type: String,
        enum: 'Fixed|TimePeriod'.split('|'),
        default: 'Fixed',
        required: false
    },
    bots: {
        type: String
    },
    bonus: {
        type: String
    },
    autoCreate: {
        type: String
    },
    enable: {
        type: Boolean,
        default: true
    },
    types: {
        type: String
    },
    status: {
        type: String,
        enum: 'Inactive|Active'.split('|'),
        default: 'Active'
    },
    botsActivation: {
        type: Boolean,
        default: true
    },
    totalBots: {
        type: Number
    },
    fairPlayBots: {
        type: Number
    },
    mustWinBots: {
        type: Number
    },
    minPlayer: {
        type: Number
    }
};

let Schema = require('utils/generate-schema')(fields);


// Schema.index({ gameName: 1 }, { background: true });

module.exports = Schema;