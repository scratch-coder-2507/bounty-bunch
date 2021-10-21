var _ = require('lodash');

module.exports = {
    parse: function preRequest(req, res, next) {
        var filterObj = _.cloneDeep(req.query) || {};
        var searchQuery = {};
        var sortBy = {};
        var limit = 20;
        var skip = 0;
        if (!_.isEmpty(filterObj)) {
            if (filterObj.page) {
                filterObj.page = 0;
            }
            var page = Math.max(0, filterObj.page);
            delete filterObj.page;
            var delimiter = "_";

            // limit checking integer & greater than zero
            if (filterObj.limit && parseInt(filterObj.limit) !== NaN && parseInt(filterObj.limit) > 0) {
                limit = parseInt(filterObj.limit);
                if (filterObj.limit > 50) {
                    limit = 50;
                }
            }
            delete filterObj.limit;

            // skip checking integer & greater than zero
            skip = limit * page;

            delete filterObj.skip;

            // sort 
            if (filterObj.sort && typeof filterObj.sort == "string") {
                if (filterObj.sortDir && _.indexOf(["-1", "1"], filterObj.sortDir) !== -1) {
                    sortBy[filterObj.sort] = parseInt(filterObj.sortDir);
                }
                else {
                    sortBy[filterObj.sort] = 1;
                }
            } else {
                sortBy["_id"] = -1;
            }
            delete filterObj.sort;
            delete filterObj.sortDir;
            // remaining fields except sort, skip, limit
            var keys;
            function getValue(filterObj, filter, key, value) {
                var values = value;
                if (filter == 'in' || filter == 'nin') {
                    values = value.split(',');
                    if (filterObj[key + delimiter + "date"]) {
                        values = value.map(function (val) {
                            new Date(val).toISOString();
                        });
                    } else {
                        values = value.split(',');
                    }
                } else {
                    if (filterObj[key + delimiter + "date"]) {
                        if (!isNaN(Date.parse(value))) {
                            values = new Date(value).toISOString();
                        }
                    } else {
                        values = value;
                    }
                }
                return values;
            }
            _.forEach(filterObj, function (value, key) {
                if (value && typeof value == "string") {
                    if (key && key.indexOf(delimiter) !== -1) {
                        keys = key.split(delimiter);
                        var value1 = getValue(filterObj, keys[1], keys[0], value);
                        if (keys[1] == "min" && parseInt(value) !== NaN) {
                            if (searchQuery[keys[0]]) {
                                searchQuery[keys[0]]["$gte"] = parseInt(value1);
                            } else {
                                searchQuery[keys[0]] = { $gte: parseInt(value1) };
                            }
                        } else if (keys[1] == "max" && parseInt(value) !== NaN) {
                            if (searchQuery[keys[0]]) {
                                searchQuery[keys[0]]["$lte"] = parseInt(value1);
                            } else {
                                searchQuery[keys[0]] = { $lte: parseInt(value1) };
                            }
                        } else if (keys[1] == "neq" && parseInt(value) !== NaN) {
                            searchQuery[keys[0]] = { $ne: value };
                        } else if (keys[1] == "like" && typeof value === "string") {
                            searchQuery[keys[0]] = new RegExp(value, 'i');
                        } else if (keys[1] == "in") {
                            searchQuery[keys[0]] = { $in: value1 };
                        } else if (keys[1] == "exists") {
                            searchQuery[keys[0]] = (value === "true") ? { $ne: null } : { $eq: null };
                        }
                        else if (keys[1] == "nin") {
                            searchQuery[keys[0]] = { $nin: value1 };
                        }
                    } else if (value && typeof value == "string") {
                        searchQuery[key] = value;
                    }
                }
            });
        }
        req.limit = limit;
        if (!req.query.skip) {
            req.skip = skip;
        } else {
            req.skip = parseInt(req.query.skip);
        }
        req.sortBy = sortBy;
        req.searchQuery = searchQuery;
        req.filters = {
            limit: req.limit,
            skip: req.skip,
            sortBy: req.sortBy,
            searchQuery: req.searchQuery
        };

        try {
            if ((req.method == "POST" || req.method == "PUT") && req.body) {
                var level = depthOf(req.body);
                for (var i = 0; i <= level; i++) {
                    delete_null_properties(req.body);
                    delete_Empty_Objects(req.body);
                }
            }
        } catch (e) {
            //continue without parsing
        }
        next();
    }
};