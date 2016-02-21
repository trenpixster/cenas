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

    const validConfig = (values) => values.title !== false && values.trigger !== false && values.action !== false;
    function setupSave (click, user) {
        $.content.find('[data-save]').on('click', () => {
            ['trigger', 'action'].forEach((el) => {
                $.content.find(`[data-${el}-message]`).addClass('hide')
            });

            const values = {
                click_id: click.id,
                title:    $.content.find('#title').val() || false,
                nfa_id:   user.id, // get from /default_user,
                trigger:  configuration.getTrigger(),
                action:   configuration.getAction()
            };

            if (validConfig(values)) {
                $.ajax({
                    url:         '/rule',
                    type:        'POST',
                    data:        JSON.stringify(values),
                    dataType:    'json',
                    contentType: 'application/json'
                }).then(() => {
                    page.redirect(`/dashboard/harvested/${click.id}/success`);
                });
            } else {
                ['title', 'trigger', 'action'].filter((el) => values[el] === false).forEach((el) => {
                    $.content.find(`[data-${el}-message]`).removeClass('hide');
                });
            }
        });
    }

    function setup (click, user) {
        $('select').material_select();
        configuration.trackable();
        configuration.typeable(click);
        setupSave(click, user);
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

            console.log(click);
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
