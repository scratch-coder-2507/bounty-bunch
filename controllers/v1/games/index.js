let gameController = require('./games');

module.exports = [
    {
        path: '/',
        method: 'post',
        allUsers: true,
        controller: gameController.createGame
    },
    {
        path: '/get-games',
        method: 'get',
        public: true,
        controller: gameController.getGames
    },
    {
        path: '/get-games-id-name',
        method: 'get',
        public: true,
        controller: gameController.getGamesIdName
    },
    {
        path: '/:id/get-game',
        method: 'get',
        public: true,
        controller: gameController.getGameById
    },
    {
        path: '/:id/get-game-by-category',
        method: 'get',
        public: true,
        controller: gameController.getGamesByCategory
    },
    {
        path: '/get-singleplayer-games',
        method: 'get',
        public: true,
        controller: gameController.getSinglePlayerGames
    },
    {
        path: '/get-multiplayer-games',
        method: 'get',
        public: true,
        controller: gameController.getMultiPlayerGames
    },
    {
        path: '/:id/send-game-results',
        method: "put",
        public: true,
        controller: gameController.gameResults
    },
    {
        path: '/:id/delete-game',
        method: 'delete',
        allUsers: true,
        controller: gameController.deleteGame
    },
    {
        path: '/:id/enable-disable-game',
        method: 'put',
        allUsers: true,
        controller: gameController.enableDisableGames
    },
    {
        path: '/:id/edit-game',
        method: 'put',
        allUsers: true,
        controller: gameController.editGame
    }
]