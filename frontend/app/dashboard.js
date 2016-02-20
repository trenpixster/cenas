(function ($) {
    'use strict';

    const template = require('app/templates/dashboard.hbs');
    module.exports = function dashboard () {
        $.content.html(template());
    };
}(window.jQuery));
