const express = require('express');
const cors = require('cors');

module.exports = function (app, config) {

    app.use(express.json({ limit: '5mb' }));

    app.use(express.urlencoded({ limit: '5mb', extended: true }));

    app.use(cors());

    app.set('port', config.port || "4800");
}