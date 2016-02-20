(function () {
    'use strict';

    const Handlebars = require('hbsfy/runtime');
    Handlebars.registerHelper('size-of', (arr) => arr.length);
}());
