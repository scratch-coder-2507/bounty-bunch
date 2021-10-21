var _ = require('lodash');
var formidable = require('formidable');
var async = require('async');
var aws = require('utils/aws-storage');
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');

module.exports = {
    uploadFileFromLocal
};

// function uploadFileFromLocal(req, res, next) {
//     var retObj = {};
//     var form = new formidable.IncomingForm();
//     form.keepExtensions = true;
//     console.log("files:", form);
//     form.parse(req, function (err, fields, files) {
//         console.log("f:", files);
//         if (!_.isEmpty(files)) {
//             async.map(files, aws.awsStorageCreate, function (err, results) {
//                 var index = 0;
//                 var filesUploaded = {};
//                 _.forEach(files, function (value, key) {
//                     filesUploaded[key] = results[index++];
//                 });
//                 if (err) {
//                     return next(err);
//                 } else {
//                     res.data = filesUploaded;
//                     next();
//                 }
//             });
//         } else {
//             retObj.status = "error";
//             retObj.messaage = "No file sent to upload";
//             res.status(412);
//             res.send(retObj);
//         }
//     })
// }

function uploadFileFromLocal(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (error, fields, files) {
        let fileId = uuid.v4();
        let filename = `${fileId}`;
        let file = files.selfie;
        console.log("files:", files);
        // let oldPath = files.files.path;
        // let newPath = path.join(__dirname, 'uploads'+'/'+files.files.name);
        // let rawData = fs.readFileSync(oldPath);
        // if (!/^image\/(jpe?g|png)$/i.test(files.type)) {
        //     deleteFile(files.path);
        //     res.write('{"status": 403, "message": "Expects Image File. Please try again."}');
        //     return res.end();
        // }
        let data = aws.awsStorageCreate(files.files, filename);
        // fs.writeFile(newPath, rawData, function(err){
        //     if(err) console.log(err);

        // })
        console.log(data);
        res.data = data;
        next();
    })
}

// function deleteFile(filePath) {
//     fs.unlink(filePath, function (err) {
//         if (err) {
//             console.error(err);
//         }
//         console.log('Temp File Delete');
//     });
// }