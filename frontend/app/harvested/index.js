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
            $.content.find('.card-container').html(cardsTemplate({ clicks, isHarvest }))
        });
    }

    function setup () {
        cards.init();
        $(document).on('change', 'input[type="checkbox"]', () => {
            isHarvest = !isHarvest;
            fetchData();
        });

        $(document).on('click', '.js-ignore-click', (ev) => {
            ev.preventDefault();
            const clickId = $(ev.target).data('click-id');
            $(ev.target).addClass('disabled');
            $.post('/click/ignore', { click_id: clickId }).then(() => {
                  $(ev.target).removeClass('disabled');
                  page.redirect('/dashboard/harvested');
            });
        });
    }

    module.exports = {
        enter (ctx) {
            $.content.html(template({ clicks: ctx.clicks, isHarvest }));
            setup();
        },

        exit (ctx, next) {
            cards.destroy();
            $(document).off('click', '.js-ignore-click');
            $(document).off('change', 'input[type="checkbox"]');
            next();
        }
    };
}(window.jQuery));
