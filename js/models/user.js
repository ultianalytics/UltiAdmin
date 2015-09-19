define(['jquery', 'underscore','backbone'], function($, _, Backbone) {

    var User = Backbone.Model.extend({
        defaults: {
            "email":"",
            "loginUrl":"",
            "logoutUrl":""
        }
    });

    return User;

});
