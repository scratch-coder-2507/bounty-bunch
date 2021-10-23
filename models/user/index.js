const mongoose = require('mongoose');
let UserSchema = require('./user-schema');
const randomstring = require('randomstring');
const crypto = require('crypto');
const moment = require('moment');

UserSchema.statics = {
    createUser,
    updatePassword,
    isAdmin,
    isSubAdmin,
    isUser,
    getUserById,
};
UserSchema.methods = {
    setPassword,
    encryptPassword,
    checkPassword
};
let UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;

async function getUserById(id) {
    return await UserModel.findOne({ _id: id }).exec();
}

async function createUser(userData) {
    let RoleModel = mongoose.model('role');
    let user = new UserModel(userData);
    let role = await RoleModel.findOne({ name: userData.userType }).exec();
    user.fullName = user.firstName + " " + user.lastName;
    user.set('role', [role._id]);
    user.phoneNumber = String(userData.phoneNumber);
    if (userData.password) {
        user.set('password', userData.password);
    } else {
        setPassword(user);
    }
    return await user.save();

}

function setPassword(user) {
    user.set('password', randomstring.generate(16));
}

function encryptPassword(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}

async function isAdmin(userId) {
    let user = await UserModel.getUserById(userId);
    if (user.role) {
        let RoleModel = mongoose.model('role');
        let role = await RoleModel.findOne({ _id: user.role }).exec();
        console.log("role:", role);
        if (role.name === 'Admin') {
            return true;
        }
    }
    return false;
}

async function isSubAdmin(userId) {
    let user = await UserModel.getUserById(userId);
    if (user.role) {
        let RoleModel = mongoose.model('role');
        let role = await RoleModel.findOne({ _id: user.role }).exec();
        if (role.name === 'Sub-Admin') {
            return true;
        }
    }
    return false;
}

async function isUser(userId) {
    let user = await UserModel.getUserById(userId);
    if (user.role.length > 0 || user.role) {
        let RoleModel = mongoose.model('role');
        let role = await RoleModel.findOne({ _id: user.role }).exec();
        if (role.name === 'User') {
            return true;
        }
    }
    return false
}

async function updatePassword(number, password) {
    let user = await UserModel.findOne({ phoneNumber: number }).exec();
    user.set("password", password);
    user.set("status", "Active");
    user.set("modified", moment().add(330, 'minutes'));
    return await user.save()
}

function checkPassword(password) {
    console.log(this.encryptPassword(password), this.hashedPassword);
    return this.encryptPassword(password) === this.hashedPassword;
};