define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

    // NOTE: this returns an instance, not the constructor

    var Authenticator = Backbone.Model.extend({
        googleAuthenticator: null,  // an instance of gapi.auth2.GoogleAuth
        defaults: {
            clientId: '308589977906-f6gr28rqtlmnjtmoj6soc8rinlfqe2a1.apps.googleusercontent.com'
        },
        initialize: function() {
        },
        start: function(completion) {
            var authenticator = this;
            gapi.load('auth2', function () {
                authenticator.googleAuthenticator = gapi.auth2.init({
                    client_id: authenticator.get('clientId')
                });
                completion();
            });
        },
        verifySignon: function(success, failure) {
            if (this.googleAuthenticator == null) {
                var authenticator = this;
                this.start(function() {
                    authenticator.checkSignon(success, failure);
                })
            } else {
                this.checkSignon(success, failure);
            }
        },
        checkSignon: function(success, failure) {
            if (this.googleAuthenticator.isSignedIn.get() == true) {
                console.log("is signed on");
                success();
            } else {
                console.log("not signed in");
                failure();
            }
        }
    });

    return new Authenticator();

});