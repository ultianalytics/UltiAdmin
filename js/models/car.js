define(['jquery', 'underscore','backbone', 'models/game'], function($, _, Backbone, Game) {

    var Car = Backbone.Model.extend({
        defaults: {
            "game":new Game(),
            "model": "Ford"
        }
    });

    return Car;

});