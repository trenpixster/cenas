require('./shim');

(function ($) {
	'use strict';

    require('app/helpers');

    const page = require('page'),
        state  = require('app/state');

    $.content = $('.content');
    page('/', require('app/dashboard'));
    page('/dashboard', require('app/dashboard'));
    page('/dashboard/harvested', require('app/middlewares/harvested/get-harvested'), require('app/harvested'));
    page('/dashboard/harvested/:id', require('app/middlewares/harvested/configure-harvest'), require('app/harvested/configure').enter);
    page('/dashboard/harvested/:id/success', require('app/harvested/success'));

    page('/dashboard/rules', require('app/middlewares/rules/get-rules'), require('app/rules').enter);

    page.exit('/dashboard/rules', require('app/rules').exit);
    page.exit('/dashboard/harvested/:id', require('app/harvested/configure').exit);

    $.get('/default_user').then((user) => {
        state.save('user', user);
        page({
            hashbang: true
        });
    })

}(window.jQuery));
