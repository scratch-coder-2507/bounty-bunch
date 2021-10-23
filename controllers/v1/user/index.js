const userController = require('./user');
module.exports = [
    {
        path: "/",
        method: "post",
        public: true,
        controller: userController.createUser
    },
    {
        path: "/create-sub-admin",
        method: "post",
        allUsers: true,
        controller: userController.createUser
    },
    {
        path: "/create-player",
        method: "post",
        public: true,
        controller: userController.createUser
    },
    {
        path: "/create-bot",
        method: "post",
        public: true,
        controller: userController.createBot
    },
    {
        path: "/",
        method: "get",
        allUsers: true,
        controller: userController.getUsers
    },
    {
        path: "/set-password",
        method: "put",
        public: true,
        controller: userController.updatePassword
    },

    {
        path: "/self",
        method: "get",
        allUsers: true,
        controller: userController.self
    },
    {
        path: "/get-sub-admin",
        method: "get",
        allUsers: true,
        controller: userController.getSubAdmin
    },
    {
        path: "/:id/get-subadmin-by-id",
        method: "get",
        allUsers: true,
        controller: userController.getSubAdminById
    },
    {
        path: "/get-user-analytics",
        method: "get",
        allUsers: true,
        controller: userController.getUserAnalytics
    },
    {
        path: "/:id/get-user-logs",
        method: "get",
        allUsers: true,
        controller: userController.getUserLogs
    },
    {
        path: '/:id/enable-disable-sub-admin',
        method: 'put',
        allUsers: true,
        controller: userController.enableDisableSubAdmin
    },
    {
        path: '/:id/edit-sub-admin',
        method: 'put',
        allUsers: true,
        controller: userController.editSubAdmin
    }

];