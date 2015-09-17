define(['jquery', 'underscore', 'backbone', 'appContext', 'router', 'views/appView'], function($, _, Backbone, appContext, router, appView) {
    return {initialize : function() {

        Backbone.history.start();

    }};
});