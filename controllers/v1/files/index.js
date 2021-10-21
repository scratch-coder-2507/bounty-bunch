var FilesController = require("./files");

module.exports = [
    {
        path: "",
        name: "by attachment",
        method: "post",
        // allUsers: true,
        public: true,
        controller: FilesController.uploadFileFromLocal
    }
];
