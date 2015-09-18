define(['jquery', 'underscore', 'backbone', 'utility', 'views/DialogView', 'appContext', 'collections/gameVersions'], function($, _, Backbone, utility, DialogView, appContext, gameVersionCollection ) {

    var GameVersionsDialogView = DialogView.extend({
        game: null,
        versionReplaceComplete: utility.noArgsNoReturnFunction,
        template: _.template($("#ulti-game-versions-dialog-content-template").html()),
        render: function () {
            var curr = gameVersionCollection.currentVersion();
             this.$el.html(this.template({nonCurrentGameVersions: gameVersionCollection.nonCurrentVersions(), currentGameVersion: gameVersionCollection.currentVersion()}));
        },
        events: {
            "click [ulti-versions-button-replace]": "replaceTapped",
            "click [ulti-versions-button-cancel]": "cancelTapped"
        },
        replaceTapped: function() {

        },
        cancelTapped: function() {
            this.dismiss();
        }
    });

    return GameVersionsDialogView;

});