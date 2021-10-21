const mongoose = require('mongoose');
const TournmentModel = mongoose.model('tournment');
const errors = require('errors/index');
const validationError = errors.ValidationError;
const UserModel = mongoose.model('user');

module.exports = {
    createTournment,
    getTournments,
    getTournmentById,
    deleteTournment,
    editTournment,
    enableDisableTournment,
    createBots
};

async function createTournment(req, res, next) {
    try {
        // if (!await UserModel.isSubAdmin(req.user._id)) {
        //     throw validationError("can created by subadmin")
        // }
        console.log("here:", req.body);
        res.data = TournmentModel.createTournment(req.body);
        console.log(res.data)
        //res.data = TournmentModel.createTournment(req.body, req.user._id);
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function createBots(req, res, next) {
    try {
        console.log("bots", req.body)
        
        res.data = TournmentModel.createBots(req.body, req.user._id);
        next();
    } catch (err) {
        errors.handleException(err, next);
    }
}

async function getTournments(req, res, next) {
    try {
        let query = {};
        if (req.query.status !== 'null') {
            query.Status = req.query.status;
        }
        res.data = await TournmentModel.find(query).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getTournmentById(req, res, next) {
    try {
        let query = { gameId: req.params.id };
        if (req.query.status !== 'null') {
            query.status = req.query.status;
        }
        res.data = await TournmentModel.find(query).populate('gameId').exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function deleteTournment(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("enter valid id");
        }
        res.data = await TournmentModel.remove({ _id: req.params.id }).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}
async function editTournment(req, res, next) {
    try {
        if (!req.parmas.id) {
            throw new ValidationError("enter valid tournment id");
        }
        let tournment = await TournmentModel.findOne({ _id: req.params.id }).exec();
        res.data = await tournment.save();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function enableDisableTournment(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("enter valid id");
        }
        let tournmentData = await TournmentModel.findOne({ _id: req.params.id }).exec();
        tournmentData.status = req.body.enable ? "Active" : "Inactive";
        tournmentData.enable = req.body.enable;
        res.data = await tournmentData.save();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}