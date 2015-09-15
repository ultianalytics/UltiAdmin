/**
 * Created by jim on 9/8/15.
 */

if (!app) {
    app = {};
}

// UTILITY

isEmpty = function(string) {
    return string == null || $.trim(string).length == 0;
};

noArgsNoReturnFunction = function() {};

// MODELS & COLLECTIONS

app.Team = Backbone.Model.extend({
    games: null,
    defaults: {
        name: "",
        deleted: false,
        cloudId: "",
        teamId: "",
        season: "",
        nameWithSeason: "",
        private: false,
        password: ""
    }
});

app.Game = Backbone.Model.extend({
    defaults: {
        "gameId":"",
        "opponentName":"",
        "timestamp":"",
        "date":"",
        "time":"",
        "ours":18,
        "theirs":13,
        "previousVersionAvailable":false,
        "deleted":false
    }
});

app.Player = Backbone.Model.extend({
    defaults: {
        "name":"",
        "lastName":"",
        "firstName":"",
        "number":"",
        "position":"",
        "inactive":false,
        "male":true,
        "absent":false
    }
});

app.TeamCollection = Backbone.Collection.extend({
    model: app.Team,
    selectedTeam: null,
    isEmpty: function() {
        return this.models.length == 0;
    },
    populateFromRestResponse: function(restDataArray) {
        var teams = [];
        for (var i = 0; i < restDataArray.length; i++) {
            teams.push(new app.Team(restDataArray[i]));
        }
        app.appContext.selectDefaultTeam(teams);
        this.reset(teams);
    },
    teamWithCloudId: function(cloudId) {
        return this.findWhere({cloudId : cloudId});
    },
    ensureFetched: function(success, failure) {
        var collection = this;
        if (this.isEmpty()) {
            retrieveTeamsIncludingDeleted(function (teams) {
                collection.populateFromRestResponse(teams);
                success();
            }, function () {
                failure();
            });
        } else {
            success();
        }
    }
});

app.GameCollection = Backbone.Collection.extend({
    model: app.Game,
    populateFromRestResponse: function(restDataArray) {
        var games = [];
        for (var i = 0; i < restDataArray.length; i++) {
            games.push(new app.Game(restDataArray[i]));
        }
        this.reset(games);
    },
    gameWithGameId: function(gameId) {
        return this.findWhere({gameId : gameId});
    },
});

app.PlayerCollection = Backbone.Collection.extend({
    model: app.Player,
    populateFromRestResponse: function(restDataArray) {
        var players = [];
        for (var i = 0; i < restDataArray.length; i++) {
            players.push(new app.Player(restDataArray[i]));
        }
        this.reset(players);
    }
});

app.AppContext = Backbone.Model.extend({
    defaults: {
        currentTeam: null,
        currentTab: 'settings'
    },
    selectDefaultTeam: function(teamModels) {
        var teams = teamModels == null ? app.teamCollection.models : teamModels;
        var defaultTeam = teams.length == 0 ? null : teams[0];
        for (var i = 0; i < teams.length; i++) {
            if (!teams[i].get('deleted')) {
                defaultTeam = teams[i];
                break;
            }
        }
        if (defaultTeam != null) {
            if (app.currentTeamId() != defaultTeam.get('cloudId')) {
                app.appContext.set('currentTeam', defaultTeam);
            }
        }
    },
    refreshTeams: function(success, failure) {
        app.teamCollection.reset();
        var selectedTeam = app.currentTeam();
        var selectedTab = app.currentTab();
        app.teamCollection.ensureFetched(function() {
            if (!app.teamCollection.isEmpty()) {
                if (selectedTeam) {
                    var refreshedSelectedTeam = app.teamCollection.teamWithCloudId(selectedTeam.get('cloudId'));
                    app.appContext.set('currentTeam', refreshedSelectedTeam);
                    if (selectedTab) {
                        app.appContext.set('currentTab', selectedTab);
                    }
                }
            }
        }, failure);
    }
});

// APP OBJECTS

app.teamCollection = new app.TeamCollection();
app.gameCollection = new app.GameCollection();
app.playerCollection = new app.PlayerCollection();
app.appContext = new app.AppContext();

// convenience functions

app.currentTeam = function() {
    return app.appContext.get('currentTeam');
};

