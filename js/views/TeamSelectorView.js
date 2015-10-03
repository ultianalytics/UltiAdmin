define(['jquery', 'underscore', 'backbone', 'collections/teams', 'appContext', 'text!templates/teamSelector.html'],
    function($, _, Backbone, teamCollection, appContext, teamSelectorHtml) {

        var TeamSelectorView = Backbone.View.extend({
            teams: teamCollection,
            el: '[ulti-team-selector]',
            initialize: function() {
                this.teams.on('reset', this.teamsChanged, this);
                appContext.on("change:currentTeam", this.selectedTeamChanged, this);
            },
            template: _.template(teamSelectorHtml),
            teamsChanged: function() {
                this.render();
            },
            selectedTeamChanged: function() {
                this.render();
            },
            render: function() {
                this.$el.html(this.template({teams : this.teams.models, selectedTeam : appContext.currentTeam()}));
                this.$("[ulti-team-choice]").click(function(e) {
                    e.preventDefault();
                    var selectedCloudId = e.currentTarget.attributes['ulti-team-choice'].value;
                    var router = require("router");
                    router.navigate('team/' + selectedCloudId + '/settings', {trigger: true});
                });
                return this;
            }
        });

        return TeamSelectorView;

});