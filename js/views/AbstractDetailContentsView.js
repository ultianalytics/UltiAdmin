define(['jquery', 'underscore', 'backbone', 'text!templates/modal.html', 'views/UltiView'], function($, _, Backbone, modalHtml, UltiView) {

    var AbstractDetailContentsView = UltiView.extend({
        modalTemplate: _.template(modalHtml),
        showModalDialog: function (title, contentViewCreator) {
            $('[ulti-dialog-content]').html(this.modalTemplate({title: title}));
            var contentView = contentViewCreator();
            contentView.render();
            $('#ulti-dialog').modal('show');
        },
        dismissModalDialog: function () {
            $('#ulti-dialog').modal('hide');
        }
    });

    return AbstractDetailContentsView;

});