app.currentTeamId = function() {
    var currTeam = app.currentTeam();
    return currTeam == null ? null : currTeam.get('cloudId');
};

app.currentTab = function() {
    return app.appContext.get('currentTab');
};


// VIEWS

app.TeamSelectorView = Backbone.View.extend({
    teams: app.teamCollection,
    el: '[ulti-team-selector]',
    initialize: function() {
        this.teams.on('reset', this.teamsChanged, this);
        app.appContext.on("change:currentTeam", this.selectedTeamChanged, this);
    },
    template: _.template($("#ulti-team-selector-template").html()),
    teamsChanged: function() {
        this.render();
    },
    selectedTeamChanged: function() {
        this.render();
    },
    render: function() {
        this.$el.html(this.template({teams : this.teams.models, selectedTeam : app.currentTeam()}));
        this.$("[ulti-team-choice]").click(function(e) {
            e.preventDefault();
            var selectedCloudId = e.currentTarget.attributes['ulti-team-choice'].value;
            app.router.navigate('team/' + selectedCloudId + '/settings', {trigger: true});
        });
        return this;
    }
});

app.TeamStatsBasicInfoView = Backbone.View.extend({
    el: '[ulti-team-basic-info]',
    initialize: function() {
        app.appContext.on("change:currentTeam", this.render, this);
    },
    render: function() {
        var currentTeam = app.currentTeam();
        var cloudId = currentTeam.get('cloudId');
        this.$('[ulti-team-cloudid]').html(cloudId);
        var url = 'http://www.ultianalytics.com/app/#/' + cloudId + '/players';
        this.$('[ulti-stats-site-link]').attr('href',url);
        this.$('[ulti-stats-site-link]').toggleClass('hidden', currentTeam.get('deleted'));
        return this;
    }
});

app.TabView = Backbone.View.extend({
    el: '[ulti-tab]',
    events: {
        "click a": "tabPicked"
    },
    initialize: function() {
        app.appContext.on("change:currentTeam", this.teamChanged, this);
        app.appContext.on("change:currentTab", this.tabChanged, this);
    },
    teamChanged: function() {
        app.appContext.set('currentTab', 'settings');
        this.render();
    },
    tabChanged: function() {
        this.render();
    },
    render: function() {
        this.$('li [ulti-tab-choice="settings"]').parent().toggleClass('active', app.currentTab() == 'settings');
        this.$('li [ulti-tab-choice="games"]').parent().toggleClass('active', app.currentTab() == 'games');
        this.$('li [ulti-tab-choice="players"]').parent().toggleClass('active', app.currentTab() == 'players');
        this.$el.toggleClass('hidden', app.currentTeam().get('deleted'));
        return this;
    },
    tabPicked: function(e) {
        e.preventDefault();
        var selectedTab = e.currentTarget.attributes['ulti-tab-choice'].value;
        app.router.navigate('team/' + app.currentTeamId() + '/' + selectedTab, {trigger: true});
    }
});

app.AbstractDetailContentsView = Backbone.View.extend({
    modalTemplate: _.template($("#ulti-modal-template").html()),
    showModalDialog: function (title, contentViewCreator) {
        $('[ulti-dialog-content]').html(this.modalTemplate({title: title}));
        var contentView = contentViewCreator();
        contentView.render();
        $('#ulti-dialog').modal('show');
    },
    dismissModalDialog: function () {
        $('#ulti-dialog').modal('hide');
    }
});

app.DialogView = Backbone.View.extend({
    el: '[ulti-dialog-view-content]',
    initialize: function () {

    },
    dismiss: function () {
        $('#ulti-dialog').modal('hide');
    }
});

