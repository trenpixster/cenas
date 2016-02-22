(function ($) {
    'use strict';

    const page = require('page'),
        chunks = require('lodash.chunk'),
        template = require('app/templates/harvested.hbs'),
        cardsTemplate = require('app/templates/harvested-cards.hbs'),
        cards = require('app/helpers/cards'),
        fetch = require('app/middlewares/harvested/get-harvested').fetch;

    let isHarvest;

    const getTitle = () => isHarvest ? 'Harvested Clicks' : 'Ignored Clicks';
    const templateIt = (template, clicks) => template({ rows: chunks(clicks, 3), isHarvest, title: getTitle() });

    function destroy () {
        cards.destroy();
        $.content.find('[data-ignore]').off('click');
        $.content.find('[data-unignore]').off('click');
        $.content.find('[data-refresh]').off('click');
        $.content.find('input[type="checkbox"]').off('change');
    }

    function setup () {
        cards.init();

        $.content.find('[data-refresh]').on('click', (ev) => {
            ev.preventDefault();
            const $container = $.content.find('.card-container');
            $container.addClass('loading');
            destroy();
            fetch(!isHarvest).then((clicks) => {
                $container.html(templateIt(cardsTemplate, clicks));
                $container.removeClass('loading');
            }).then(setup);
        });

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
            $.content.html(templateIt(template, ctx.clicks));
            setup();
        },

        exit (ctx, next) {
            destroy();
            next();
        }
    };
}(window.jQuery));
