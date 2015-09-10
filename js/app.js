/**
 * Created by jim on 9/8/15.
 */

if (!app) {
    app = {};
}


// MODELS

app.Team = Backbone.Model.extend({
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

app.TeamCollection = Backbone.Collection.extend({
    model: app.Team,
    selectedTeam: null,
    populateFromRestResponse: function(restDataArray) {
        var teams = [];
        for (var i = 0; i < restDataArray.length; i++) {
            teams.push(new app.Team(restDataArray[i]));
        }
        app.appContext.set('currentTeam', this.defaultSelectedTeam(teams));
        this.reset(teams);
    },
    defaultSelectedTeam: function(teamList) {
        if (!teamList || teamList.length == 0) {
            return null;
        }
        var defaultTeam = teamList[0];
        for (var i = 0; i < teamList.length; i++) {
            if (!teamList[i].get('deleted')) {
                defaultTeam = teamList[i];
                break;
            }
        }
        return defaultTeam;
    }
});

app.AppContext = Backbone.Model.extend({
    defaults: {
        currentTeam: null,
        currentTab: 'settings'
    }
});

// APP OBJECTS

app.teamCollection = new app.TeamCollection();
app.appContext = new app.AppContext();

// convenience functions

app.currentTeam = function() {
    return app.appContext.get('currentTeam');
}

app.currentTab = function() {
    return app.appContext.get('currentTab');
}


// VIEWS

app.TeamSelectorView = Backbone.View.extend({
    teams: app.teamCollection,
    el: '[ulti-team-selector]',
    initialize: function() {
        this.teams.on("reset", this.render, this);
    },
    template: _.template($("#ulti-team-selector-template").html()),
    render: function() {
        this.$el.html(this.template({teams : this.teams.models, selectedTeam : app.currentTeam()}));
        var view = this;
        this.$("[ulti-team-choice]").click(function(e) {
            e.preventDefault();
            var selectedCloudId = e.currentTarget.attributes['ulti-team-choice'].value;
            var selectedTeam = view.teams.findWhere({cloudId: selectedCloudId});
            app.appContext.set('currentTeam', selectedTeam);
            view.render();
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
    },
    teamChanged: function() {
        app.appContext.set('currentTab', 'settings');
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
        app.appContext.set('currentTab', selectedTab);
        this.render();
    }
});

app.TeamDetailContentsView = Backbone.View.extend({
    modalTemplate: _.template($("#ulti-modal-template").html()),
    showModalDialog: function (title, contentHtml) {
        $('[ulti-dialog-content]').html(this.modalTemplate({title: title, content : contentHtml}));
        $('#ulti-dialog').modal('show');
    },
    dismissModalDialog: function () {
        $('#ulti-dialog').modal('hide');
    }
});

app.TeamSettingsView = app.TeamDetailContentsView.extend({
    el: '[ulti-team-detail-settings]',
    initialize: function () {
    },
    events: {
        "click [ulti-team-password-link]": "passwordTapped",
        "click [ulti-team-delete-button]": "deleteTapped",
        "click [ulti-team-undelete-button]": "undeleteTapped",
    },
    template: _.template($("#ulti-team-settings-template").html()),
    deletedTeamTemplate: _.template($("#ulti-team-deleted-settings-template").html()),
    passwordChangedTemplate: _.template($("#ulti-team-password-modal-template").html()),
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
        alert("I'm pretending to be the delete dialog");
    },
    undeleteTapped: function () {
        alert("I'm pretending to be the un-delete dialog");
    },
    showPasswordChangeDialog: function () {
        this.showModalDialog('Set Team Password', this.passwordChangedTemplate({team : app.currentTeam()}));
        var view = this;
        $('[ulti-password-button]').click(function(e) {
            e.preventDefault();
            switch(e.currentTarget.attributes['ulti-password-button'].value) {
                case 'save':
                    view.savePasswordTapped();
                    break;
                case 'remove':
                    view.removePasswordTapped();
                    break;
                default: // 'settings'
                    view.cancelPasswordTapped();
            }
        });
    },
    savePasswordTapped: function() {
        var password = $.trim($('[ulti-password-text]').val());
        savePassword(app.currentTeam().get('cloudId'), password, function() {
                app.AppView.render();
            }, function() {
                alert("bad thang happened");
            })
    },
    removePasswordTapped: function() {
        this.dismissModalDialog();
    },
    cancelPasswordTapped: function() {
        this.dismissModalDialog();
    }
});

app.TeamGamesView = app.TeamDetailContentsView.extend({
    el: '[ulti-team-detail-games]',
    initialize: function() {
    },
    render: function() {
        return this;
    }
});

app.TeamPlayersView = app.TeamDetailContentsView.extend({
    el: '[ulti-team-detail-players]',
    initialize: function() {
    },
    render: function() {
        return this;
    }
});


app.TeamDetailView = Backbone.View.extend({
    el: '[ulti-team-detail]',
    initialize: function() {
        this.tabView = new app.TabView();
        this.settingsView = new app.TeamSettingsView();
        this.gamesView = new app.TeamGamesView();
        this.playersView = new app.TeamPlayersView();
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
                this.playersView.render()
                break;
            case 'games':
                this.gamesView.render()
                break;
            default: // 'settings'
                this.settingsView.render()
        }
        return this;
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
        this.retrieveTeams(app.currentTeam(), app.currentTab());
        return this;
    },
    retrieveTeams: function(selectedTeam, selectedTab) {
        retrieveTeamsIncludingDeleted(function (teams) {
            if (teams.length > 0) {
                $('[ulti-teams-container]').show();
                $('[ulti-teams-no-teams]').hide();
                app.teamCollection.populateFromRestResponse(teams);
                if (selectedTeam) {
                    var refreshedSelectedTeam = app.TeamCollection.findWhere({cloudId : selectedTeam.cloudId});
                    app.appContext.set('currentTeam', refreshedSelectedTeam);
                    if (selectedTab) {
                        app.appContext.set('currentTab', selectedTab);
                    }
                }
            } else {
                $('[ulti-teams-container]').hide();
                $('[ulti-teams-no-teams]').show();
            }
        }, function () {
            alert("bad thang happened");
        });
    }
});

app.appView = new app.AppView();
app.appView.render();




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
             "name":"Aj",
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
*/