define(['jquery', 'underscore', 'backbone', 'appContext'],
    function($, _, Backbone, appContext) {

        var LogoffView = Backbone.View.extend({
            el: '[ulti-logoff-button]',
            events: {
                "click": "logoffClicked"
            },
            initialize: function() {
                appContext.on("change:currentUser", this.userChanged, this);
            },
            userChanged: function() {
                this.render();
            },
            logoffClicked: function() {
                var urlWithoutHashTag = window.location.href.split('#')[0];
                document.location.href = 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=' + urlWithoutHashTag;


             // this didn't fully logout the user
                //appContext.set('currentUser', null);  // not really needed since we going to reload the page
                //this.signOutFromGoogle(function() {
                //    location.reload();
                //})
            },
            //signOutFromGoogle: function(completion) {
            //    var auth2 = gapi.auth2.getAuthInstance();
            //    auth2.signOut().then(function () {
            //        console.log('User signed out.');
            //        completion();
            //    });
            //},
            render: function() {
                if (appContext.hasCurrentUser()) {
                    this.$el.show();
                } else {
                    this.$el.hide();
                }
                return this;
            }
        });

        return LogoffView;

});