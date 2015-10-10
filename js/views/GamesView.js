define(['jquery', 'underscore', 'backbone', 'collections/games', 'collections/gameVersions', 'views/AbstractDetailContentsView', 'views/GameImportDialogView', 'views/GameVersionsDialogView', 'appContext', 'bootbox', 'restService', 'text!templates/gameList.html'],
    function($, _, Backbone, gameCollection, gameVersionsCollection, AbstractDetailContentsView, GameImportDialogView, GameVersionsDialogView, appContext, bootbox, restService, gameListHtml) {

    var GamesView = AbstractDetailContentsView.extend({
        el: '[ulti-team-detail-games]',
        initialize: function() {
            gameCollection.on("reset", this.render, this);
        },
        events: {
            "click [ulti-game-list-button-export]": "exportTapped",
            "click [ulti-game-list-button-versions]": "versionsTapped",
            "click [ulti-game-list-button-delete]": "deleteTapped",
            "click [ulti-game-list-button-undelete]": "undeleteTapped",
            "click [ulti-game-import-button]": "importTapped"
        },
        template: _.template(gameListHtml),
        render: function() {
            var games = _.map(gameCollection.sortedGames(), function(game) {
                return game.toJSON();
            });
            this.$el.html(this.template({games: games, teamId: appContext.currentTeamId()}));
        },
        refresh: function() {
            var view = this;
            restService.promiseRetrieveGamesForAdmin(appContext.currentTeamId()).then(function(games) {
                gameCollection.populateFromRestResponse(games);
                view.render();
            }, function() {
                view.showServerErrorDialog();
            })
        },
        exportTapped: function(e) {
            var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-export');
            var downloadUrl = restService.urlForGameExportFileDownload(appContext.currentTeamId(), game.get('gameId'));
            location.href = downloadUrl;
        },
        versionsTapped: function(e) {
            var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-versions');
            var view = this;
            gameVersionsCollection.refreshForGame(game, function() {
                if (gameVersionsCollection.hasMultipleVersions()) {
                    view.showGameVersionsDialog(game);
                } else {
                    bootbox.alert({
                        size: 'small',
                        title: 'No Other Versions',
                        message: "This game does not have previous versions."
                    });
                }
            }, function() {
                view.showServerErrorDialog();
            });
        },
        deleteTapped: function (e) {
            var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-delete');
            var view = this;
            bootbox.confirm({
                size: 'small',
                title: 'Confirm Delete',
                message: 'Do you really want to delete game vs. ' + game.get('opponentName') + '?<br/><br/>NOTE: you can un-delete the game later',
                callback: function(result){
                    if (result == true) {
                        restService.promiseDeleteGame(appContext.currentTeamId(), game.get('gameId')).then(function () {
                            view.refresh();
                        }, function () {
                            view.showServerErrorDialog();
                        });
                    }
                }
            });
        },
        undeleteTapped: function(e) {
            var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-undelete');
            var view = this;
            restService.promiseUndeleteGame(appContext.currentTeamId(), game.get('gameId')).then(function () {
                view.refresh();
            }, function () {
                view.showServerErrorDialog();
            });
        },
        importTapped: function(e) {
            this.showImportDialog();
        },
        gameForButton: function(button, ultiId) {
            var gameId = $(button).attr(ultiId);
            return gameCollection.gameWithGameId(gameId);
        },
        showImportDialog: function () {
            var view = this;
            this.showModalDialog('Import Game', function() {
                var importDialog = new GameImportDialogView();
                importDialog.importComplete = function() {
                    appContext.refreshTeams(function() {
                        this.refresh();
                    }, function() {
                        view.showServerErrorDialog();
                    });
                };
                return importDialog;
            });
        },
        showGameVersionsDialog: function (game) {
            var view = this;
            this.showModalDialog('Game Versions', function() {
                var dialog = new GameVersionsDialogView();
                dialog.game = game;
                dialog.replaceComplete = function() {
                    appContext.refreshTeams(function() {
                        this.refresh();
                    }, function() {
                        view.showServerErrorDialog();
                    });
                };
                return dialog;
            });
        }
    });

    return GamesView;

});