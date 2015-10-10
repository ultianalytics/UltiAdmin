define(['jquery', 'underscore','backbone', 'collections/teams', 'views/TeamSelectorView', 'views/TeamStatsBasicInfoView', 'views/TeamDetailView', 'appContext', 'models/user', 'views/UltiView'],
    function($, _, Backbone, teamCollection, TeamSelectorView, TeamStatsBasicInfoView, TeamDetailView, appContext, User, UltiView) {

    var AppView = UltiView.extend({
        el: '[ulti-app]',
        initialize: function() {
            this.teamSelectorView = new TeamSelectorView();
            this.teamStatsBasicInfoView = new TeamStatsBasicInfoView();
            this.teamDetailView = new TeamDetailView();
        },
        render: function() {
            var selectedTeam = appContext.currentTeam();
            var selectedTab = appContext.currentTab();
            var self = this;
            teamCollection.ensureFetched(function() {
                var teams = teamCollection.models;
                if (teams.length > 0) {
                    $('[ulti-teams-container]').show();
                    $('[ulti-teams-no-teams]').hide();
                    if (selectedTeam) {
                        var refreshedSelectedTeam = teamCollection.teamWithCloudId(selectedTeam.get('cloudId'));
                        appContext.set('currentTeam', refreshedSelectedTeam);
                        if (selectedTab) {
                            appContext.set('currentTab', selectedTab);
                        }
                    }
                } else {
                    $('[ulti-teams-container]').hide();
                    $('[ulti-teams-no-teams]').show();
                }
            }, function() {
                self.showServerErrorDialog();
            });

            return this;
        }
    });


    return AppView;

});