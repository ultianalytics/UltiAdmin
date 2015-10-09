define(['jquery', 'underscore', 'backbone', 'appContext', 'collections/teams', 'collections/games', 'collections/players', 'views/AppView', 'appContext', 'bootbox'],
    function($, _, Backbone, appContext, teamCollection, gameCollection, playerCollection, AppView, appContext, bootbox) {

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
                var self = this;
                if (appContext.hasCurrentUser()) {
                    teamCollection.ensureFetched(function () {
                        if (!teamCollection.isEmpty()) {
                            appContext.selectDefaultTeam();
                            appContext.set('currentTab', 'settings');
                        }
                        self.appView.render();
                    }, function () {
                        self.showServerErrorAlert();
                    });
                }
            },

            team: function(cloudId, tab) {
                console.log('routed to cloud = ' + cloudId + ' tab = ' + tab);
                var self = this;
                teamCollection.ensureFetched(function() {
                    var teamChange = appContext.currentTeamId() != cloudId;
                    appContext.set('currentTeam', teamCollection.teamWithCloudId(cloudId));
                    appContext.set('currentTab', tab == null ? 'settings' : tab);
                    if (teamChange) {
                        gameCollection.reset();
                        playerCollection.reset();
                    }
                }, function() {
                    self.showServerErrorAlert();
                });
            },
            showServerErrorAlert: function () {
                bootbox.alert({
                    size: 'small',
                    title: 'Server Error',
                    message: 'Ouch...we experienced an error trying to talk to our server.<br/><br/>Please try again by refreshing your browser.<br/><br/>If the problem persists, please notify us at <a href="mailto:support@ultianalytics.com">support@ultianalytics.com</a>.'
                });
            }
        });

        return new AppRouter();

    });