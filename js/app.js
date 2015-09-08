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
    populateFromRestResponse: function(restDataArray) {
        var teams = [];
        for (var i = 0; i < restDataArray.length; i++) {
            teams.push(restDataArray[i]);
        }
        this.reset(teams)
    }
});

// VIEWS

app.TeamSelectorView = Backbone.View.extend({
    teams: new app.TeamCollection(),
    el: '[ulti-team-selector]',
    initialize: function() {
        this.teams.on("reset", this.render, this);
    },
    template: _.template($("#ulti-team-selector-template").html()),
    render: function() {
        this.$el.html(this.template({teams: teams.models}));
        return this;
    }
});

app.teamCollection = new app.TeamCollection();
app.teamSelectorView = new app.TeamSelectorView();
app.teamSelectorView.teams = app.teamCollection;

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