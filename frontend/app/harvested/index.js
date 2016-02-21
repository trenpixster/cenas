(function ($) {
    'use strict';

    const page = require('page'),
        template = require('app/templates/harvested.hbs'),
        cards = require('app/helpers/cards');

    let isHarvest;

    const getTitle = () => isHarvest ? 'Harvested Clicks' : 'Ignored Clicks';

    function setup () {
        cards.init();
        $.content.find('input[type="checkbox"]').on('change', () => {
            isHarvest = !isHarvest;
            page.redirect(`/dashboard/harvested?view=${isHarvest ? 'harvested' : 'ignored'}`);
        });

        $.content.find('[data-ignore]').on('click', (ev) => {
            ev.preventDefault();
            const $target = $(ev.target),
                clickId = $target.data('ignore');
            $target.addClass('disabled');
            $.post('/click/ignore', { click_id: clickId }).then(() => {
                $target.removeClass('disabled');
                page.redirect('/dashboard/harvested');
            });
        });

        $.content.find('[data-unignore]').on('click', (ev) => {
            ev.preventDefault();
            const $target = $(ev.target),
                clickId = $(ev.target).data('unignore');
            $target.addClass('disabled');
            $.ajax({
                url:         '/click/ignore',
                method:      'delete',
                data:        JSON.stringify({ click_id: clickId }),
                contentType: 'application/json',
                dataType:    'json'
            }).then(() => {
                $target.removeClass('disabled');
                page.redirect('/dashboard/harvested?view=ignored');
            })
        });
    }

    module.exports = {
        enter (ctx) {
            isHarvest = ctx.query.view !== 'ignored';
            $.content.html(template({ clicks: ctx.clicks, isHarvest, title: getTitle() }));
            setup();
        },

        exit (ctx, next) {
            cards.destroy();
            $.content.find('[data-ignore]').off('click');
            $.content.find('[data-unignore]').off('click');
            $.content.find('input[type="checkbox"]').off('change');
            next();
        }
    };
}(window.jQuery));
