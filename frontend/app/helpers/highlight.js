(function () {
    'use strict';

    const Handlebars = require('hbsfy/runtime');
    Handlebars.registerHelper('highlight', (attrs) => {
        if (attrs.id) {
            return `#${attrs.id}`;
        } else if (attrs.class) {
            const [clazz] = attrs.class.split(' ');
            return `.${clazz}`;
        } else {
            const [attr] = Object.keys(attrs).filter((attr) => ['id', 'class'].indexOf(attr) === -1);
            return `[${attr}="${attrs[attr]}"]`
        }
    });
}());
