let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.ObjectId;

let schema = new mongoose.Schema({
    request: {
        method: String,
        url: String,
        apiUrl: String,
        "user-agent": String,
        headers: {},
        ip: String,
        body: {},
        params: {},
        form: {},
        queryParameters: {},
        response: {},
        path: String
    },
    userId: String,
    responseTime: Number,
    failureerrors: {},
    memwatch: {},
    memoryUsage: {},
    cursor: ObjectId,
    lastRequestAt: Date,
    created:{
        type: Date,
        default: Date.now
    }
});

schema.index({ "request.headers.authkey": 1, created: -1, "request.url": 1 }, { background: true });

schema.index({ "request.url": 1, "request.headers.authkey": 1, cursor: -1 }, { background: true });

schema.index({ "request.url": 1, "request.headers.authkey": 1, lastRequestAt: -1 }, { background: true });

let Model = mongoose.model('request_log', schema);

module.exports = Model;