define(['jquery', 'underscore', 'backbone', 'utility', 'views/DialogView', 'appContext'],
    function($, _, Backbone, utility, DialogView, appContext) {

    var PasswordDialogView = DialogView.extend({
        passwordChanged: utility.noArgsNoReturnFunction,
        template: _.template($("#ulti-team-password-dialog-content-template").html()),
        render: function () {
            this.$el.html(this.template({team : appContext.currentTeam()}));
            this.updateSaveButtonEnablement();
        },
        events: {
            "click [ulti-password-button-save]": "savePasswordTapped",
            "click [ulti-password-button-remove]": "removePasswordTapped",
            "click [ulti-password-button-cancel]": "cancelPasswordTapped",
            "input [ulti-password-text]": "updateSaveButtonEnablement"
        },
        savePasswordTapped: function() {
            this.updatePassword(this.getPassword());
        },
        removePasswordTapped: function() {
            this.updatePassword("");
        },
        cancelPasswordTapped: function() {
            this.dismiss();
        },
        updateSaveButtonEnablement: function() {
            var isValidPassword = this.getPassword().length > 0;
            this.$('[ulti-password-button-save]').prop('disabled', !isValidPassword);
        },
        getPassword: function() {
            return $.trim($('[ulti-password-text]').val());
        },
        updatePassword: function(password) {
            var view = this;
            savePassword(appContext.currentTeamId(), password, function() {
                if (view.passwordChanged) {
                    view.passwordChanged();
                }
                view.dismiss();
            }, function() {
                alert("bad thang happened");
            });
        }
    });

    return PasswordDialogView;
});