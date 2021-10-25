let mongoose = require('mongoose');
let UserModel = mongoose.model('user');
let BotsModel = require('../../../models/bots/bots')
let errors = require('errors/index');
let validationError = errors.ValidationError;
const userLogModel = mongoose.model('user_logs');
const moment = require('moment');
const randomstring = require('randomstring');
const TournmentModel = require('../../../models/tournment');
module.exports = {
    createUser,
    getUsers,
    updatePassword,
    self,
    getSubAdmin,
    getUserAnalytics,
    getUserLogs,
    enableDisableSubAdmin,
    getSubAdminById,
    editSubAdmin,
    createBot
};

async function createUser(req, res, next) {
    try {
        if (req.body.subAdmin) {
            if (!await UserModel.isAdmin(req.user._id)) {
                throw new validationError('Admin can only create the states');
            }
        }
        res.data = await UserModel.createUser(req.body);
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function createBot (req, res, next) { 
    try {
        //const tournament = await TournmentModel.findOne({_id: req.body.id});
        //let totalBots = tournament.totalBots;
        //let username = Math.floor(Math.random() * 300000000);
        let gender = ['Male', 'Female'];
        let botType = ['MustWin', 'FairPlay'];


        for(i=0; i<20; i++) {
            let username = randomstring.generate();
            console.log(username)
            const bots = new BotsModel({
                userName: `bb${username}`,
                isBot: true,
                botType: botType[Math.floor(Math.random() * botType.length)],
                botAvailability: 'Available',
                gender: gender[Math.floor(Math.random() * gender.length)],
            });
            await bots.save();
            console.log(bots)
            res.json({
                message: 'bots created',
                data: bots
            });
        

    //     let data = [{
    //         userName: `bb${username}`,
    //         isBot: true,
    //         botType: botType[Math.floor(Math.random() * botType.length)],
    //         botAvailability: 'Available',
    //         gender: gender[Math.floor(Math.random() * gender.length)],
    //     }];

    //     let botsArr = [];

    //     data.forEach(datanum => {
    //         botsArr.push({
    //         userName: `bb${username}`,
    //         isBot: datanum.true,
    //         botType: datanum.botType[Math.floor(Math.random() * botType.length)],
    //         botAvailability: 'Available',
    //         gender: datanum.gender[Math.floor(Math.random() * gender.length)],
    //         })
    //     });

    //     await BotsModel.insertMany(botsArr, ans => {
    //         console.log(ans);
    //     });
    }
        
            
        
    } catch (err) {
        errors.handleException(err, next);
    }
}

async function getUsers(req, res, next) {
    try {
        let role = await mongoose.model('role').findOne({ name: 'Admin' }).exec();
        res.data = await UserModel.find({ role: { $nin: [role._id] } }).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function updatePassword(req, res, next) {
    try {
        if (!req.body.phoneNumber) {
            throw new validationError("Phone Number required");
        }
        if (!req.body.password) {
            throw new validationError("Enter the password");
        }
        res.data = await UserModel.updatePassword(req.body.phoneNumber, req.body.password);
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function self(req, res, next) {
    let user = req.user.toObject();
    let userLogs = await userLogModel.findOne({ userId: req.user._id }).exec();
    if (await UserModel.isAdmin(req.user._id)) {
        console.log("admin:")
        user.isAdmin = true;
    }
    if (await UserModel.isSubAdmin(req.user._id)) {
        console.log("sub-admin:")
        user.isSubAdmin = true;
    }
    if (await UserModel.isUser(req.user._id)) {
        console.log("user:")
        user.isUser = true;
    }
    if (!userLogs) {
        userLogs = new userLogModel({
            userId: req.user._id,
            lastLoginDate: moment(),
            logIn: moment()
        });
        await userLogs.save();
    } else {
        userLogs.logIn = moment();
        await userLogs.save();
    }
    res.data = user;
    next();
}

async function getSubAdmin(req, res, next) {
    try {
        if (!req.query.userType) {
            throw new validationError('Enter Valid userType');
        }

        if (req.query.userType !== 'Bot') {
            console.log(req.user._id);
            if (!await UserModel.isAdmin(req.user._id)) {
                throw new validationError('Admin can only get sub-admin details');
            }
        }
        let role = await mongoose.model('role').findOne({ name: req.query.userType }).exec();
        let query = { role: role._id };
        console.log(req.query.status);
        if (req.query.status !== 'null') {
            query.status = req.query.status;
        }
        console.log("query:", query);
        res.data = await UserModel.find(query).populate('moduleAccess').exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getSubAdminById(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError('Enter Valid id');
        }
        let role = await mongoose.model('role').findOne({ name: 'Sub-Admin' }).exec();
        res.data = await UserModel.findOne({ _id: req.params.id, role: role._id }).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}


async function getUserAnalytics(req, res, next) {
    try {
        if (!await UserModel.isAdmin(req.user._id)) {
            throw new validationError('Admin can only get sub-admin details');
        }
        let role = await mongoose.model('role').findOne({ name: 'Admin' }).exec();
        let data = await UserModel.aggregate([
            {
                "$match": {
                    role: { $nin: [role._id] }
                }
            },
            {
                "$group": {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);
        console.log("data:", data);
        res.data = data;
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getUserLogs(req, res, next) {
    try {
        res.data = await userLogModel.find({ userId: req.params.id }).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}


async function enableDisableSubAdmin(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("enter valid id");
        }
        let userData = await UserModel.findOne({ _id: req.params.id }).exec();
        userData.status = req.body.enable ? "Active" : "Inactive";
        userData.enable = req.body.enable;
        console.log("userDt:", userData);
        res.data = await userData.save();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function editSubAdmin(req, res, next) {
    try {
        if(!req.params.id){
            throw new validationError("enter valid id")
        }
        let userData = await UserModel.findOne({ _id: req.params.id }).exec();
        userData.firstName = req.body.firstName;
        userData.lastName = req.body.lastName;
        userData.fullName = userData.firstName + " " + userData.lastName;
        if(req.body.password){
            await UserModel.updatePassword(req.body.phoneNumber, req.body.password);
        }
        userData.address = req.body.address;
        userData.moduleAccess = req.body.moduleAccess;
        res.data = await userData.save();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}