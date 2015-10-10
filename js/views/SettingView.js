define(['jquery', 'underscore', 'backbone', 'collections/teams', 'views/AbstractDetailContentsView', 'views/PasswordDialogView', 'appContext', 'bootbox', 'restService', 'text!templates/teamSettings.html', 'text!templates/teamDeletedSettings.html'],
    function($, _, Backbone, teamCollection, AbstractDetailContentsView, PasswordDialogView, appContext, bootbox, restService, teamSettingsHtml, teamDeletedSettingsHtml) {

        var SettingView = AbstractDetailContentsView.extend({
            el: '[ulti-team-detail-settings]',
            initialize: function () {
            },
            events: {
                "click [ulti-team-password-link]": "passwordTapped",
                "click [ulti-team-delete-button]": "deleteTapped",
                "click [ulti-team-undelete-button]": "undeleteTapped"
            },
            template: _.template(teamSettingsHtml),
            deletedTeamTemplate: _.template(teamDeletedSettingsHtml),
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
                var view = this;
                bootbox.confirm({
                    size: 'small',
                    title: 'Confirm Delete',
                    message: 'Do you really want to delete ' + appContext.currentTeam().get('nameWithSeason') + ' (team ID ' + appContext.currentTeamId() + ')?<br/><br/>NOTE: you can un-delete the team later',
                    callback: function(result){
                        if (result == true) {
                            restService.promiseDeleteTeam(appContext.currentTeamId()).then(function () {
                                appContext.refreshTeams(function() {
                                    //this.render();
                                }, function() {
                                    view.showServerErrorDialog();
                                });
                            }, function () {
                                view.showServerErrorDialog();
                            });
                        }
                    }
                });
            },
            undeleteTapped: function () {
                var view = this;
                restService.promiseUndeleteTeam(appContext.currentTeamId()).then(function() {
                    appContext.refreshTeams(function() {

                    }, function() {
                        view.showServerErrorDialog();
                    });
                }, function() {
                    view.showServerErrorDialog();
                });
            },
            showPasswordChangeDialog: function () {
                var view = this;
                this.showModalDialog('Set Team Password', function() {
                    var passwordDialog = new PasswordDialogView();
                    passwordDialog.passwordChanged = function() {
                        appContext.refreshTeams(function() {
                            this.render();
                        }, function() {
                            view.showServerErrorDialog();
                        });
                    };
                    return passwordDialog;
                });
            }
        });

        return SettingView;

});