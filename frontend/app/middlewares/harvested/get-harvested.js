(function ($) {
    'use strict';

    const state = require('app/state');
    module.exports = function getHarvested (ctx, next) {
        const $card = $.content.find(`.card[data-harvested]`),
            url = ctx.query.view === 'ignored' ? '/clicks/ignored' : '/clicks';

        $card.addClass('loading');
        $.get(url).then((clicks) => {
            ctx.clicks = clicks;
            state.save('clicks', clicks);
            $card.removeClass('loading');
            next();
        });
    };
}(window.jQuery));
