define(['jquery', 'underscore', 'backbone', 'appContext'],
    function($, _, Backbone, appContext) {

        var UserView = Backbone.View.extend({
            el: '[ulti-user]',
            initialize: function() {
                appContext.on("change:currentUser", this.userChanged, this);
            },
            userChanged: function() {
                this.render();
            },
            render: function() {
                this.$el.html(appContext.currentUserEmail())
            }
        });
        return UserView;

});