(function ($) {
    'use strict';

    const template = require('app/templates/rules.hbs'),
        cards = require('app/helpers/cards');

    module.exports = {
        enter (ctx) {
            const { rules } = ctx;
            $.content.html(template({ rules }));
            cards.init();
        },

        exit (ctx, next) {
            cards.destroy();
            next();
        }
    };
}(window.jQuery))
