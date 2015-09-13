if (!window.app) {
	app = {};
}
if (!app.rest) {
	app.rest = {};
}

app.rest.busyDialogStack = 0;
app.rest.baseRestUrl = "http://www.ultianalytics.com/rest/view";
app.rest.sessionId = new Date().getTime() + '';

function retrieveTeam(id, includePlayers, successFunction, errorFunction) {
	sendAnalyticsEvent("retrieveTeam");
	var url = app.rest.baseRestUrl + '/team/' + id;
	url = includePlayers ? url + "?players=true" : url;
	sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrieveTeamForAdmin(id, includePlayers, includeInactive, successFunction, errorFunction) {
	sendAnalyticsEvent("retrieveTeamForAdmin");
	var url = app.rest.baseRestUrl + '/admin/team/' + id;
	if (includePlayers) {
		url = url + "?players=true";
		if (includeInactive) {
			url = url + "&includeInactive=true";
		}
	}
	sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrieveGames(teamId, successFunction, errorFunction) {
	sendAnalyticsEvent("retrieveGames");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/games'; 
	sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrieveGamesData(teamId, successFunction, errorFunction) {
	sendAnalyticsEvent("retrieveGames");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/gamesdata'; 
	sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrieveGamesForAdmin(teamId, successFunction, errorFunction) {
	sendAnalyticsEvent("retrieveGamesForAdmin");
	var url = app.rest.baseRestUrl + '/admin/team/' + teamId + '/games'; 
	sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrieveGame(teamId, gameId, successFunction, errorFunction) {
	sendAnalyticsEvent("retrieveGame");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/game/' + gameId; 
	sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function deleteGame(teamId, gameId, successFunction, errorFunction) {
	sendAnalyticsEvent("deleteGame");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/game/' + gameId + '/delete'; 
	sendRequest({url: url, dataType: null, isPost: true, success: successFunction, error: errorFunction});
}

function undeleteGame(teamId, gameId, successFunction, errorFunction) {
	sendAnalyticsEvent("undeleteGame");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/game/' + gameId + '/undelete'; 
	sendRequest({url: url, dataType: null, isPost: true, success: successFunction, error: errorFunction});
}

function deleteTeam(teamId, successFunction, errorFunction) {
	sendAnalyticsEvent("deleteTeam");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/delete'; 
	sendRequest({url: url, dataType: null, isPost: true, success: successFunction, error: errorFunction});
}

function undeleteTeam(teamId, successFunction, errorFunction) {
	sendAnalyticsEvent("undeleteTeam");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/undelete'; 
	sendRequest({url: url, dataType: null, isPost: true, success: successFunction, error: errorFunction});
}

function deletePlayer(teamId, playerToDelete, replacementPlayer, successFunction, errorFunction) {
	sendAnalyticsEvent("deletePlayer");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/player/delete?player=' + playerToDelete + '&replacement='+replacementPlayer; 
	sendRequest({url: url, dataType: null, isPost: true, success: successFunction, error: errorFunction});
}

function renamePlayer(teamId, playerToRename, replacementPlayer, firstName, lastName, successFunction, errorFunction) {
	sendAnalyticsEvent("renamePlayer");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/player/rename?player=' + playerToRename + 
	'&replacement=' + replacementPlayer + '&firstName=' + firstName + '&lastName=' + lastName; 
	sendRequest({url: url, dataType: null, isPost: true, success: successFunction, error: errorFunction});
}

function retrievePlayerStatsForGames(teamId, gameIds, successFunction, errorFunction) {
	sendAnalyticsEvent("retrievePlayerStatsForGames");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/stats/player';
    if (gameIds != null && gameIds.length > 0) {
    	url = url + '?gameIds=' + gameIds.join("_");
    }
    sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrievePlayerStatsForEachGame(teamId, gameIds, successFunction, errorFunction) {
	sendAnalyticsEvent("retrievePlayerStatsForGames");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/stats/player/games';
    if (gameIds != null && gameIds.length > 0) {
    	url = url + '?gameIds=' + gameIds.join("_");
    }
    sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrieveTeamStatsForGames(teamId, gameIds, successFunction, errorFunction) {
	sendAnalyticsEvent("retrieveTeamStatsForGames");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/stats/team';
    if (gameIds != null && gameIds.length > 0) {
    	url = url + '?gameIds=' + gameIds.join("_");
    }
    sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrieveAllStatsForGames(teamId, gameIds, successFunction, errorFunction) {
	sendAnalyticsEvent("retrieveAllStatsForGames");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/stats/all';
    if (gameIds != null && gameIds.length > 0) {
    	url = url + '?gameIds=' + gameIds.join("_");
    }
    sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrieveTeams(successFunction, errorFunction) {
	sendAnalyticsEvent("retrieveTeams");
	var url = app.rest.baseRestUrl + '/teams'; 
	sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrieveTeamsIncludingDeleted(successFunction, errorFunction) {
	sendAnalyticsEvent("retrieveTeams");
	var url = app.rest.baseRestUrl + '/teams?includeDeleted=true'; 
	sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrievePlayerStatsForGame(options, successFunction, errorFunction) {
	sendAnalyticsEvent("retrievePlayerStatsForGame");
	var teamId = options.teamId;
	retrievePlayerStatsForGames(teamId, [options.gameId], successFunction, errorFunction);
}

function retrieveGameVersions(teamId, gameId, successFunction, errorFunction) {
	sendAnalyticsEvent("retrieveGameVersions");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/game/' + gameId + '/versions'; 
	sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function restoreGameVersion(teamId, gameId, versionId, successFunction, errorFunction) {
	sendAnalyticsEvent("restoreGameVersion");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/game/' + gameId + '/version/' + versionId + '/restore'; 
	sendRequest({url: url, dataType: null, isPost: true, success: successFunction, error: errorFunction});
}

function savePassword(teamId, password, successFunction, errorFunction) {
	sendAnalyticsEvent("savePassword");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/password/' + (isNullOrEmpty(password) ? 'REMOVE-PASSWORD' : password); 
	sendRequest({url: url, dataType: null, isPost: true, success: successFunction, error: errorFunction});
}

function signon(teamId, password, successFunction, errorFunction) {
	sendAnalyticsEvent("signon");
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/authenticate/' + password; 
	sendRequest({url: url, dataType: 'json', isPost: true, success: successFunction, error: errorFunction});
}

function urlForStatsExportFileDownload(teamId, games) {  
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/stats/export';
	if (games) {
		var sortedGames = sortGames(games);
		var gameIds = collectGameIds(sortedGames);
	    if (gameIds != null && gameIds.length > 0) {
	    	url = url + '?gameIds=' + gameIds.join("_");
	    }
	}
    return url;
}

function urlForGameExportFileDownload(teamId, gameId) {  
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/export/game/' + gameId + '?players=true';
    return url;
}

function urlForGameExportFileUpload(teamId) {  
	var returnUrl = encodeURIComponent('/team/admin#teamgamespage?team=' + teamId);
	var url = app.rest.baseRestUrl + '/team/' + teamId + '/import/game?return=' + returnUrl;
    return url;
}

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
	if (request.isPost) {
		options.type = 'POST';
		options.contentType = 'application/json';
	}
	if (request.data) {
		options.data = request.data;
	}
	options.xhrFields = {withCredentials: true};
	busyDialogStart();
	var url = addQueryStringParameter(request.url, 'cachebuster', app.rest.sessionId);  // new session on every page load
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

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
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

function getParameterByName(name) {
	var parts = window.location.href.split('?');  // jQM seems to pass odd urls sometimes (previous qs before current qs)
	var queryString = '?' + parts[parts.length -1];
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(queryString);
    var value = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    return value;
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


//answer an array of object: {id: 'TOURNAMENT-Centex-2012', name: 'Centex', year: 2012, games:['game1234', 'game345']} in reverse chrono order
function getTournaments(games) {
	var tournamentsList = [];
	if (games && games.length > 0) {
		var sortedGames = sortGames(games);
		var tournamentGames = {};

		jQuery.each(sortedGames, function() {
			var name = this.tournamentName;
			if (name) {
				var year = this.msSinceEpoch ? new Date(this.msSinceEpoch).getFullYear() : '';
				var id = 'TOURNAMENT-' + name + '-' + year;
				if (!tournamentGames[id]) {
					tournamentGames[id] = [];
					tournamentsList.push({id: id, name: name, year: year});
				}
				tournamentGames[id].push(this.gameId);
			}
		});
		
		jQuery.each(tournamentsList, function() {
			this.games = tournamentGames[this.id];
		});
		
		return tournamentsList;
	} 
	return [];
}

function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1 (indicating the use of another browser).
{
	var rv = -1; // Return value assumes failure.
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	return rv;
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
	app.rest.busyDialogStack++;
	if (app.rest.busyDialogStack == 1) {
		$('.hideWhenBusy').addClass('hidden');
		$('.spinner').removeClass('hidden');
	}
}

function busyDialogEnd() {
	app.rest.busyDialogStack--;
	if (app.rest.busyDialogStack == 0) {
		resetBusyDialog();
	}
}

function resetBusyDialog() {
	$('.spinner').addClass('hidden');
	showHiddenWhenBusyElements();
	app.rest.busyDialogStack == 0;
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
	app.rest.sessionId = new Date().getTime() + '';
}

function sendAnalyticsEvent(restEndpointName) {
	// TODO...capture events in analytics
}
