'use strict';
const config = require('config');
const oauth = require('./oauth')(config);
const auth = require('./auth');
module.exports = [
    {
        path: '/token',
        name: 'Login',
        method: 'post',
        public: true,
        controller: oauth
    },
    {
        path: '/logout',
        method: 'get',
        allUsers: true,
        controller: auth.logout
    }
];