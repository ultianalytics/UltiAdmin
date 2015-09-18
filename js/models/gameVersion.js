define(['jquery', 'underscore','backbone'], function($, _, Backbone) {

    var GameVersion = Backbone.Model.extend({
        defaults: {
            "keyIdentifier":"",
            "description":"",
            "updateUtc":"",
            "ourScore":"",
            "theirScore":"",
            "currentVersion":false
        },
        fullDescription: function() {
            return this.get('updateUtc') + ' GMT, score: ' + this.get('ourScore') + '-' + this.get('theirScore') + ', ' + this.get('description');
        }
    });

    return GameVersion;

});