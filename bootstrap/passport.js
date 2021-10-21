const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const User = require('models/user');
const Client = require('models/auth/client');
const AccessToken = require('models/auth/access-token');


module.exports = function (app, passport, config) {
    passport.use(new BasicStrategy(
        function (userid, password, done) {
            Client.findOne({ clientId: userid }, function (err, client) {
                if (err) { return done(err); }
                if (!client) { return done(null, false); }
                if (client.client !== password) { return done(null, false); }
                return done(null, client);
            });
        }
    ));

    passport.use(new ClientPasswordStrategy(
        function (clientId, clientSecret, done) {
            Client.findOne({ clientId: clientId }, function (err, client) {
                if (err) { return done(err); }
                if (!client) { return done(null, false); }
                if (client.clientSecret != clientSecret) { return done(null, false); }
                return done(null, client);
            });
        }
    ));

    passport.use(new BearerStrategy(
        function (accessToken, done) {
            AccessToken.findOne({ token: accessToken }, function (err, token) {
                if (err) {
                    return done(err);
                }
                if (!token) {
                    return done(null, false);
                }
                if (Math.round((Date.now() - token.created) / 1000) > config.security.tokenLife) {
                    AccessToken.remove({ token: accessToken }, function (err) {
                        if (err) {
                            return done(err);
                        }
                    })
                }
                User.findById(token.userId).populate('role').exec(function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user) {
                        return done(null, false, { message: 'Unknown user' });
                    }

                    var info = { scope: '*' };
                    done(null, user, info);
                });
            })
        }
    ));
}