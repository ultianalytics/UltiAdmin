define(['jquery', 'underscore', 'backbone', 'bootstrap', 'appContext', 'router', 'views/AppView', 'models/user', 'restService', 'views/LogoffView', 'views/UserView'],
    function($, _, Backbone, bootstrap, appContext, router, appView, User, restService, LogoffView, UserView) {
    return {initialize : function() {

        var logoffView = new LogoffView();
        logoffView.render();

        var userView = new UserView();
        userView.render();

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