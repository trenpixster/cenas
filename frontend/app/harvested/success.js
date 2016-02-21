(function ($) {
    'use strict';

    const template = require('app/templates/success.hbs');
    module.exports = function success () {
        $.content.html(template());
    };
}(window.jQuery));
