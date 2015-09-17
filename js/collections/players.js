define(['jquery', 'underscore','backbone', 'models/player'], function($, _, Backbone, Player) {

    // NOTE: this returns an instance, not the constructor

    var PlayerCollection = Backbone.Collection.extend({
        model: Player,
        populateFromRestResponse: function(restDataArray) {
            var players = [];
            for (var i = 0; i < restDataArray.length; i++) {
                players.push(new Player(restDataArray[i]));
            }
            this.reset(players);
        }
    });

    return new PlayerCollection();

});
