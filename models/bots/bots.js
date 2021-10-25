const mongoose = require('mongoose');

const BotsSchema = mongoose.Schema({
    userName: {
        type: String,
    },
    gender: {
        type: String
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
    status: {
        type: String,
        enum: 'Inactive|Active|Locked'.split('|'),
        default: 'Active'
    },
    enable:{
        type:Boolean,
        default: true
    }
});

module.exports = mongoose.model('Bots', BotsSchema);

//let Schema = require('utils/generate-schema')(fields);

//Schema.index({ email: 1 }, { background: true });
//Schema.index({ email: 1, fullName: 1, role: 1 }, { background: true });
//Schema.index({ phoneNumber: 1 }, { background: true });

