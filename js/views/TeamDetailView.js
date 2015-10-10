define(['jquery', 'underscore', 'backbone', 'collections/players', 'collections/games', 'views/TabView', 'views/SettingView', 'views/GamesView', 'views/PlayersView', 'appContext', 'restService'],
    function($, _, Backbone, playerCollection, gameCollection, TabView, SettingView, GamesView, PlayersView, appContext, restService) {

        var TeamDetailView = Backbone.View.extend({
            el: '[ulti-team-detail]',
            initialize: function() {
                this.tabView = new TabView();
                this.settingsView = new SettingView();
                this.gamesView = new GamesView();
                this.playersView = new PlayersView();
                appContext.on("change:currentTeam", this.teamChanged, this);
                appContext.on("change:currentTab", this.tabChanged, this);
            },
            teamChanged: function() {
                this.render();
            },
            tabChanged: function() {
                this.render();
            },
            render: function() {
                this.settingsView.$el.toggleClass('hidden', appContext.currentTab() != 'settings');
                this.gamesView.$el.toggleClass('hidden', appContext.currentTab() != 'games');
                this.playersView.$el.toggleClass('hidden', appContext.currentTab() != 'players');
                switch(appContext.currentTab()) {
                    case 'players':
                        this.renderPlayersView();
                        break;
                    case 'games':
                        this.renderGamesView();
                        break;
                    default: // 'settings'
                        this.renderSettingsView();
                }
                return this;
            },
            renderSettingsView: function() {
                this.settingsView.render();
            },
            renderGamesView: function() {
                var view = this;
                restService.promiseRetrieveGamesForAdmin(appContext.currentTeamId()).then(function(games) {
                    gameCollection.populateFromRestResponse(games);
                }, function() {
                    view.showServerErrorDialog();
                })
            },
            renderPlayersView: function() {
                var view = this;
                restService.promiseRetrieveTeamForAdmin(appContext.currentTeamId(), true, true).then(function(team) {
                    playerCollection.populateFromRestResponse(team.players);
                }, function() {
                    view.showServerErrorDialog();
                })
            }
        });

        return TeamDetailView;

});