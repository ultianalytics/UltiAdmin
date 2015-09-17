define(['jquery', 'underscore','backbone'], function($, _, Backbone) {

    var Team = Backbone.Model.extend({
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

    return Team;

});