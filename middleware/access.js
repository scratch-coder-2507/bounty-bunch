/* global module */
'use strict';

var _ = require('lodash');
var passport = require('passport');
var ObjectId = require('mongoose').Types.ObjectId;
let mongoose = require('mongoose');
const UserModel = mongoose.model('user');
var param = "\:.[^/]*";

module.exports = function access(route) {

    return function accessMiddleware(req, res, next) {
        if (req.originalUrl.slice(-1) === "/") {
            req.originalUrl = req.originalUrl.slice(0, -1);
        }
        var url = req.originalUrl;
        /*
         * Trying to remove query string from URL when testing access
         */
        if (/\?/.test(url)) {
            url = url.slice(0, url.indexOf("?"));
        }

        var urlParts = _.compact(_.split(url, '/'));

        urlParts = _.map(urlParts, function mapUrlParts(part) {
            if (/^[0-9a-fA-f]{24}$/.test(part)) {
                try {
                    var possibleId = new ObjectId(part);
                    if (possibleId == part) {
                        return param;
                    }
                    return part;
                } catch (err) {
                    return part;
                }
            } else {
                return part;
            }
        });

        if (route.public) {
            return next();
        }

        passport.authenticate('bearer', function passportAuthCallback(err, user, info) {
            if (err) {
                return next(err);
            }
            console.log("user:", user);
            if (!user) {
                return next({ status: 401, message: 'Invalid credentials' });
            }
            if (user.status === 'Locked') {
                return next({ status: 403, message: 'Forbidden' });
            }
            if (route.allUsers) {
                req.user = user;
                return next();
            }
            return next({ status: 403, message: 'Forbidden' });

        })(req, res, next);
    };
};
