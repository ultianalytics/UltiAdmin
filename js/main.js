require.config({
    baseUrl: 'js',
    shim : {
        "bootstrap" : { "deps" :['jquery'] }
    },
    paths: {
        "jquery": "lib/jquery-1.11.3",
        "underscore": "lib/underscore",
        "backbone": "lib/backbone",
        "bootstrap": "lib/bootstrap/bootstrap",
        "bootbox": "lib/bootbox"
    }
});

require(['bootstrap'], function() {
});

require(['app'], function(App) {
    App.initialize();
});
