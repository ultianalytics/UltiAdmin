require.config({
    paths: {
        "jquery": "lib/jquery-1.11.3",
        "underscore": "lib/underscore",
        "backbone": "lib/backbone",
        "bootstrap": "lib/bootstrap/bootstrap",
        "bootbox": "lib/bootbox",
        "rest": "rest",
    }
});

require(['app'], function(App) {
    App.initialize();
});