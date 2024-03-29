define(['jquery', 'underscore', 'backbone', 'collections/players', 'views/AbstractDetailContentsView', 'views/PlayerMergeOrDeleteDialogView', 'views/PlayerNameEditDialogView', 'appContext', 'restService', 'text!templates/playerList.html', 'text!templates/playerListEmpty.html'],
    function($, _, Backbone, playerCollection, AbstractDetailContentsView, PlayerMergeOrDeleteDialogView, PlayerNameEditDialogView, appContext, restService, playerListHtml, playerListEmptyHtml) {

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
        template: _.template(playerListHtml),
        noPlayersTemplate: _.template(playerListEmptyHtml),
        render: function () {
            if (playerCollection.isEmpty()) {
                this.$el.html(this.noPlayersTemplate());
            } else {
                var players = _.map(playerCollection.models, function(player) {
                    return player.toJSON();
                });
                this.$el.html(this.template({players: players}));
            }
        },
        refresh: function() {
            var view = this;
            restService.promiseRetrieveTeamForAdmin(appContext.currentTeamId(), true, true).then(function(team) {
                playerCollection.populateFromRestResponse(team.players);
                self.render();
            }, function() {
                view.showServerErrorDialog();
            });
        },
        editTapped: function(e) {
            var player = this.playerForButton(e.currentTarget);
            this.showEditNameDialog(player);
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
        },
        showEditNameDialog: function (player) {
            view = this;
            this.showModalDialog('Edit Player Names', function() {
                var dialog = new PlayerNameEditDialogView({player: player});
                dialog.actionComplete = function() {
                    view.refresh();
                };
                return dialog;
            });
        }
    });

    return PlayersView;

});