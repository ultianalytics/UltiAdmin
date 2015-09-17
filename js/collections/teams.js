define(['jquery', 'underscore','backbone', 'models/team'], function($, _, Backbone, Team) {

    // NOTE: this returns an instance, not the constructor

    var TeamCollection = Backbone.Collection.extend({
        model: Team,
        selectedTeam: null,
        isEmpty: function() {
            return this.models.length == 0;
        },
        populateFromRestResponse: function(restDataArray) {
            var teams = [];
            for (var i = 0; i < restDataArray.length; i++) {
                teams.push(new Team(restDataArray[i]));
            }
            var appContext = require("appContext");  // doing dependency here to avoid ciruclar dependency
            appContext.selectDefaultTeam(teams);
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

    return new TeamCollection();

});
