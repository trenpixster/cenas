(function ($) {
    'use strict';

    const chunks = require('lodash.chunk'),
        template = require('app/templates/rules.hbs'),
        cards = require('app/helpers/cards'),
        page = require('page');

    function setup () {
        $.content.find('[data-delete]').on('click', (ev) => {
            const $target = $(ev.target),
                ruleId = $target.data('delete');
            ev.preventDefault();
            $target.addClass('disabled');
            $.ajax({
                type:        'DELETE',
                url:         '/rule',
                data:        JSON.stringify({ rule_id: ruleId }),
                contentType: 'application/json',
                dataType:    'json'
            }).then(() => {
                $target.removeClass('disabled');
                page.redirect('/dashboard/rules');
            });
        });

        cards.init();
    }

    module.exports = {
        enter (ctx) {
            const { rules } = ctx;
            $.content.html(template({ rows: chunks(rules, 2) }));
            setup();
        },

        exit (ctx, next) {
            cards.destroy();
            $.content.find('[data-delete]').off('click');
            next();
        }
    };
}(window.jQuery))
