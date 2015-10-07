define(['jquery', 'underscore', 'backbone', 'utility', 'views/DialogView', 'appContext', 'collections/players', 'bootbox', 'restService', 'text!templates/playerEditNamesDialogContent.html'],
    function($, _, Backbone, utility, DialogView, appContext, playerCollection, bootbox, restService, playerEditNamesDialogContentHtml ) {

    var PlayerNameEditDialogView = DialogView.extend({
        actionComplete:utility.noArgsNoReturnFunction,
        player: null,
        initialize: function(options) {
            self = this;
            _.extend(this, _.pick(options, 'player'));  // copies constructor attributes to this
        },
        template: _.template(playerEditNamesDialogContentHtml),
        render: function () {
            self.$el.html(this.template({player: self.player}));
        },
        events: {
            "click [ulti-players-button-save]": "saveTapped",
            "click [ulti-players-button-cancel]": "cancelTapped"
        },
        saveTapped: function() {
            this.clearErrorMessages();

            var oldNickName = this.trimString(this.player.get('name'));
            var oldFirstName = this.trimString(this.player.get('firstName'));
            var oldLastName = this.trimString(this.player.get('lastName'));

            var newNickName = this.trimString(this.$('[ulti-player-nickname]').val());
            var newFirstName = this.trimString(this.$('[ulti-player-first-name]').val());
            var newLastName = this.trimString(this.$('[ulti-player-last-name]').val());

            if (newNickName == '') {
                this.showError(this.$('[ulti-player-nickname-error]'), '<b>Invalid Nickname:</b> name cannot be blank');
            } else if (newNickName.toLowerCase() == 'anonymous' || newNickName.toLowerCase() == 'anon' || newNickName.toLowerCase() == 'unknown' ) {
                this.showError(this.$('[ulti-player-nickname-error]'), '<b>Invalid Nickname:</b> cannot rename to "anonymous"');
            } else if (newNickName.length > 8) {  // text field has max chars set so should not ever hit this line
                this.showError(this.$('[ulti-player-nickname-error]'), '<b>Name too long:</b> Sorry...nickname must be less than 9 characters');
            } else if (newNickName == oldNickName && newFirstName == oldFirstName && newLastName == oldLastName) {
                this.showError(this.$('[ulti-player-name-error]'), 'You did not change the nick name or display name');
            } else {
                restService.promiseRenamePlayer(appContext.currentTeamId(), oldNickName, newNickName, newFirstName, newLastName).then(
                    function() {
                        var message = 'No changes made';
                        if (newNickName != oldNickName) {
                            message = 'Player <b>' + oldNickName + '</b> nickname (which is also the ID) changed to <b>' + newNickName +
                                '</b>. If you still have games on your mobile device with player <b>' + oldNickName +
                                '</b> you should now download the team and those games to your device (otherwise <b>'
                                + oldNickName + '</b> will re-appear when you next upload those games).';
                        } else if (oldFirstName != newFirstName || oldLastName != newLastName) {
                            message = (newLastName ==  '' && newFirstName ==  '') ?
                            'Player ' + oldNickName + ' display name removed.' :
                            'Player ' + oldNickName + ' display name changed to ' + newFirstName + ' ' + newLastName + '.';
                        }
                        self.dismiss();
                        bootbox.alert({
                            size: 'small',
                            title: 'Rename Complete',
                            message: message
                        });
                        self.actionComplete();
                    }, function() {
                        alert('bad thang');
                    });
            }
        },
        cancelTapped: function() {
            this.dismiss();
        },
        trimString: function(s) {
            if (s == null) {
                return '';
            }
            return jQuery.trim(s);
        },
        showError: function(errorEl, message) {
            errorEl.html(message);
            errorEl.show(400);
        },
        clearErrorMessages: function() {
            this.$('.alert-danger').hide();
        }

    });

    return PlayerNameEditDialogView;

});
