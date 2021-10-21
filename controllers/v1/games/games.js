const mongoose = require('mongoose');
const GameModel = mongoose.model('game');
const errors = require('errors/index');
const validationError = errors.ValidationError;
const UserModel = mongoose.model('user');

module.exports = {
    createGame,
    getGames,
    getGameById,
    gameResults,
    deleteGame,
    getSinglePlayerGames,
    getMultiPlayerGames,
    getGamesIdName,
    getGamesByCategory,
    enableDisableGames,
    editGame
};

async function createGame(req, res, next) {
    try {
        // if (!await UserModel.isSubAdmin(req.user._id)) {
        //     throw new validationError("Can be Created By Sub Admin");
        // }
        console.log(req.user._id);
        res.data = await GameModel.createGame(req.body, req.user._id);
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getGames(req, res, next) {
    try {
        let query = {};
        if (req.query.status !== 'null') {
            query.gameStatus = req.query.status;
        }
        res.data = await GameModel.find(query).populate('gameCategory').lean().exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}
async function getGamesIdName(req, res, next) {
    try {
        res.data = await GameModel.find({}).select('_id gameName').lean().exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}
async function getSinglePlayerGames(req, res, next) {
    try {
        res.data = await GameModel.find({ gameType: 'SinglePlayer' }).populate('gameCategory').lean().exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}
async function getMultiPlayerGames(req, res, next) {
    try {
        res.data = await GameModel.find({ gameType: 'MultiPlayer' }).populate('gameCategory').lean().exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getGameById(req, res, next) {
    try {
        res.data = await GameModel.findOne({ _id: req.params.id }).populate('gameCategory').lean().exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function gameResults(req, res, next) {
    try {
        res.data = await GameModel.gameResults(req.params.id, req.body);
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function deleteGame(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("enter valid id");
        }
        res.data = await GameModel.remove({ _id: req.params.id }).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getGamesByCategory(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("enter valid categoryId");
        }
        res.data = await GameModel.find({ gameCategory: req.params.id }).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function enableDisableGames(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("enter valid id");
        }
        let gameData = await GameModel.findOne({ _id: req.params.id }).exec();
        gameData.gameStatus = req.body.enable ? "Active" : "Inactive";
        gameData.enable = req.body.enable;
        res.data = await gameData.save();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function editGame(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("Send valid Id");
        }
        let gameData = await GameModel.findOne({ _id: req.params.id }).exec();
        gameData.description = req.body.description;
        gameData.bundleIdentifier = req.body.bundleIdentifier;
        gameData.type = req.body.type;
        gameData.gameType = req.body.gameType;
        if(req.body.icon){
            gameData.icon = req.body.icon;
        }
        res.data = await gameData.save();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}