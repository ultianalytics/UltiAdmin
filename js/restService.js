define(['jquery', 'q'], function($, Q) {

	RestService = function (schemeAndHost) {
		// private instvars
		var self = this;
		var baseRestUrl = schemeAndHost + '/rest/view';
		var sessionId = new Date().getTime() + '';
		var busyDialogStack = 0;

		// public instvars
		this.accessToken = "unknown";

		// public metbods

		this.promiseRetrieveTeamsIncludingDeleted = function() {
			sendAnalyticsEvent("retrieveTeams");
			var url = baseRestUrl + '/teams?includeDeleted=true';
			var promise = new Q.Promise(function(resolve, reject) {
				sendRequest({url: url, dataType: 'json', success: resolve, error: reject});
			});
			return promise;
		}

		this.promiseRetrieveTeamForAdmin = function(id, includePlayers, includeInactive) {
			sendAnalyticsEvent("retrieveTeamForAdmin");
			var url = baseRestUrl + '/admin/team/' + id;
			if (includePlayers) {
				url = url + "?players=true";
				if (includeInactive) {
					url = url + "&includeInactive=true";
				}
			}
			var promise = new Q.Promise(function(resolve, reject) {
				sendRequest({url: url, dataType: 'json', success: resolve, error: reject});
			});
			return promise;
		}

		this.promiseRetrieveGamesForAdmin = function(teamId) {
			sendAnalyticsEvent("retrieveGamesForAdmin");
			var url = baseRestUrl + '/admin/team/' + teamId + '/games';
			var promise = new Q.Promise(function(resolve, reject) {
				sendRequest({url: url, dataType: 'json', success: resolve, error: reject});
			});
			return promise;
		}

		this.promiseRetrieveGameVersions = function(teamId, gameId) {
			sendAnalyticsEvent("retrieveGameVersions");
			var url = baseRestUrl + '/team/' + teamId + '/game/' + gameId + '/versions';
			var promise = new Q.Promise(function(resolve, reject) {
				sendRequest({url: url, dataType: 'json', success: resolve, error: reject});
			});
			return promise;
		}

		this.promiseDeleteGame = function(teamId, gameId) {
			sendAnalyticsEvent("deleteGame");
			var url = baseRestUrl + '/team/' + teamId + '/game/' + gameId + '/delete';
			var promise = new Q.Promise(function(resolve, reject) {
				sendRequest({url: url, dataType: null, isPost: true, success: resolve, error: reject});
			});
			return promise;
		}

		this.promiseUndeleteGame = function(teamId, gameId) {
			sendAnalyticsEvent("undeleteGame");
			var url = baseRestUrl + '/team/' + teamId + '/game/' + gameId + '/undelete';
			var promise = new Q.Promise(function(resolve, reject) {
				sendRequest({url: url, dataType: null, isPost: true, success: resolve, error: reject});
			});
			return promise;
		}

		this.promiseDeleteTeam = function(teamId) {
			sendAnalyticsEvent("deleteTeam");
			var url = baseRestUrl + '/team/' + teamId + '/delete';
			var promise = new Q.Promise(function(resolve, reject) {
				sendRequest({url: url, dataType: null, isPost: true, success: resolve, error: reject});
			})
			return promise;
		}

		this.promiseUndeleteTeam = function(teamId) {
			sendAnalyticsEvent("undeleteTeam");
			var url = baseRestUrl + '/team/' + teamId + '/undelete';
			var promise = new Q.Promise(function(resolve, reject) {
				sendRequest({url: url, dataType: null, isPost: true, success: resolve, error: reject});
			});
			return promise;
		}

		this.promiseDeletePlayer = function(teamId, playerToDelete, replacementPlayer) {
			sendAnalyticsEvent("deletePlayer");
			var url = baseRestUrl + '/team/' + teamId + '/player/delete?player=' + playerToDelete + '&replacement='+replacementPlayer;
			var promise = new Q.Promise(function(resolve, reject) {
				sendRequest({url: url, dataType: null, isPost: true, success: resolve, error: reject});
			});
			return promise;
		}

		this.promiseRenamePlayer = function(teamId, playerToRename, replacementPlayer, firstName, lastName) {
			sendAnalyticsEvent("renamePlayer");
			var url = baseRestUrl + '/team/' + teamId + '/player/rename?player=' + playerToRename +
				'&replacement=' + replacementPlayer + '&firstName=' + firstName + '&lastName=' + lastName;
			var promise = new Q.Promise(function(resolve, reject) {
				sendRequest({url: url, dataType: null, isPost: true, success: resolve, error: reject});
			});
			return promise;
		}

		this.promiseRestoreGameVersion = function(teamId, gameId, versionId) {
			sendAnalyticsEvent("restoreGameVersion");
			var url = baseRestUrl + '/team/' + teamId + '/game/' + gameId + '/version/' + versionId + '/restore';
			var promise = new Q.Promise(function(resolve, reject){
				sendRequest({url: url, dataType: null, isPost: true, success: resolve, error: reject});
			});
			return promise
		}

		this.promiseImportGame = function(teamId, gameFormData) {
			sendAnalyticsEvent("importGame");
			var url = baseRestUrl + '/team/' + teamId + '/import2/game';
			var promise = new Q.Promise(function(resolve, reject) {
				sendRequest({url: url, data: gameFormData, isFileUpload: true, success: resolve, error: reject});
			});
			return promise;
		}

		this.promiseSavePassword = function(teamId, password) {
			sendAnalyticsEvent("savePassword");
			var url = baseRestUrl + '/team/' + teamId + '/password/' + (isNullOrEmpty(password) ? 'REMOVE-PASSWORD' : password);
			var promise = new Q.Promise(function(resolve, reject) {
				sendRequest({url: url, dataType: null, isPost: true, success: resolve, error: reject});
			});
			return promise;
		}

		this.urlForGameExportFileDownload = function(teamId, gameId) {
			var url = baseRestUrl + '/team/' + teamId + '/export/game/' + gameId + '?players=true&access_token=' + this.accessToken;
			return url;
		}

		// private methods

		function sendRequest(request) {
			var options = {
				success: function(data, textStatus, jqXHR){
					busyDialogEnd();
					var responseTypeReceived = jqXHR.getResponseHeader('Content-Type');
					if (isExpectedResponseType(request, jqXHR)) {
						request.success(data, textStatus, jqXHR);
					} else {
						logRequestFailure(jqXHR, "", "unexpected response type = " + responseTypeReceived);
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					busyDialogEnd();
					var error = logRequestFailure(jqXHR, textStatus, errorThrown);
					if (request.error) {
						request.error(jqXHR, textStatus, errorThrown);
					} else {
						throw error;
					}
				}
			};
			if (request.dataType) {
				options.dataType = request.dataType;
			}
			if (request.isFileUpload) {
				options.processData = false;
				options.contentType = false;
				options.enctype = 'multipart/form-data';
				options.type = 'POST';
			} else if (request.isPost) {
				options.type = 'POST';
				options.contentType = 'application/json';
			}
			if (request.data) {
				options.data = request.data;
			}
			options.xhrFields = {withCredentials: true};
			options.headers = {
				'Authorization':'Bearer ' + self.accessToken
			};
			busyDialogStart();
			if (options.type != 'GET') {
				resetCacheBuster();
			}
			var url = addQueryStringParameter(request.url, 'cachebuster', sessionId);  // new session on every page load
			$.ajax(url, options);
		}

		function isExpectedResponseType(request, responseTypeReceived) {
			if (request.expectedResponseType) {
				if (responseTypeReceived.indexOf(request.expectedResponseType) < 0) {
					return false;
				}
			}
			return true;
		}

		function logRequestFailure(jqXHR, textStatus, errorThrow) {
			var error = errorDescription(jqXHR, textStatus, errorThrow);
			logError(error);
			return error;
		}

		function errorDescription(jqXHR, textStatus, errorThrow) {
			return 'ERROR: status '  + jqXHR.status + ' ('  + textStatus  + ') '  + errorThrow +
				(jqXHR.responseText ? ' \n'  + jqXHR.responseText : '');
		}

		function logError(error) {
			if (window.console) {
				console.log(error);
			}
		}

		// descending date-ordered list
		function sortGames(games) {
			var sortedGames = games.sort(function(a,b) {
				var first = a.msSinceEpoch ? a.msSinceEpoch : 0;
				var second = b.msSinceEpoch ? b.msSinceEpoch : 0;
				return second - first;
			});
			return sortedGames;
		}

		function collectGameIds(games) {
			var gameIds = [];
			$.each(games, function() {
				gameIds.push(this.gameId);
			});
			return gameIds;
		}

		function log(message) {
			if (window.console) {
				console.log(message);
			}
		}

		function isNullOrEmpty(s) {
			return s == null || jQuery.trim(s) == '';
		}

		function busyDialogStart() {
			busyDialogStack++;
			if (busyDialogStack == 1) {
				$('.hideWhenBusy').addClass('hidden');
				$('.spinner').removeClass('hidden');
			}
		}

		function busyDialogEnd() {
			busyDialogStack--;
			if (busyDialogStack == 0) {
				resetBusyDialog();
			}
		}

		function resetBusyDialog() {
			$('.spinner').addClass('hidden');
			showHiddenWhenBusyElements();
			busyDialogStack == 0;
		}

		function showHiddenWhenBusyElements()  {
			$('.hideWhenBusy').removeClass('hidden');
		}

		function hideHiddenWhenBusyElements()  {
			$('.hideWhenBusy').addClass('hidden');
		}

		function addQueryStringParameter(url, key, value) {
			return url + (url.indexOf('?') > 0 ? '&' : '?') + key + '=' + value;
		}

		function resetCacheBuster() {
			sessionId = new Date().getTime() + '';
		}

		function sendAnalyticsEvent(restEndpointName) {
			// TODO...capture events in analytics
		}

	}

	return new RestService("http://www.ultianalytics.com");

});