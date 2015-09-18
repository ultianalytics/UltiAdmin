define(['jquery', 'underscore', 'backbone', 'collections/games', 'collections/gameVersions', 'views/AbstractDetailContentsView', 'views/GameImportDialogView', 'views/GameVersionsDialogView', 'appContext', 'bootbox'],
    function($, _, Backbone, gameCollection, gameVersionsCollection, AbstractDetailContentsView, GameImportDialogView, GameVersionsDialogView, appContext, bootbox) {

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
        template: _.template($("#ulti-team-games-template").html()),
        render: function() {
            var games = _.map(gameCollection.sortedGames(), function(game) {
                return game.toJSON();
            });
            this.$el.html(this.template({games: games, teamId: appContext.currentTeamId()}));
        },
        refresh: function() {
            var view = this;
            retrieveGamesForAdmin(appContext.currentTeamId(), function(games) {
                gameCollection.populateFromRestResponse(games);
                view.render();
            }, function() {
                alert("bad thang happened");
            })
        },
        exportTapped: function(e) {
            var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-export');
            var downloadUrl = urlForGameExportFileDownload(appContext.currentTeamId(), game.get('gameId'));
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
                alert("bad thang happened");
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
                        deleteGame(appContext.currentTeamId(), game.get('gameId'), function () {
                            view.refresh();
                        }, function () {
                            alert("bad thang happened");
                        });
                    }
                }
            });
        },
        undeleteTapped: function(e) {
            var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-undelete');
            var view = this;
            undeleteGame(appContext.currentTeamId(), game.get('gameId'), function () {
                view.refresh();
            }, function () {
                alert("bad thang happened");
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
            this.showModalDialog('Import Game', function() {
                var importDialog = new GameImportDialogView();
                importDialog.importComplete = function() {
                    appContext.refreshTeams(function() {
                        this.refresh();
                    }, function() {
                        alert("bad thang");
                    });
                };
                return importDialog;
            });
        },
        showGameVersionsDialog: function (game) {
            this.showModalDialog('Game Versions', function() {
                var dialog = new GameVersionsDialogView();
                dialog.game = game;
                dialog.replaceComplete = function() {
                    appContext.refreshTeams(function() {
                        this.refresh();
                    }, function() {
                        alert("bad thang");
                    });
                };
                return dialog;
            });
        },
        showNoGameVersionsWarning: function (game) {

        }
    });

    return GamesView;

});