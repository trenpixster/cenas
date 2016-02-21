(function ($) {
    'use strict';
    const page = require('page');

    const template = require('app/templates/harvested.hbs'),
        cardsTemplate = require('app/templates/partials/harvested-cards.hbs'),
        cards = require('app/helpers/cards');

    let isHarvest = true;

    function fetchData () {
        const url = isHarvest ? '/clicks' : '/clicks/ignored',
            title = isHarvest ? 'Harvested Clicks' : 'Ignored Clicks';
        $.get(url).then((clicks) => {
            $.content.find('.title').text(title);
            $.content.find('.card-container').html(cardsTemplate({ clicks }))
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

    function setup () {
        cards.init();
        $.content.find('input[type="checkbox"]').on('change', () => {
            isHarvest = !isHarvest;
            fetchData();
        });
    }

    module.exports = {
        enter (ctx) {
            $.content.html(template({ clicks: ctx.clicks }));
            setup();
        },

        exit (ctx, next) {
            cards.destroy();
            next();
        }
    };
}(window.jQuery));
