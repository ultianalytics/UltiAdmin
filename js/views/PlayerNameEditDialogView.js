define(['jquery', 'underscore', 'backbone', 'utility', 'views/DialogView', 'appContext', 'collections/players', 'bootbox', 'restService'],
    function($, _, Backbone, utility, DialogView, appContext, playerCollection, bootbox, restService ) {

    var PlayerNameEditDialogView = DialogView.extend({
        initialize: function(options) {
            self = this;
            _.extend(this, _.pick(options, 'player'));  // copies constructor attributes to this
        },
        template: _.template($("#ulti-players-edit-names-dialog-content-template").html()),
        render: function () {
            self.$el.html(this.template({player: self.player}));
        },
        events: {
            "click [ulti-players-button-save]": "saveTapped",
            "click [ulti-players-button-cancel]": "cancelTapped"
        },
        saveTapped: function() {
            alert('save tapped');
        },
        cancelTapped: function() {
            this.dismiss();
        }
    });

    return PlayerNameEditDialogView;

});
