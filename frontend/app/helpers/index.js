(function () {
    'use strict';

    const Handlebars = require('hbsfy/runtime');

    Handlebars.registerHelper('operator', (trigger) => trigger.logic_operator === 'and' ? 'Every' : 'Any');
    Handlebars.registerHelper('size-of', (arr) => arr.length);

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

    Handlebars.registerHelper('event-type', (action) => {
        const types = {
            'event-tracking': 'Event Tracking'
        };
        return types.hasOwnProperty(action.type) ? `(${types[action.type]})` : '';
    });

    Handlebars.registerHelper('actions', (action, options) => {
        const types = {
            fixed: 'is',
            'location-path': 'from URL path level ',
            'location-query': 'from URL query ',
            'dynamic-attribute': 'from data attribute '
        }
        return Object.keys(action).map((key) => {
            const values = action[key];
            return options.fn({
                attribute: key,
                type:      types[values.type],
                value:     values.value
            });
        }).join('');
    });



    Handlebars.registerHelper('preview', (html) => {
        html = Handlebars.Utils.escapeExpression(html);
        return new Handlebars.SafeString(html);
    });
}())
