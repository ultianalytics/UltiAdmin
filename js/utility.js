define(['jquery'], function($) {
    // TODO...don't use global functions

    isEmpty = function(string) {
        return string == null || $.trim(string).length == 0;
    };

    return {
        noArgsNoReturnFunction:function() {}
    };

});