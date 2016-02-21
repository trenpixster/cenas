(function ($) {
    'use strict';

    const state = require('app/state');
    module.exports = function getRule (ctx, next) {
        const { id } = ctx.params;
        ctx.user = state.get('user');
        $.get(`/rules/${id}`).then((rule) => {
            ctx.rule = rule;
            next();
        });
    };
}(window.jQuery));
