(function ($) {
    'use strict';

    const state = require('app/state');

    const fetch = (ignored) => $.get(ignored ? '/clicks/ignored' : '/clicks').done((clicks) => state.save('clicks', clicks));

    module.exports = function getHarvested (ctx, next) {
        const $card = $.content.find(`.card[data-harvested]`),
            ignored = ctx.query.view === 'ignored';
        $card.addClass('loading');
        fetch(ignored).done((clicks) => {
            ctx.clicks = clicks;
            $card.removeClass('loading');
            next();
        });
    };

    module.exports.fetch = fetch;
}(window.jQuery));
