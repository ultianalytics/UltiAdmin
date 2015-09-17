define(['jquery', 'underscore', 'backbone', 'collections/teams', 'views/AbstractDetailContentsView', 'views/PasswordDialogView', 'appContext'],
    function($, _, Backbone, teamCollection, AbstractDetailContentsView, PasswordDialogView, appContext) {

        var SettingView = AbstractDetailContentsView.extend({
            el: '[ulti-team-detail-settings]',
            initialize: function () {
            },
            events: {
                "click [ulti-team-password-link]": "passwordTapped",
                "click [ulti-team-delete-button]": "deleteTapped",
                "click [ulti-team-undelete-button]": "undeleteTapped"
            },
            template: _.template($("#ulti-team-settings-template").html()),
            deletedTeamTemplate: _.template($("#ulti-team-deleted-settings-template").html()),
            render: function () {
                var currentTeam = appContext.currentTeam();
                if (currentTeam.get('deleted')) {
                    this.$el.html(this.deletedTeamTemplate());
                } else {
                    this.$el.html(this.template({team: currentTeam == null ? {} : currentTeam.toJSON()}));
                }
            },
            passwordTapped: function () {
                this.showPasswordChangeDialog();
            },
            deleteTapped: function () {
                bootbox.confirm({
                    size: 'small',
                    title: 'Confirm Delete',
                    message: 'Do you really want to delete ' + appContext.currentTeam().get('nameWithSeason') + ' (team ID ' + appContext.currentTeamId() + ')?<br/><br/>NOTE: you can un-delete the team later',
                    callback: function(result){
                        if (result == true) {
                            deleteTeam(appContext.currentTeamId(), function () {
                                appContext.refreshTeams(function() {
                                    //this.render();
                                }, function() {
                                    alert("bad thang");
                                });
                            }, function () {
                                alert("bad thang happened");
                            });
                        }
                    }
                });
            },
            undeleteTapped: function () {
                undeleteTeam(appContext.currentTeamId(), function() {
                    appContext.appContext.refreshTeams(function() {
                        //this.render();
                    }, function() {
                        alert("bad thang");
                    });
                }, function() {
                    alert("bad thang happened");
                });
            },
            showPasswordChangeDialog: function () {
                this.showModalDialog('Set Team Password', function() {
                    var passwordDialog = new PasswordDialogView();
                    passwordDialog.passwordChanged = function() {
                        appContext.refreshTeams(function() {
                            this.render();
                        }, function() {
                            alert("bad thang");
                        });
                    };
                    return passwordDialog;
                });
            }
        });

        return SettingView;

});