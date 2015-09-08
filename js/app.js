/**
 * Created by jim on 9/8/15.
 */


// MODELS

var Team = Backbone.Model.extend({
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

var TeamCollection = Backbone.Collection.extend({
    model: Team
});


// VIEWS

var TeamSelectorView = Backbone.View.extend({
    tagName: "ulti-team-picker",
    template: _.template($("#contactTemplate").html())
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