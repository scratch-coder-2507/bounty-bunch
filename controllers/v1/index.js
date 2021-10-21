var _ = require('lodash');
var commonFunction = require('utils/common-functions');
var dirs = commonFunction.getFolders(__dirname);
var routes = [];

_(dirs).forEach(function forEachDir(dir) {
    var dirRoutes = require('./' + dir);
    if (_.isFunction(dirRoutes)) {
        dirRoutes = dirRoutes.call();
    }
    _.map(dirRoutes, function forEachRoute(route) {
        route.path = '/' + dir + route.path;
    });
    routes = _.concat(routes, dirRoutes);
});

module.exports = routes;
