require('./shim');

(function ($) {
	'use strict';

    const page = require('page');
    $.content = $('.content');
    page('/', require('app/dashboard'));
    page('/dashboard', require('app/dashboard'));

    page({
        hashbang: true
    });
}(window.jQuery));
