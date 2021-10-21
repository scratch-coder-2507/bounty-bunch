require('app-module-path').addPath(__dirname);

const express = require('express');
const config = require('config');
const passport = require('passport');
const events = require('events');
let eventEmitter = new events.EventEmitter();

function startApp() {
    let app = express();

    require('bootstrap/express')(app, config);

    require('bootstrap/passport')(app, passport, config);

    require('controllers/index')(app, config);

    app.listen(app.get('port'), function () {
        console.log('Server listening to port %d', app.get('port'));
    });
};

require('bootstrap/db')(config, eventEmitter);

eventEmitter.on('db-connection-established', function () {
    startApp();
});