app.SettingView = app.AbstractDetailContentsView.extend({
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
        var currentTeam = app.currentTeam();
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
            message: 'Do you really want to delete ' + app.currentTeam().get('nameWithSeason') + ' (team ID ' + app.currentTeamId() + ')?<br/><br/>NOTE: you can un-delete the team later',
            callback: function(result){
                if (result == true) {
                    deleteTeam(app.currentTeamId(), function () {
                        app.appContext.refreshTeams(function() {
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
        undeleteTeam(app.currentTeamId(), function() {
            app.appContext.refreshTeams(function() {
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
            var passwordDialog = new app.PasswordDialogView();
            passwordDialog.passwordChanged = function() {
                app.appContext.refreshTeams(function() {
                    this.render();
                }, function() {
                    alert("bad thang");
                });
            };
            return passwordDialog;
        });
    }
});

app.PasswordDialogView = app.DialogView.extend({
    passwordChanged: noArgsNoReturnFunction,
    template: _.template($("#ulti-team-password-dialog-content-template").html()),
    render: function () {
        this.$el.html(this.template({team : app.currentTeam()}));
        this.updateSaveButtonEnablement();
    },
    events: {
        "click [ulti-password-button-save]": "savePasswordTapped",
        "click [ulti-password-button-remove]": "removePasswordTapped",
        "click [ulti-password-button-cancel]": "cancelPasswordTapped",
        "input [ulti-password-text]": "updateSaveButtonEnablement"
    },
    savePasswordTapped: function() {
        this.updatePassword(this.getPassword());
    },
    removePasswordTapped: function() {
        this.updatePassword("");
    },
    cancelPasswordTapped: function() {
        this.dismiss();
    },
    updateSaveButtonEnablement: function() {
        var isValidPassword = this.getPassword().length > 0;
        this.$('[ulti-password-button-save]').prop('disabled', !isValidPassword);
    },
    getPassword: function() {
        return $.trim($('[ulti-password-text]').val());
    },
    updatePassword: function(password) {
        var view = this;
        savePassword(app.currentTeamId(), password, function() {
            if (view.passwordChanged) {
                view.passwordChanged();
            }
            view.dismiss();
        }, function() {
            alert("bad thang happened");
        })
    }
});

app.GamesView = app.AbstractDetailContentsView.extend({
    el: '[ulti-team-detail-games]',
    initialize: function() {
        app.gameCollection.on("reset", this.render, this);
    },
    events: {
        "click [ulti-game-list-button-export]": "exportTapped",
        "click [ulti-game-list-button-versions]": "versionsTapped",
        "click [ulti-game-list-button-delete]": "deleteTapped",
        "click [ulti-game-list-button-undelete]": "undeleteTapped",
        "click [ulti-game-import-button]": "importTapped"
    },
    template: _.template($("#ulti-team-games-template").html()),
    render: function() {
        var games = _.map(app.gameCollection.models, function(game) {
            return game.toJSON();
        });
        this.$el.html(this.template({games: games, teamId: app.currentTeamId()}));
    },
    refresh: function() {
        var view = this;
        retrieveGamesForAdmin(app.currentTeamId(), function(games) {
            app.gameCollection.populateFromRestResponse(games);
            view.render();
        }, function() {
            alert("bad thang happened");
        })
    },
    exportTapped: function(e) {
        var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-export');
        alert('export tapped for game ' + game.get('gameId'));
    },
    versionsTapped: function(e) {
        var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-versions');
        alert('versions tapped for game ' + game.get('gameId'));
    },
    deleteTapped: function (e) {
        var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-delete');
        var view = this;
        bootbox.confirm({
            size: 'small',
            title: 'Confirm Delete',
            message: 'Do you really want to delete game vs. ' + game.get('opponentName') + '?<br/><br/>NOTE: you can un-delete the game later',
            callback: function(result){
                if (result == true) {
                    deleteGame(app.currentTeamId(), game.get('gameId'), function () {
                        view.refresh();
                    }, function () {
                        alert("bad thang happened");
                    });
                }
            }
        });
    },
    undeleteTapped: function(e) {
        var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-undelete');
        var view = this;
        undeleteGame(app.currentTeamId(), game.get('gameId'), function () {
            view.refresh();
        }, function () {
            alert("bad thang happened");
        });
    },
    importTapped: function(e) {
        alert('import tapped');
    },
    gameForButton: function(button, ultiId) {
        var gameId = $(button).attr(ultiId);
        return app.gameCollection.gameWithGameId(gameId);
    }
});

app.PlayersView = app.AbstractDetailContentsView.extend({
    el: '[ulti-team-detail-players]',
    initialize: function() {
        app.playerCollection.on("reset", this.render, this);
    },
    events: {
        "click [ulti-player-list-button-editname]": "editTapped",
        "click [ulti-player-list-button-merge]": "mergeTapped",
        "click [ulti-player-list-button-delete]": "deleteTapped"
    },
    template: _.template($("#ulti-team-players-template").html()),
    render: function () {
        var players = _.map(app.playerCollection.models, function(player) {
            return player.toJSON();
        });
        this.$el.html(this.template({players: players}));
    },
    editTapped: function() {
        alert('edit tapped');
    },
    mergeTapped: function() {
        alert('merge tapped');
    },
    deleteTapped: function() {
        alert('delete tapped');
        app.router.navigate("", true);
    }
});


app.TeamDetailView = Backbone.View.extend({
    el: '[ulti-team-detail]',
    initialize: function() {
        this.tabView = new app.TabView();
        this.settingsView = new app.SettingView();
        this.gamesView = new app.GamesView();
        this.playersView = new app.PlayersView();
        app.appContext.on("change:currentTeam", this.teamChanged, this);
        app.appContext.on("change:currentTab", this.tabChanged, this);
    },
    teamChanged: function() {
        this.render();
    },
    tabChanged: function() {
        this.render();
    },
    render: function() {
        this.settingsView.$el.toggleClass('hidden', app.currentTab() != 'settings');
        this.gamesView.$el.toggleClass('hidden', app.currentTab() != 'games');
        this.playersView.$el.toggleClass('hidden', app.currentTab() != 'players');
        switch(app.currentTab()) {
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
        retrieveGamesForAdmin(app.currentTeamId(), function(games) {
            app.gameCollection.populateFromRestResponse(games);
        }, function() {
            alert("bad thang happened");
        })
    },
    renderPlayersView: function() {
        retrieveTeamForAdmin(app.currentTeamId(), true, true, function(team) {
            app.playerCollection.populateFromRestResponse(team.players);
        }, function() {
            alert("bad thang happened");
        })
    }
});

app.AppView = Backbone.View.extend({
    el: '[ulti-app]',
    initialize: function() {
        this.teamSelectorView = new app.TeamSelectorView();
        this.teamStatsBasicInfoView = new app.TeamStatsBasicInfoView();
        this.teamDetailView = new app.TeamDetailView();
    },
    render: function() {
        var selectedTeam = app.currentTeam();
        var selectedTab = app.currentTab();
        app.teamCollection.ensureFetched(function() {
            var teams = app.teamCollection.models;
            if (teams.length > 0) {
                $('[ulti-teams-container]').show();
                $('[ulti-teams-no-teams]').hide();
                if (selectedTeam) {
                    var refreshedSelectedTeam = app.teamCollection.teamWithCloudId(selectedTeam.get('cloudId'));
                    app.appContext.set('currentTeam', refreshedSelectedTeam);
                    if (selectedTab) {
                        app.appContext.set('currentTab', selectedTab);
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

// ROUTER

app.AppRouter = Backbone.Router.extend({
    routes: {
        'team/:cloudId/:tab' : 'team',
        '*path' : 'defaultRoute'
    },

    defaultRoute: function(path) {
        app.teamCollection.ensureFetched(function() {
            if (!app.teamCollection.isEmpty()) {
                app.appContext.selectDefaultTeam();
                app.appContext.set('currentTab', 'settings');
            }
            app.appView.render();
        }, function() {
            alert("bad thang");
        });
    },

    team: function(cloudId, tab) {
        console.log('routed to cloud = ' + cloudId + ' tab = ' + tab);
        app.teamCollection.ensureFetched(function() {
            var teamChange = app.currentTeamId() != cloudId;
            app.appContext.set('currentTeam', app.teamCollection.teamWithCloudId(cloudId));
            app.appContext.set('currentTab', tab == null ? 'settings' : tab);
            if (teamChange) {
                app.gameCollection.reset();
                app.playerCollection.reset();
            }
        }, function() {
            alert("bad thang");
        });
    }
});

app.appView = new app.AppView();

// Document Ready

$(function() {
    app.router = new app.AppRouter();
    Backbone.history.start();
});


// SAMPLE JSON
/*
Team from team list
{
    "cloudId":"188001",
    "teamId":"team-4FD44404-1B66-4439-A7BE-5D353101A0CF",
    "name":"@test@ Wildfire",
    "season":"2013-2014",
    "nameWithSeason":"@test@ Wildfire 2013-2014",
    "password":"foo",
    "leaguevineJson":"{\"name\":\"Windy City Wildfire\",\"id\":22635,\"season\":{\"name\":\"2013\",\"id\":20278,\"league\":{\"name\":\"AUDL\",\"id\":20053,\"gender\":\"open\"}}}",
    "numberOfGames":3,
    "firstGameDate":"2013-04-12 19:37",
    "lastGameDate":"2014-10-05 18:23",
    "private":true,
    "deleted":false,
    "displayPlayerNumber":false,
    "playersAreLeaguevine":false,
    "mixed":false
}

Team from get team
 {
     "cloudId":"188001",
     "teamId":"team-4FD44404-1B66-4439-A7BE-5D353101A0CF",
     "name":"@test@ Wildfire",
     "season":"2013-2014",
     "nameWithSeason":"@test@ Wildfire 2013-2014",
     "players":[
         {
             "name":"Al",
            "lastName":"Jones",
            "firstName":"Abert",
             "number":"51",
             "position":"Cutter",
             "inactive":false,
             "male":true,
             "absent":false
         },
         {
             "name":"Alex",
             "number":"9",
             "position":"Handler",
             "inactive":false,
             "male":true,
             "absent":false
         }
     ],
     "password":"foo",
     "leaguevineJson":"{\"name\":\"Windy City Wildfire\",\"id\":22635,\"season\":{\"name\":\"2013\",\"id\":20278,\"league\":{\"name\":\"AUDL\",\"id\":20053,\"gender\":\"open\"}}}",
     "numberOfGames":3,
     "firstGameDate":"2013-04-12 19:37",
     "lastGameDate":"2014-10-05 18:23",
     "private":true,
     "deleted":false,
     "displayPlayerNumber":false,
     "playersAreLeaguevine":false,
     "mixed":false
 }

 Games

[
    {
        "teamId":"247001",
        "gameId":"game-07326021-B1C4-42B5-ADE6-1027D9D47265",
        "opponentName":"NJ Hammerheads",
        "gamePoint":1000,
        "wind":{
            "mph":10,
            "degrees":147,
            "leftToRight":true
        },
        "timestamp":"2013-05-12 15:22",
        "date":"Sun, 5/12",
        "time":"3:22",
        "msSinceEpoch":1368372120000,
        "ours":18,
        "theirs":13,
        "leaguevineJson":"{\"timezoneOffset\":-240,\"id\":97533,\"team2Name\":\"NJ Hammerheads\",\"team_1_id\":22644,\"timezone\":\"US\\/Eastern\",\"team_2_id\":22639,\"team1Name\":\"DC Breeze\",\"start_time\":\"2013-05-12T15:00:00-04:00\"}",
        "timeoutDetailsJson":"{\"takenSecondHalf\":0,\"quotaPerHalf\":2,\"takenFirstHalf\":0,\"quotaFloaters\":0}",
        "firstPointOline":true,
        "previousVersionAvailable":false,
        "positional":false,
        "deleted":false
    },
    {
        "teamId":"247001",
        "gameId":"game-B2DC21A6-916E-449C-9D16-B03132F7537D",
        "opponentName":"Toronto Rush",
        "gamePoint":1000,
        "wind":{
            "mph":0,
            "degrees":-1,
            "leftToRight":true
        },
        "timestamp":"2013-04-20 13:32",
        "date":"Sat, 4/20",
        "time":"1:32",
        "msSinceEpoch":1366464720000,
        "ours":13,
        "theirs":30,
        "leaguevineJson":"{\"tournament\":{\"id\":0},\"timezoneOffset\":-300,\"id\":97498,\"team2Name\":\"Toronto Rush\",\"team_1_id\":22644,\"timezone\":\"US\\/Central\",\"team_2_id\":22643,\"team1Name\":\"DC Breeze\",\"start_time\":\"2013-04-20T12:00:00-05:00\"}",
        "timeoutDetailsJson":"{\"takenSecondHalf\":0,\"quotaPerHalf\":2,\"takenFirstHalf\":2,\"quotaFloaters\":0}",
        "firstPointOline":false,
        "previousVersionAvailable":false,
        "positional":false,
        "deleted":false
    }
]

 */