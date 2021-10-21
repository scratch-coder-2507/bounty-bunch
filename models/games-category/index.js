const mongoose = require('mongoose');
let categorySchema = require('./games-category-schema')


categorySchema.statics = {
    createCategory
}

let GameCategoryModel = mongoose.model('gameCategory', categorySchema);

module.exports = GameCategoryModel;

async function createCategory(categoryData, requestUser) {
    console.log("here", categoryData);
    let category = new GameCategoryModel(categoryData);
    category.createdBy = requestUser;
    return await category.save();
}
