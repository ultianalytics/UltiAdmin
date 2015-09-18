define(['jquery', 'underscore','backbone', 'models/gameVersion', 'appContext'], function($, _, Backbone, GameVersion, appContext) {

    // NOTE: this returns an instance, not the constructor

    var GameVersionCollection = Backbone.Collection.extend({
        game: null,
        model: GameVersion,
        populateFromRestResponse: function(restDataArray) {
            var gameVersions = [];
            for (var i = 0; i < restDataArray.length; i++) {
                gameVersions.push(new GameVersion(restDataArray[i]));
            }
            this.reset(gameVersions);
        },
        currentVersion: function() {
            return this.findWhere({currentVersion: true});
        },
        nonCurrentVersions: function() {
            return this.where({currentVersion: false});
        },
        hasMultipleVersions: function() {
            return this.nonCurrentVersions().length > 0;
        },
        refreshForGame: function(game, success, failure) {
            this.game = game;
            var collection = this;
            retrieveGameVersions(appContext.currentTeamId(), game.get('gameId'), function(gameVersions) {
                collection.populateFromRestResponse(gameVersions);
                success();
            }, function() {
                failure();
            })
        }
    });

    return new GameVersionCollection();

});

