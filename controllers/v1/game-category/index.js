let categoryController = require('./category');

module.exports = [
    {
        path: '/',
        method: 'post',
        allUsers: true,
        controller: categoryController.createCategory
    },
    {
        path: '/get-game-categories',
        method: 'get',
        public: true,
        controller: categoryController.getCategories
    },
    {
        path: '/:id/get-game-category-byId',
        method: 'get',
        allUsers: true,
        controller: categoryController.getCategoriesById
    },
    {
        path: '/:id/delete-category',
        method: 'delete',
        allUsers: true,
        controller: categoryController.deleteCategories
    },
    {
        path: '/:id/enable-disable-category',
        method: 'put',
        allUsers: true,
        controller: categoryController.enableDisableCategories
    },
    {
        path: '/:id/edit-game-category',
        method: 'put',
        allUsers: true,
        controller: categoryController.editGameCategory
    }
]