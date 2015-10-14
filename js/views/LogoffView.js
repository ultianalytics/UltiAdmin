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
                appContext.set('currentUser', null);  // not really needed since we going to reload the page
                this.signOutFromGoogle(function() {
                    location.reload();
                })
            },
            signOutFromGoogle: function(completion) {
                //var auth2 = gapi.auth2.getAuthInstance();
                //auth2.signOut().then(function () {
                //    console.log('User signed out.');
                //    completion();
                //});
                var options = {
                    success: function(data, textStatus, jqXHR){
                        completion();
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        console.log(errorThrown);
                        completion();
                    }
                };
                $.ajax("https://mail.google.com/mail/u/0/?logout", options);
            },
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