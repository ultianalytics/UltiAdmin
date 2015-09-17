define(['jquery', 'underscore', 'backbone', 'appContext', 'collections/teams', 'collections/games', 'collections/players', 'views/AppView'],
    function($, _, Backbone, appContext, teamCollection, gameCollection, playerCollection, AppView) {

    // NOTE: this returns an instance, not the constructor

    var AppRouter = Backbone.Router.extend({
        appView: null,
        routes: {
            'team/:cloudId/:tab' : 'team',
            '*path' : 'defaultRoute'
        },
        initialize: function() {
            this.appView = new AppView();
        },
        defaultRoute: function(path) {
            router = this;
            teamCollection.ensureFetched(function() {
                if (!teamCollection.isEmpty()) {
                    appContext.selectDefaultTeam();
                    appContext.set('currentTab', 'settings');
                }
                router.appView.render();
            }, function() {
                alert("bad thang");
            });
        },

        team: function(cloudId, tab) {
            console.log('routed to cloud = ' + cloudId + ' tab = ' + tab);
            teamCollection.ensureFetched(function() {
                var teamChange = appContext.currentTeamId() != cloudId;
                appContext.set('currentTeam', teamCollection.teamWithCloudId(cloudId));
                appContext.set('currentTab', tab == null ? 'settings' : tab);
                if (teamChange) {
                    gameCollection.reset();
                    playerCollection.reset();
                }
            }, function() {
                alert("bad thang");
            });
        }
    });

    return new AppRouter();

});