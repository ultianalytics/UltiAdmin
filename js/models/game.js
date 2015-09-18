define(['jquery', 'underscore','backbone'], function($, _, Backbone) {

    var Game = Backbone.Model.extend({
        defaults: {
            "gameId":"",
            "opponentName":"",
            "timestamp":"",
            "date":"",
            "time":"",
            "ours":18,
            "theirs":13,
            "previousVersionAvailable":false,
            "deleted":false
        }    });

    return Game;

});