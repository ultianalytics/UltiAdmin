define(['jquery', 'underscore', 'backbone', 'utility', 'views/DialogView', 'appContext', 'collections/gameVersions', 'bootbox', 'restService'],
    function($, _, Backbone, utility, DialogView, appContext, gameVersionCollection, bootbox, restService ) {

    var GameVersionsDialogView = DialogView.extend({
        game: null,
        replaceComplete:utility.noArgsNoReturnFunction,
        selectedGameVersion: null,
        initialize: function() {
            self = this;
            self.selectedGameVersion = gameVersionCollection.nonCurrentVersions()[0];
        },
        template: _.template($("#ulti-game-versions-dialog-content-template").html()),
        render: function () {
            this.$el.html(this.template({nonCurrentGameVersions: gameVersionCollection.nonCurrentVersions(), selectedGameVersion: self.selectedGameVersion, currentGameVersion: gameVersionCollection.currentVersion()}));
            this.$("[ulti-game-version-choice]").click(function(e) {
                e.preventDefault();
                var selectedVersionKey = e.currentTarget.attributes['ulti-game-version-choice'].value;
                self.selectedGameVersion = gameVersionCollection.gameVersionWithKey(parseInt(selectedVersionKey));
                self.render();
            });
        },
        events: {
            "click [ulti-versions-button-replace]": "replaceTapped",
            "click [ulti-versions-button-cancel]": "cancelTapped"
        },
        replaceTapped: function() {
            restService.restoreGameVersion(appContext.currentTeamId(), self.game.get('gameId'), self.selectedGameVersion.get('keyIdentifier'), function() {
                bootbox.alert({
                    size: 'small',
                    title: 'Update Complete',
                    message: 'The current game version has been replaced with version <b>' + self.selectedGameVersion.fullDescription() + '</b>'
                });
                self.replaceComplete();
                self.dismiss();
            }, function() {
                alert('bad thang happened');
            });
        },
        cancelTapped: function() {
            this.dismiss();
        }
    });

    return GameVersionsDialogView;

});
