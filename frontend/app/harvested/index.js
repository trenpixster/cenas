(function ($) {
    'use strict';
    const page = require('page');

    function setup () {
        $('.preview').on('click', (ev) => {
            ev.preventDefault();

            const $sibling = $(ev.target).parent().siblings('pre');
            $sibling.toggleClass('hide');
        });
        $('.js-ignore-rule').on('click', (ev) => {
            ev.preventDefault();
            const ruleId = $(ev.target).attr('data-rule-id');
            $(ev.target).addClass('disabled');
            $.post('/click/ignore', { click_id: ruleId })
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
