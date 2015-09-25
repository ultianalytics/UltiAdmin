define(['jquery', 'underscore', 'backbone', 'appContext', 'router', 'views/appView', 'models/user'], function($, _, Backbone, appContext, router, appView, User) {
    return {initialize : function() {

        var profile = GoogleUser.getBasicProfile();
        var access_token = GoogleUser.getAuthResponse().access_token;

        var user = new User();
        user.set('email', profile.getEmail());
        appContext.set('currentUser',user);

        app.rest.accessToken = access_token;

        $('[ulti-signon]').css('display', 'none');
        $('[ulti-app-content]').css('display', 'block');

        //appView.render();
        var router = require('router');
        router.navigate('/', {trigger: true});

        Backbone.history.start();

    }};
});