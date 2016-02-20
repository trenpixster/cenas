(function ($) {
    'use strict';

    function setup () {
        $('.preview').on('click', (ev) => {
            ev.preventDefault();

            const $sibling = $(ev.target).parent().siblings('pre');
            $sibling.toggleClass('hide');
        });
    }

    const template = require('app/templates/harvested.hbs');
    module.exports = function harvested (ctx) {
        $.content.html(template({ clicks: ctx.clicks }));
        setup();
    };
}(window.jQuery));
