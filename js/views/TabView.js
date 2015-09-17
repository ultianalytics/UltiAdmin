define(['jquery', 'underscore', 'backbone', 'appContext'],
    function($, _, Backbone, appContext) {

        var TabView = Backbone.View.extend({
            el: '[ulti-tab]',
            events: {
                "click a": "tabPicked"
            },
            initialize: function() {
                appContext.on("change:currentTeam", this.teamChanged, this);
                appContext.on("change:currentTab", this.tabChanged, this);
            },
            teamChanged: function() {
                appContext.set('currentTab', 'settings');
                this.render();
            },
            tabChanged: function() {
                this.render();
            },
            render: function() {
                this.$('li [ulti-tab-choice="settings"]').parent().toggleClass('active', appContext.currentTab() == 'settings');
                this.$('li [ulti-tab-choice="games"]').parent().toggleClass('active', appContext.currentTab() == 'games');
                this.$('li [ulti-tab-choice="players"]').parent().toggleClass('active', appContext.currentTab() == 'players');
                this.$el.toggleClass('hidden', appContext.currentTeam().get('deleted'));
                return this;
            },
            tabPicked: function(e) {
                e.preventDefault();
                var selectedTab = e.currentTarget.attributes['ulti-tab-choice'].value;
                var router = require('router');
                router.navigate('team/' + appContext.currentTeamId() + '/' + selectedTab, {trigger: true});
            }
        });

        return TabView;

});