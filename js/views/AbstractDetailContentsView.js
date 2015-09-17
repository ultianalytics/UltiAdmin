define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

    var AbstractDetailContentsView = Backbone.View.extend({
        modalTemplate: _.template($("#ulti-modal-template").html()),
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

