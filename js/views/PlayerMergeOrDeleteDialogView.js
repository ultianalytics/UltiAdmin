define(['jquery', 'underscore', 'backbone', 'utility', 'views/DialogView', 'appContext', 'collections/players', 'bootbox'], function($, _, Backbone, utility, DialogView, appContext, playerCollection, bootbox ) {

    var PlayerMergeOrDeleteDialogView = DialogView.extend({
        actionComplete:utility.noArgsNoReturnFunction,
        selectedPlayer: null,
        otherPlayers: null,
        player: function() {
            return self.get('player');
        },
        initialize: function(options) {
            self = this;
            _.extend(this, _.pick(options, 'player'));  // copies constructor attributes to this
            self.otherPlayers = _.filter(playerCollection.models, function(otherPlayer) {
                return otherPlayer.get('name') != self.player.get('name')
            });
            self.selectedPlayer = self.otherPlayers[0];
        },
        template: _.template($("#ulti-players-merge-delete-dialog-content-template").html()),
        render: function () {
            self.$el.html(this.template({otherPlayers: self.otherPlayers, selectedPlayer: self.selectedPlayer, player: self.player}));
            self.$("[ulti-player-choice]").click(function(e) {
                e.preventDefault();
                var selectedPlayerName = e.currentTarget.attributes['ulti-player-choice'].value;
                self.selectedPlayer = playerCollection.playerWithName(selectedPlayerName);
                self.render();
            });
        },
        events: {
            "click [ulti-players-button-action]": "actionTapped",
            "click [ulti-players-button-cancel]": "cancelTapped"
        },
        actionTapped: function() {
            deletePlayer(appContext.currentTeamId(), self.player.get('name'), self.selectedPlayer.get('name'), function() {
                bootbox.alert({
                    size: 'small',
                    title: 'Merge Complete',
                    message: 'Player <b>' + self.player.get('name') + '</b> deleted.  Associated data moved to player <b>' + self.selectedPlayer.get('name') +
                        '</b>. If you still have games on your mobile device with player <b>' + self.player.get('name') + '</b> you should now download those games to your device (otherwise <b>' +
                    self.player.get('name') + '</b> will re-appear when you next upload those games).'
                });
                self.actionComplete();
                self.dismiss();
            }, function() {
                alert('bad thang happened');
            });
        },
        cancelTapped: function() {
            this.dismiss();
        },

    });

    return PlayerMergeOrDeleteDialogView;

});
