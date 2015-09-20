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
        },
        playerWithName: function(name) {
            if (name.toLowerCase() == 'anonymous') {
                return this.anonymousPlayer();
            }
            return this.findWhere({name: name});
        },
        playersIncludingAnonymousButExcluding: function (playerNameToExclude) {
            var players = _.filter(this.models, function(player) {
                return (player.get('name') != playerNameToExclude) && (player.get('name').toLowerCase() != 'anonymous');
            });
            players.splice(0,0, this.anonymousPlayer());
            return players;
        },
        anonymousPlayer: function() {
            return new Player({name: 'Anonymous'});
        }
    });

    return new PlayerCollection();

});
