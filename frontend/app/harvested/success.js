(function ($) {
    'use strict';

    const template = require('app/templates/success.hbs');
    module.exports = function success () {
        $.content.html(template({
            message: 'You have successfuly configured your harvested click.',
            continue: {
                url:   '/dashboard/harvested',
                title: 'Continue'
            },

            back: {
                url:   '/dashboard/rules',
                title: 'Check Rules'
            }
        }));
    };
}(window.jQuery));
