const mongoose = require('mongoose');
const BannerModel = mongoose.model('banner');
const errors = require('errors/index');
const validationError = errors.ValidationError;

module.exports = {
    createBanners,
    getBanners
};

async function createBanners(req, res, next) {
    try {
        res.data = await BannerModel.createBanners(req.body, req.user._id);
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getBanners(req, res, next) {
    try {
        res.data = await BannerModel.find({}).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

