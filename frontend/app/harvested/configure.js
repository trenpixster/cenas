(function ($) {
    'use strict';

    const page = require('page'),
        eventTracking = require('app/helpers/event-tracking'),
        utils = require('app/utils'),
        configuration = require('app/helpers/configuration'),
        template = require('app/templates/configure-harvest.hbs');

    function getTrackable (click) {
        const { attrs } = click.payload;
        return Object.keys(attrs).map((attr) => {
            return {
                name:   attr,
                values: attrs[attr].split(' ').filter((value) => value !== '')
            }
        });
    }

    function save (click) {
        return (values) => {
            $.ajax({
                url:         '/rule',
                type:        'POST',
                data:        JSON.stringify(values),
                dataType:    'json',
                contentType: 'application/json'
            }).then(() => {
                page.redirect(`/dashboard/harvested/${click.id}/success`);
            });
        }
    }

    function setup (click, user) {
        $('select').material_select();
        configuration.start(click, user, save(click));
    }

    module.exports = {
        enter (ctx) {
            const { click, user } = ctx,
                { url } = click,
                index = url.indexOf(utils.query(click.url)),
                harvested = Object.assign({}, click, {
                    trackable:  getTrackable(click),
                    parameters: eventTracking(click),
                    parsedUrl:  index > 0 ? url.slice(0, index) : url
                });

            $.content.html(template(harvested));
            setup(click, user);
        },

        exit (ctx, next) {
            $('select').material_select('destroy');
            configuration.end();
            next();
        }
    };
}(window.jQuery));
