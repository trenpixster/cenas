(function ($) {
    'use strict';

    const template = require('app/templates/rules.hbs'),
        cards = require('app/helpers/cards'),
        page = require('page');

    function setup () {
        $(document).on('click', '.js-rule-delete', (ev) => {
            const ruleId = $(ev.target).attr('data-rule-id');
            ev.preventDefault();
            $.ajax({type: 'DELETE', url: '/rule', data: { rule_id: ruleId }})
             .then(() => {
                  $(ev.target).removeClass('disabled');
                  page.redirect('/dashboard/rules');
            });
        });
    }

    module.exports = {
        enter (ctx) {
            const { rules } = ctx;
            $.content.html(template({ rules }));
            cards.init();
        },

        exit (ctx, next) {
            cards.destroy();
            $(document).off('click', '.js-rule-delete');
            next();
        }
    };
}(window.jQuery))
