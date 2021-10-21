const mongoose = require('mongoose');

let fields = {
    name:{
        type: String,
        required: true
    },
    description:{
        type:String
    },
    icon:{
        type:String,
        required:false
    },
    banner:[{
        type:String
    }],
    // type:{
    //     type: String,
    //     enum: 'SinglePlayer|MultiPlayer'.split('|'),
    //     default: 'SinglePlayer',
    //     required: false
    // }
    enable:{
        type:Boolean,
        default: true
    },
    status: {
        type: String,
        enum: 'Inactive|Active'.split('|'),
        default: 'Active'
    }
};

let Schema = require('utils/generate-schema')(fields);


// Schema.index({ gameName: 1 }, { background: true });

module.exports = Schema;