const mongoose = require('mongoose');

function loadModels() {
    require('models/auth/access-token');
    require('models/auth/client');
    require('models/auth/role');
    require('models/auth/refresh-token');
    require('models/user');
    require('models/request-log');
    require('models/games');
    require('models/games-category');
    require('models/tournment');
    require('models/banners');
}

module.exports = function (config, eventEmitter) {

    loadModels();

    function connect() {
        mongoose.connect(config.mongoose.uri, config.mongoose.options);
    }

    connect();

    mongoose.connection.on('disconnected', connect);
    mongoose.connection.on('error', console.error.bind(console, 'connection error:', config.mongoose.uri));

    mongoose.connection.once('open', function dbConnectionOpenCallBack() {
        console.log('db connected-->', config.mongoose.uri);
        eventEmitter.emit('db-connection-established');
    })
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

    return mongoose;
}