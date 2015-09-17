define(['jquery', 'underscore', 'backbone', 'utility', 'views/DialogView', 'appContext'],
    function($, _, utility, Backbone, DialogView, appContext) {

    var GameImportDialogView = DialogView.extend({
        importComplete:utility.noArgsNoReturnFunction,
        template: _.template($("#ulti-game-import-dialog-content-template").html()),
        render: function () {
            this.$el.html(this.template());
            this.updateImportButtonEnablement();
        },
        events: {
            "click [ulti-import-button-import]": "importTapped",
            "click [ulti-import-button-cancel]": "cancelTapped",
            "change [ulti-import-select-file-input]": "fileSelected",
        },
        importTapped: function() {
            var file = this.$('[ulti-import-select-file-input]').get(0).files[0];
            var formData = new FormData();
            formData.append('file', file);
            var view = this;
            importGame(appContext.currentTeamId(), formData, function(data) {
                if (data && data.status == 'error') {
                    var explanation = data.message;
                    alert("import failed: " + explanation);
                } else {
                    if (view.importComplete) {
                        view.importComplete();
                    }
                    view.dismiss();
                }
            }, function() {
                alert("bad thang happened");
            })
        },
        cancelTapped: function() {
            this.dismiss();
        },
        fileSelected: function(e, numFiles, fileName) {
            this.$('[ulti-import-selected-file]').html(this.fileNameSelected());
            this.updateImportButtonEnablement();
        },
        updateImportButtonEnablement: function() {
            var isReadyForImport = !isEmpty(this.$('[ulti-import-selected-file]').html());
            this.$('[ulti-import-button-import]').prop('disabled', !isReadyForImport);
        },
        fileElement: function() {
            return this.$('[ulti-import-select-file-input]');
        },
        fileNameSelected: function() {
            var fileElement = this.fileElement();
            var numFiles = fileElement.get(0).files ? fileElement.get(0).files.length : 1;
            var fileName = fileElement.val().replace(/\\/g, '/').replace(/.*\//, '');
            return fileName;
        }
    });

    return GameImportDialogView;

});