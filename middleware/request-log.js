let mongoose = require('mongoose');
let RequestLogs = require('models/request-log');
let util = require('util');

module.exports = {
    pre: async function preRequest(req, res, next) {
        try {
            let ip = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
            let request_logs = {};
            request_logs.request = {};
            request_logs.request.ip = ip;
            request_logs.request["user-agent"] = req.headers["user-agent"];
            request_logs.request.headers = req.headers;
            request_logs._id = mongoose.Types.ObjectId();
            request_logs.request.body = req.body;
            request_logs.request.method = req.method;
            request_logs.request.queryParameters = req.query;
            request_logs.request.url = req.url;
            request_logs.memoryUsage = { before: util.inspect(process.memoryUsage()) };
            req.request_logs = request_logs;
            req.startTime = new Date().getTime();
            await (new RequestLogs(request_logs).save());
        } catch (e) {
            console.error(e.stack);
        }
        next();
    },

    post: function postRequest(req, res, next) {
        try {
            var log = req.request_logs;
            if (req.user && req.user.id) {
                log.userId = req.user.id;
            }
            log.modified = new Date();
            log.responseTime = (new Date().getTime()) - (req.startTime);
            log.memoryUsage.after = util.inspect(process.memoryUsage());
            log.request.response = res.data;
            log.request.apiUrl = req.route.path;
            if (req.cursor) {
                log.cursor = req.cursor;
            }
            if (req.lastRequestAt) {
                log.lastRequestAt = req.lastRequestAt;
            }
            RequestLogs.update({ _id: mongoose.Types.ObjectId(log._id) }, log, { upsert: true }, function (err, doc) {
                if (err) {
                    console.log("error while saving after request after routing", err.stack);
                }
            });
        } catch (e) {
            console.error(e.stack);

        }
        next();
    },

    errorResponse: function (req, err) {
        try {
            var log = req.request_logs;
            if (!log) {
                return;
            }
            if (req.user && req.user.id) {
                log.userId = req.user.id;
            }
            log.modified = new Date();
            log.responseTime = (new Date().getTime()) - (req.startTime);
            log.memoryUsage.after = process.memoryUsage();
            log.request.error = err;
            log.request.apiUrl = (req.route || {}).path;
            RequestLogs.update({ _id: mongoose.Types.ObjectId(log._id) }, log, { upsert: true }, function (err, doc) {
                if (err) {
                    console.log("error while saving after request after routing", err.stack);
                }
            });

        } catch (e) {
            console.log('error while saving error reponse', e);
        }
    }
};