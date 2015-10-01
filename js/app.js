define(['jquery', 'underscore', 'backbone', 'models/foo'],
    function($, _, Backbone, Foo) {
    return {initialize : function() {

        var foo = new Foo();

        console.log(foo.get('bar').get('car').get('model'));

    }};
});