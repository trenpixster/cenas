(function ($) {
    'use strict';
    const page = require('page');

    function setup () {
        $('.preview').on('click', (ev) => {
            ev.preventDefault();

            const $sibling = $(ev.target).parent().siblings('pre');
            $sibling.toggleClass('hide');
        });
        $('.js-ignore-click').on('click', (ev) => {
            ev.preventDefault();
            const clickId = $(ev.target).attr('data-click-id');
            $(ev.target).addClass('disabled');
            $.post('/click/ignore', { click_id: clickId })
             .then(() => {
                  $(ev.target).removeClass('disabled');
                  page.redirect('/dashboard/harvested');
            });
        });
    }

    const template = require('app/templates/harvested.hbs');
    module.exports = function harvested (ctx) {
        $.content.html(template({ clicks: ctx.clicks }));
        setup();
    };
}(window.jQuery));
