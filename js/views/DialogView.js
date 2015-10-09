define(['jquery', 'underscore', 'backbone', 'views/UltiView'], function($, _, Backbone, UltiView) {

    var DialogView = UltiView.extend({
        el: '[ulti-dialog-view-content]',
        initialize: function () {

        },
        dismiss: function () {
            $('#ulti-dialog').modal('hide');
        }
    });

    return DialogView;

});