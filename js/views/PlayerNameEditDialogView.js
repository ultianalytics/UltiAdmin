define(['jquery', 'underscore', 'backbone', 'utility', 'views/DialogView', 'appContext', 'collections/players', 'bootbox', 'restService'],
    function($, _, Backbone, utility, DialogView, appContext, playerCollection, bootbox, restService ) {

    var PlayerNameEditDialogView = DialogView.extend({
        player: null,
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

            var oldNickName = this.trimString(this.player.get('name'));
            var oldFirstName = this.trimString(this.player.get('firstName'));
            var oldLastName = this.trimString(this.player.get('lastName'));

            var newNickName = this.trimString(this.$('[ulti-player-nickname]').val());
            var newFirstName = this.trimString(this.$('[ulti-player-first-name]').val());
            var newLastName = this.trimString(this.$('[ulti-player-last-name]').val());


            //var newName = trimString($('#player-change-dialog-player-new-nickname-field').val());
            //var firstName = trimString($('#player-change-dialog-player-new-displayfirstname-field').val());
            //var lastName = trimString($('#player-change-dialog-player-new-displaylastname-field').val());
            //if (newName == '' || newName.toLowerCase() == 'anonymous' || newName.toLowerCase() == 'anon' || newName.toLowerCase() == 'unknown' ) {
            //    alert('Sorry..that is an invalid nickname');
            //} else if (newName.length > 8) {  // text field has max chars set so should not ever hit this line
            //    alert('Sorry...nickname must be less than 9 characters');
            //} else if (newName == playerName && oldFirstName == firstName && oldLastName == lastName) {
            //    alert('You did not change the nick name or display name');
            //} else {
            //    renamePlayer(Ultimate.teamId, playerName, newName, firstName, lastName, function() {
            //        var message = 'No changes made';
            //        if (newName != playerName) {
            //            message = 'Player ' + playerName + ' renamed to ' + newName +
            //                '. If you still have games on your mobile device with player ' + playerName +
            //                ' you should now download the team and those games to your device (otherwise '
            //                + playerName + ' will re-appear when you next upload those games).';
            //        } else if (firstName != oldFirstName || lastName != oldLastName) {
            //            message = (firstName ==  '' && lastName ==  '') ?
            //            'Player ' + playerName + ' display name removed.' :
            //            'Player ' + playerName + ' display name changed to ' + firstName + ' ' + lastName + '.';
            //        }
            //        alert(message);
            //        resetCacheBuster();
            //        populateTeam(function() {
            //            $.mobile.changePage('#teamplayerspage?team=' + Ultimate.teamId, {transition: 'pop'});
            //        }, handleRestError);
            //    })
            //}

        },
        cancelTapped: function() {
            this.dismiss();
        },
        trimString: function(s) {
            if (s == null) {
                return '';
            }
            return jQuery.trim(s);
        }

    });

    return PlayerNameEditDialogView;

});
