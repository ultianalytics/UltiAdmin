define(['jquery', 'underscore','backbone', 'models/game'], function($, _, Backbone, Game) {

    // NOTE: this returns an instance, not the constructor

    var GameCollection = Backbone.Collection.extend({
        model: Game,
        populateFromRestResponse: function(restDataArray) {
            var games = [];
            for (var i = 0; i < restDataArray.length; i++) {
                games.push(new Game(restDataArray[i]));
            }
            this.reset(games);
        },
        gameWithGameId: function(gameId) {
            return this.findWhere({gameId : gameId});
        },
    });

    return new GameCollection();

});
