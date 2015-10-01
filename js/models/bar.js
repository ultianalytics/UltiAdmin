define(['jquery', 'underscore','backbone', 'models/car'], function($, _, Backbone, Car) {

    var Bar = Backbone.Model.extend({
        defaults: {
            "car":new Car()
        }
    });

    return Bar;


});
