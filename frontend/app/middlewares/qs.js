(function () {
    'use strict';

    module.exports = function querystring (ctx, next) {
        const qs = ctx.querystring;
        ctx.query = qs.split('&').reduce((result, query) => {
            const [key, val] = query.split('=');
            result[key] = val;
            return result;
        }, {});
        next();
    }
}());
