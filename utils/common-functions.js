const fs = require('fs');
const path = require('path');

module.exports = {
    getFolders
};

function getFolders(srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

