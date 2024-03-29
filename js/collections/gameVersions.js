define(['jquery', 'underscore','backbone', 'models/gameVersion', 'appContext', 'restService'],
    function($, _, Backbone, GameVersion, appContext, restService) {

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
        gameVersionWithKey: function(versionKey) {  // key is an int
            return this.findWhere({keyIdentifier: versionKey});
        },
        refreshForGame: function(game, success, failure) {
            this.game = game;
            var collection = this;
            restService.promiseRetrieveGameVersions(appContext.currentTeamId(), game.get('gameId')).then(function(gameVersions) {
                collection.populateFromRestResponse(gameVersions);
                success();
            }, function() {
                failure();
            })
        }
    });

    return new GameVersionCollection();

});

