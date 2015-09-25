define(['jquery', 'underscore', 'backbone', 'collections/players', 'views/AbstractDetailContentsView', 'views/PlayerMergeOrDeleteDialogView', 'appContext', 'restService'],
    function($, _, Backbone, playerCollection, AbstractDetailContentsView, PlayerMergeOrDeleteDialogView, appContext, restService) {

    var PlayersView = AbstractDetailContentsView.extend({
        el: '[ulti-team-detail-players]',
        initialize: function() {
            self = this;
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
        refresh: function() {
            restService.retrieveTeamForAdmin(appContext.currentTeamId(), true, true, function(team) {
                playerCollection.populateFromRestResponse(team.players);
                self.render();
            }, function() {
                alert("bad thang happened");
            })
        },
        editTapped: function() {
            alert('edit tapped');
        },
        mergeTapped: function(e) {
            var player = this.playerForButton(e.currentTarget);
            this.showMergeDialog(player);
        },
        deleteTapped: function(e) {
            var player = this.playerForButton(e.currentTarget);
            this.showDeleteDialog(player);
        },
        playerForButton: function(button) {
            var playerName = $(button).attr('ulti-player-nickname');
            return playerCollection.playerWithName(playerName);
        },
        showMergeDialog: function (player) {
            view = this;
            this.showModalDialog('Merge Player', function() {
                var dialog = new PlayerMergeOrDeleteDialogView({player: player, isDeleteMode: false});
                dialog.actionComplete = function() {
                    view.refresh();
                };
                return dialog;
            });
        },
        showDeleteDialog: function (player) {
            view = this;
            this.showModalDialog('Delete Player', function() {
                var dialog = new PlayerMergeOrDeleteDialogView({player: player, isDeleteMode: true});
                dialog.actionComplete = function() {
                    view.refresh();
                };
                return dialog;
            });
        }
    });

    return PlayersView;

});