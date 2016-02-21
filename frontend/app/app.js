require('./shim');

(function ($) {
	'use strict';

    require('app/helpers');

    const page = require('page'),
        state  = require('app/state');

    page('*', require('app/middlewares/qs'));

    $.content = $('.content');
    page('/', require('app/dashboard'));
    page('/dashboard', require('app/dashboard'));
    page('/dashboard/harvested', require('app/middlewares/harvested/get-harvested'), require('app/harvested').enter);
    page('/dashboard/harvested/:id', require('app/middlewares/harvested/get-harvest'), require('app/harvested/configure').enter);
    page('/dashboard/harvested/:id/success', require('app/harvested/success'));

    page('/dashboard/rules', require('app/middlewares/rules/get-rules'), require('app/rules').enter);
    page('/dashboard/rules/:id', require('app/middlewares/rules/get-rule'), require('app/middlewares/rules/get-click'), require('app/rules/edit').enter);
    page('/dashboard/rules/:id/success', require('app/rules/success'));

    page.exit('/dashboard/rules', require('app/rules').exit);
    page.exit('/dashboard/harvested', require('app/harvested').exit);
    page.exit('/dashboard/harvested/:id', require('app/harvested/configure').exit);

    $.get('/default_user').then((user) => {
        state.save('user', user);
        page({
            hashbang: true
        });
    })

}(window.jQuery));
