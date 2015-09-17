define(['jquery','underscore','backbone', 'collections/teams'], function($, _, Backbone, teamCollection) {

    // NOTE: this returns an instance of the app context, not the constructor

    var AppContext = Backbone.Model.extend({
        defaults: {
            currentTeam: null,
            currentTab: 'settings'
        },
        selectDefaultTeam: function(teamModels) {
            var teams = teamModels == null ? teamCollection.models : teamModels;
            var defaultTeam = teams.length == 0 ? null : teams[0];
            for (var i = 0; i < teams.length; i++) {
                if (!teams[i].get('deleted')) {
                    defaultTeam = teams[i];
                    break;
                }
            }
            if (defaultTeam != null) {
                if (this.currentTeamId() != defaultTeam.get('cloudId')) {
                    this.set('currentTeam', defaultTeam);
                }
            }
        },
        refreshTeams: function(success, failure) {
            teamCollection.reset();
            var selectedTeam = this.currentTeam();
            var selectedTab = this.currentTab();
            teamCollection.ensureFetched(function() {
                if (!teamCollection.isEmpty()) {
                    if (selectedTeam) {
                        var refreshedSelectedTeam = teamCollection.teamWithCloudId(selectedTeam.get('cloudId'));
                        this.set('currentTeam', refreshedSelectedTeam);
                        if (selectedTab) {
                            this.set('currentTab', selectedTab);
                        }
                    }
                }
            }, failure);
        },
        currentTeam: function() {
            return this.get('currentTeam');
        },
        currentTeamId: function() {
            var currTeam = this.currentTeam();
            return currTeam == null ? null : currTeam.get('cloudId');
        },
        currentTab: function() {
            this.get('currentTab');
        }
    });

    return new AppContext();
});
