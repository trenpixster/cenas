(function ($) {
    'use strict';

    const state = require('app/state');
    module.exports = function getHarvested (ctx, next) {
        const $card = $.content.find(`.card[data-harvested]`);
        $card.addClass('loading');
        $.get('http://localhost:4000/clicks').then((clicks) => {
            ctx.clicks = clicks;
            state.save('clicks', clicks);
            $card.removeClass('loading');
            next();
        });
    };
}(window.jQuery));
