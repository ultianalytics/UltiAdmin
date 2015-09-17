define(['jquery', 'underscore', 'backbone', 'collections/players', 'views/AbstractDetailContentsView', 'appContext'],
    function($, _, Backbone, playerCollection, AbstractDetailContentsView, appContext) {

    var PlayersView = AbstractDetailContentsView.extend({
        el: '[ulti-team-detail-players]',
        initialize: function() {
            playerCollection.on("reset", this.render, this);
        },
        events: {
            "click [ulti-player-list-button-editname]": "editTapped",
            "click [ulti-player-list-button-merge]": "mergeTapped",
            "click [ulti-player-list-button-delete]": "deleteTapped"
        },
        template: _.template($("#ulti-team-players-template").html()),
        render: function () {
            var players = _.map(playerCollection.models, function(player) {
                return player.toJSON();
            });
            this.$el.html(this.template({players: players}));
        },
        editTapped: function() {
            alert('edit tapped');
        },
        mergeTapped: function() {
            alert('merge tapped');
        },
        deleteTapped: function() {
            alert('delete tapped');
            var router = require("router");
            router.navigate("", true);
        }
    });

    return PlayersView;

});