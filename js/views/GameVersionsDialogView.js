define(['jquery', 'underscore', 'backbone', 'utility', 'views/DialogView', 'appContext'], function($, _, Backbone, utility, DialogView, appContext) {

    var GameVersionsDialogView = DialogView.extend({
        game: null,
        versionReplaceComplete: utility.noArgsNoReturnFunction,
        template: _.template($("#ulti-game-versions-dialog-content-template").html()),
        render: function () {
            this.$el.html(this.template());
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