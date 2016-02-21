(function ($) {
    'use strict';

    const state = require('app/state');
    module.exports = function getRules (ctx, next) {
        $.get('/rules').then((rules) => {
            ctx.rules = rules;
            state.save('rules', rules);
            next();
        });
    }
}(window.jQuery))
