let tournmentController = require('./tournment');

module.exports = [
    {
        path: '/',
        method: 'post',
        public: true,
        controller: tournmentController.createTournment
    },
    {
        path: '/:id/get-tournment',
        method: 'get',
        public: true,
        controller: tournmentController.getTournmentById
    },
    {
        path: '/get-tournments',
        method: 'get',
        public: true,
        controller: tournmentController.getTournments
    },
    {
        path: '/:id/edit',
        method: 'put',
        allUsers: true,
        controller: tournmentController.editTournment
    },
    {
        path: '/:id/delete-tournment',
        method: 'delete',
        allUsers: true,
        controller: tournmentController.deleteTournment
    },
    {
        path: '/:id/enable-disable-tournment',
        method: 'put',
        allUsers: true,
        controller: tournmentController.enableDisableTournment
    },
    
]