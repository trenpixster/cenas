(function () {
    'use strict';

    const Handlebars = require('hbsfy/runtime');
    Handlebars.registerHelper('preview', (html) => {
        html = Handlebars.Utils.escapeExpression(html);
        return new Handlebars.SafeString(html);
    });
}());
