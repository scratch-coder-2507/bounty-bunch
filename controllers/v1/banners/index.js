const bannerController = require('./banners');

module.exports = [
    {
        path: '/',
        method: 'post',
        allUsers: true,
        controller: bannerController.createBanners
    }
]