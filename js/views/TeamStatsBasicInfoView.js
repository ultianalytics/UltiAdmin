define(['jquery', 'underscore', 'backbone', 'appContext'],
    function($, _, Backbone, appContext) {

        var TeamStatsBasicInfoView = Backbone.View.extend({
            el: '[ulti-team-basic-info]',
            initialize: function() {
                appContext.on("change:currentTeam", this.render, this);
            },
            render: function() {
                var currentTeam = appContext.currentTeam();
                var cloudId = currentTeam.get('cloudId');
                this.$('[ulti-team-cloudid]').html(cloudId);
                var url = 'http://www.ultianalytics.com/app/#/' + cloudId + '/players';
                this.$('[ulti-stats-site-link]').attr('href',url);
                this.$('[ulti-stats-site-link]').toggleClass('hidden', currentTeam.get('deleted'));
                return this;
            }
        });

        return TeamStatsBasicInfoView;

});