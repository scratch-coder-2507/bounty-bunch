const mongoose = require('mongoose');
let BannerSchema = require('./banner-schema');

BannerSchema.statics = {
    createBanners
}

let BannerModel = mongoose.model('banner', BannerSchema);
module.exports = BannerModel;

async function createBanners(data, requestUser) {
    let banner = new BannerModel(data);
    banner.createdBy = requestUser;
    return await banner.save();
}