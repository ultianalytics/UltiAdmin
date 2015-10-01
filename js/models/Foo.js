define(['jquery', 'underscore','backbone', 'models/bar'], function($, _, Backbone, Bar) {

    var Foo = Backbone.Model.extend({
        defaults: {
            "bar":new Bar()
        }
    });

    return Foo;

});

