let _ = require('lodash');
const fs = require('fs');
const path = require('path');
const commonFunction = require('utils/common-functions');

const access = require('middleware/access');
const requestLog = require('middleware/request-log');
const requestParse = require('middleware/request-parse');

function sentHeaders(req, res, next) {
    if (res.data) {
        return next('route');
    }

    return next();
}

module.exports = function (app, config) {

    app.use(requestLog.pre);
    app.use(requestParse.parse);
    // app.use(access());

    var dirs = commonFunction.getFolders(__dirname);
    var routes = [];

    // going through each directory
    _(dirs).forEach(function forEachDir(dir) {
        var dirRoutes = require('./' + dir);

        // going through each routes present in that directory
        _.map(dirRoutes, function forEachroute(route) {
            if (route.path.slice(-1) === "/") {
                route.path = route.path.slice(0, -1);
            }
            route.path = '/' + dir + route.path;
        });
        routes = _.concat(routes, dirRoutes);

    });

    // creating router 
    var router = require('express').Router();
    _(routes).forEach(function (route) {
        switch (route.method) {
            case 'get':
                router.get(route.path, access(route), sentHeaders, route.controller);
                break;
            case 'post':
                router.post(route.path, access(route), sentHeaders, route.controller);
                break;
            case 'put':
                router.put(route.path, access(route), sentHeaders, route.controller);
                break;
            case 'delete':
                router.delete(route.path, access(route), sentHeaders, route.controller);
                break;

        }
    });
    app.use('/', router);

    app.use(requestLog.post);


    app.use(function postHandler(req, res, next) {
        if (req.route && req.route.path) {
            res.json({
                success: true,
                resultSize: res.resultSize,
                data: res.data
            });
            res.end();
            return;
        } else {
            next();
        }
    });

    app.use(function notFoundHandler(req, res, next) {
        if (!req.route || !req.route.path) {
            console.log(req.params);
            res.status(404);
            console.log('%s %d %s', req.method, res.statusCode, req.url);
            return res.json({
                error: 'Not found'
            });
        }
    });

    app.use(function errorHandler(err, req, res, next) {
        try {
            console.log(err);
            requestLog.errorResponse(req, err);
        } catch (e) {
            console.log('error while saving error reponse', e);
        }
        if (err.name === 'MongoError' && _.startsWith(err.message, 'E11000')) {
            res.status(err.status || 422);
        } else if (err.name === 'ValidationError') {
            res.status(err.status || 422);
        } else {
            var request = { url: req.url };
            request.error = err;
            request.method = req.method;
            if (req.body) {
                request.body = req.body;
            }
            if (req.params) {
                request.params = req.params;
            }
            if (req.query) {
                request.query = req.query;
            }
            /*glip.notify(request, function (err, response) {
            });*/
            res.status(req.customStatus || err.status || 500);
        }
        return res.json({
            success: false,
            error: err
        });
    });
}