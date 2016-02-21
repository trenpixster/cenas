(function ($) {
    'use strict';

    const template = require('app/templates/success.hbs');
    module.exports = function editSuccess () {
        $.content.html(template({
            message: 'You have successfuly configured your rule.',
            continue: {
                url:  '/dashboard/rules',
                title: 'Check Rules'
            },

            back: {
                url: '/dashboard',
                title: 'Dashboard'
            }
        }))
    }
}(window.jQuery));
