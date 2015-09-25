define(['jquery', 'underscore', 'backbone', 'appContext', 'router', 'views/appView', 'models/user', 'restService'],
    function($, _, Backbone, appContext, router, appView, User, restService) {
    return {initialize : function() {

        var profile = GoogleUser.getBasicProfile();
        var user = new User();
        user.set('email', profile.getEmail());
        appContext.set('currentUser',user);

        restService.accessToken = GoogleUser.getAuthResponse().access_token;

        $('[ulti-signon]').css('display', 'none');
        $('[ulti-app-content]').css('display', 'block');

        var router = require('router');
        router.navigate('/', {trigger: true});

        Backbone.history.start();

    }};
});