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
        private: "",
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
        currentTeam: null
    }
});


app.teamCollection = new app.TeamCollection();
app.appContext = new app.AppContext();

// VIEWS

app.TeamSelectorView = Backbone.View.extend({
    teams: app.teamCollection,
    el: '[ulti-team-selector]',
    initialize: function() {
        this.teams.on("reset", this.render, this);
    },
    template: _.template($("#ulti-team-selector-template").html()),
    render: function() {
        this.$el.html(this.template({teams : this.teams.models, selectedTeam : app.appContext.get('currentTeam')}));
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
        var cloudId = app.appContext.get('currentTeam').get('cloudId');
        this.$('[ulti-team-cloudid]').html(cloudId);
        var url = 'http://www.ultianalytics.com/app/#/' + cloudId + '/players';
        this.$('[ulti-stats-site-link]').attr('href',url)
        return this;
    }
});

app.teamSelectorView = new app.TeamSelectorView();
app.teamStatsBasicInfoView = new app.TeamStatsBasicInfoView();

retrieveTeamsIncludingDeleted(function(teams) {
    if (teams.length > 0) {
        $('[ulti-teams-container]').show();
        $('[ulti-teams-no-teams]').hide();
        app.teamCollection.populateFromRestResponse(teams);
    } else {
        $('[ulti-teams-container]').hide();
        $('[ulti-teams-no-teams]').show();
    }
}, function() {
    alert("bad thang happened");
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