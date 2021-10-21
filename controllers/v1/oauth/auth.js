
const AccessToken = require('models/auth/access-token');
const RefreshToken = require('models/auth/refresh-token');
const mongoose = require('mongoose');
const userLogModel = require('models/user/user-log-schema');
const moment = require('moment');

module.exports = {
    logout: async function (req, res, next) {
        const authorization = req.get('authorization');
        const accessToken = authorization.split(" ")[1];
        let userLogs = await userLogModel.findOne({ userId: req.user._id }).exec();
        let token = await AccessToken.findOne({
            token: accessToken
        }).exec(function (err, token) {
            if (err) {
                return next(err);
            }
        });
        if (!token) {
            // userLogs.lastLoginDate = userLogs.logIn;
            userLogs.logOut = moment();
            await userLogs.save();
            res.data = {
                message: "OK"
            };
            return next();
        }
        let model = {
            token: accessToken,
            clientId: token.clientId
        };
        RefreshToken.remove(model, function (err) { });
        AccessToken.remove(model, function (err) { });
        // userLogs.lastLoginDate = userLogs.logIn;
        userLogs.logOut = moment();
        await userLogs.save();
        res.data = {
            message: "OK"
        };
        return next();
    },
}