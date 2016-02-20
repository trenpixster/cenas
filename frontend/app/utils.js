(function ($) {
    'use strict';

    module.exports =  {
        pathname: (href) => $('<a>', { href } )[0].pathname,
        query: (href) => $('<a>', { href })[0].search,
        qsToObj (qs) {
            const pairs = qs.slice(1).split('&');
            return pairs.reduce((result, pair) => {
                pair = pair.split('=');
                result[pair[0]] = decodeURIComponent(pair[1] || '');
                return result;
            }, {});
        }
    };
}(window.jQuery))
