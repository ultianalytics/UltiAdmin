define(['jquery', 'underscore','backbone'], function($, _, Backbone) {

    var Player = Backbone.Model.extend({
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

    return Player;

});