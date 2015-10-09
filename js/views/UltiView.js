define(['jquery', 'underscore', 'backbone', 'bootbox'], function($, _, Backbone, bootbox) {

    var UltiView = Backbone.View.extend({
        showServerErrorDialog: function () {
            this.showErrorDialog('Server Error', 'Ouch...we experienced an error trying to talk to our server.<br/><br/>Please try again by refreshing your browser.<br/><br/>If the problem persists, please notify us at <a href="mailto:support@ultianalytics.com">support@ultianalytics.com</a>.');
        },
        showErrorDialog: function (title, message) {
            bootbox.alert({
                size: 'small',
                title: title,
                message: message
            });
        }
    });

    return UltiView;

});
