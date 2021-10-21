const mongoose = require('mongoose');
let GameSchema = require('./games-schema');


GameSchema.statics = {
    createGame,
    gameResults
}

let GameModel = mongoose.model('game', GameSchema);

module.exports = GameModel;

async function createGame(gameData, requestUser) {
    let game = new GameModel(gameData);
    game.createdBy = requestUser;
    return await game.save();
}

async function gameResults(gameId,gameResults){
    let gameData = await GameModel.findOne({_id: gameId}).exec();
    if(!gameData){
        console.log("gameData not found");
    }
    gameData.results = gameResults;
    return gameData.save();
}
