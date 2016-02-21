(function ($) {
    'use strict';

    module.exports = function getClick (ctx, next) {
        const rule = ctx.rule;
        if (!rule) {
            return next();
        }

        const { click_id } = rule;
        $.get(`/clicks/${click_id}`).then((click) => {
            ctx.click = click;
            next();
        });
    }
}(window.jQuery))
