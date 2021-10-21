'use strict';

const oauth2orize = require('oauth2orize');
const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose')
const _ = require('lodash');

const errors = require('errors/index');
const ValidationError = errors.ValidationError;

const User = mongoose.model('user');
const AccessToken = mongoose.model('access_token');
const RefreshToken = mongoose.model('refresh_token');

module.exports = function (config) {
    // create an server
    var aserver = oauth2orize.createServer();

    // destroy the old tokens and generate a new token and access the fresh token
    let generateToken = function (data, done) {
        var refreshToken,
            refreshTokenValue,
            token,
            tokenValue;
        tokenValue = crypto.randomBytes(32).toString('hex');
        refreshTokenValue = crypto.randomBytes(32).toString('hex');

        data.token = tokenValue;
        token = new AccessToken(data);
        data.tokenId = token._id;
        data.token = refreshTokenValue;
        refreshToken = new RefreshToken(data);

        refreshToken.save(function (err, refreshToken) {

        });
        token.save(function (err) {
            if (err) {
                return done(err);
            }
            done(null, tokenValue, refreshTokenValue, {
                'expires_in': config.security.tokenLife,
                'tokenId': token._id,
                'isAdmin': data.isAdmin
            });
        });
    };

    // Exchange username and password for access token 
    aserver.exchange(oauth2orize.exchange.password(function (client, userName, password, scope, done) {
        User.findOne({ userName: userName, status: { $in: ['Active', 'Locked', 'Inactive', 'New'] } }).exec(function (err, user) {
            console.log("user:", user);
            if (err) {
                return done(err);
            } else if (!user) {
                return done({ message: "Username or password invalid", code: 'invalid_grant', status: 412 })
            } else if (user.status === 'New') {
                return done({ message: 'Account not yet activated', code: 'invalid_grant', status: 412 });
            } else if (user.status === 'Inactive') {
                return done({ message: 'Account suspended', code: "invalid_grant", status: 412 });
            } else if (!user.checkPassword(password)) {
                return done({ message: "Username or password invalid", code: 'invalid_grant', status: 412 })
            }
            generateToken({
                userId: user._id,
                clientId: client.clientId,
                // isAdmin: user.role && user.role.length > 0 && (user.role[0].name === 'Sub-Admin' || user.role[0].name === 'Admin')
            }, done);
        });
    }));

    // Exchange refreshToken for access token 
    aserver.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scpoe, done) {
        RefreshToken.findOne({ token: refreshToken, clientId: client.clientId }, function (err, token) {
            if (err) {
                return done(err);
            }
            if (!token) {
                return done(null, false);
            }
            User.findById(token.userId, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }

                generateToken({
                    userId: user._id,
                    clientId: client.clientId
                }, done);
            });
        });
    }));


    // token endpoint

    var token = [
        passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
        aserver.token(),
        aserver.errorHandler()
    ];

    return token;
}