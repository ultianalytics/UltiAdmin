define(['jquery', 'underscore','backbone', 'collections/teams', 'views/TeamSelectorView', 'views/TeamStatsBasicInfoView', 'views/TeamDetailView', 'appContext', 'models/user'],
    function($, _, Backbone, teamCollection, TeamSelectorView, TeamStatsBasicInfoView, TeamDetailView, appContext, User) {

    var AppView = Backbone.View.extend({
        el: '[ulti-app]',
        initialize: function() {
            this.teamSelectorView = new TeamSelectorView();
            this.teamStatsBasicInfoView = new TeamStatsBasicInfoView();
            this.teamDetailView = new TeamDetailView();
        },
        render: function() {
            var selectedTeam = appContext.currentTeam();
            var selectedTab = appContext.currentTab();
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
                alert("bad thang happened");
            });

            return this;
        }
    });


    return AppView;

});