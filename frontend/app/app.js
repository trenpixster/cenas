require('./shim');

(function ($) {
	'use strict';

    require('app/helpers');

    const page = require('page');
    $.content = $('.content');
    page('/', require('app/dashboard'));
    page('/dashboard', require('app/dashboard'));
    page('/dashboard/harvested', require('app/middlewares/harvested/get-harvested'), require('app/harvested'));
    page('/dashboard/harvested/:id', require('app/middlewares/harvested/configure-harvest'), require('app/harvested/configure').enter);
    page.exit('/dashboard/harvested/:id', require('app/harvested/configure').exit);
    page({
        hashbang: true
    });
}(window.jQuery));
