require.config({
    baseUrl: 'js',
    waitSeconds : 60,
    shim : {
        "bootstrap" : { "deps" :['jquery'] },
        "q" : {}
    },
    paths: {
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min",
        "underscore": "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
        "backbone": "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.3/backbone-min",
        "bootstrap": "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min",
        "bootbox": "https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min",
        "q": "https://cdnjs.cloudflare.com/ajax/libs/q.js/1.4.1/q.min"
    }
});

require(['app'], function(App) {
    App.initialize();
});
