const mongoose = require('mongoose');
const CategoryModel = mongoose.model('gameCategory');
const errors = require('errors/index');
const validationError = errors.ValidationError;
const UserModel = mongoose.model('user');

module.exports = {
    createCategory,
    getCategories,
    deleteCategories,
    enableDisableCategories,
    editGameCategory,
    getCategoriesById

};

async function createCategory(req, res, next) {
    try {
        // if (!await UserModel.isAdmin(req.user._id) || !await UserModel.isSubAdmin(req.user._id) ) {
        //     throw new validationError("can created by subadmin")
        // }
        res.data = CategoryModel.createCategory(req.body, req.user._id);
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getCategories(req, res, next) {
    try {
        let query = {};
        if (req.query.status !== 'null') {
            query.status = req.query.status;
        }
        res.data = await CategoryModel.find(query).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function deleteCategories(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("enter valid id");
        }
        res.data = await CategoryModel.remove({ _id: req.params.id }).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function enableDisableCategories(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("enter valid id");
        }
        let categoryData = await CategoryModel.findOne({ _id: req.params.id }).exec();
        categoryData.status = req.body.enable ? "Active" : "Inactive";
        categoryData.enable = req.body.enable;
        res.data = await categoryData.save();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function editGameCategory(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("Send valid Id");
        }
        let gameCategoryData = await CategoryModel.findOne({ _id: req.params.id }).exec();
        gameCategoryData.description = req.body.description;
        if (req.body.icon) {
            gameCategoryData.icon = req.body.icon;
        }
        res.data = await gameCategoryData.save();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getCategoriesById(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("Send Valid Id")
        }
        res.data = await CategoryModel.findOne({ _id: req.params.id }).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}