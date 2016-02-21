(function ($) {
    'use strict';

    const state = require('app/state');
    module.exports = function configureHarvest (ctx, next) {
        const id = ctx.params.id,
            clicks = state.get('clicks');

        ctx.user = state.get('user');
        if (clicks) {
            ctx.click = clicks.find((click) => click.id === id);
            next();
        } else {
            $.get(`/clicks/${id}`).then((click) => {
                ctx.click = click;
                next();
            });
        }
    }
}(window.jQuery));
