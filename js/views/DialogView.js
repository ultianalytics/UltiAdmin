define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

    var DialogView = Backbone.View.extend({
        el: '[ulti-dialog-view-content]',
        initialize: function () {

        },
        dismiss: function () {
            $('#ulti-dialog').modal('hide');
        }
    });

    return DialogView;

});