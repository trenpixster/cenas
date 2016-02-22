(function ($) {
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
            'href-path': 'from clickable element path level ',
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

    Handlebars.registerHelper('has-default', (key, value, trackable, options) => {
        if (trackable.hasDefaults && trackable.default[key] === value) {
            return options.fn();
        }
        return;
    });

    Handlebars.registerHelper('preview', (html) => {
        html = Handlebars.Utils.escapeExpression(html);
        return new Handlebars.SafeString(html);
    });

    Handlebars.registerHelper('display', (click, options) => {
        const { payload } = click,
            srcRegex = /src="([\/a-zA-Z0-9-_\.]+)"/,
            values   = payload.target.match(srcRegex),
            path     = values === null ? '' : values[1],
            hasStyles = payload.styles && !Array.isArray(payload.styles);

        if (values) {
            const href = $('<a>', { href: click.url } )[0],
                port = href.port ? `:${href.port}` : '';
            payload.target = payload.target.replace(srcRegex, `src="${href.protocol}//${href.hostname}${port}${path}"`);
        }

        return options.fn({
            html: new Handlebars.SafeString(hasStyles ? $(payload.target).css(Object.assign(payload.styles, {
                maxWidth: '200px',
                cursor:   'default',
                outline:  'none'
            })).prop('outerHTML') : payload.target),
            hasStyles
        });
    })
}(window.jQuery))
