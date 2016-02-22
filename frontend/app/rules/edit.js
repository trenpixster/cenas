(function ($) {
    'use strict';

    const page = require('page'),
        template = require('app/templates/edit-rule.hbs'),
        eventTracking = require('app/helpers/event-tracking'),
        utils = require('app/utils'),
        configuration = require('app/helpers/configuration');

    function getTrackable (click, rule) {
        const { attrs } = click.payload;
        return Object.keys(attrs).map((attr) => {
            const value = rule.trigger.rules.find((rule) => rule.attribute === attr),
                values = attrs[attr].split(' ').filter((value) => value !== ''),
                isCustom = value ? values.find((val) => val === value.value) === undefined : false;

            return {
                name:        attr,
                values, isCustom,
                default:     value,
                hasDefaults: value !== undefined
            }
        });
    }

    function getAttributes (attrs, filter = () => { true }, cb = () => {}) {
        return Object.keys(attrs).filter(filter).reduce((result, name) => {
            const values = attrs[name];
            return result.concat(values.split(' ').map((value) => {
                return cb(name, value);
            }));
        }, [])
    }

    const valuesFromAttributes = {
        attribute (click) {
            const { attrs } = click.payload;
            return getAttributes(attrs, (name) => name.indexOf('data-') === -1, (name, value) => {
                return { name, value };
            });
        },

        'dynamic-attribute' (click) {
            const { attrs } = click.payload;
            return getAttributes(attrs, (name) => name.indexOf('data-') === 0, (name, value) => {
                return { name, value }
            });
        },

        'location-path' (click, path = '/path/to/path/you/get/somewhere') {
            return path.split('/').slice(1).map((name, value) => {
                return {
                    value: `${value}`,
                    name:  `Level ${value + 1}: ${name}`
                };
            });
        },

        'href-path' (click) {
            const { clickableLink } = click.payload;
            return this['location-path'](click, utils.pathname(clickableLink));
        },

        'location-query' (click) {
            const qs = utils.query(click.url),
                obj  = utils.qsToObj(qs);
            return Object.keys(obj).map((name, value) => {
                return { value, name };
            });
        },

        fixed (click) {
            const { attrs } = click.payload;
            return getAttributes(attrs, (name) => name.indexOf('data-') === -1, (name, value) => {
                return { name, value };
            });
        }
    };


    function getDefaultActions (parameters, click, rule) {
        const { payload } = rule.action;
        return parameters.map((parameter) => {
            const { value, types } = parameter;
            if (payload.hasOwnProperty(value)) {
                const values = payload[value],
                    attrs = valuesFromAttributes[values.type](click),
                    attrValue = attrs.find((attr) => attr.value === values.value),
                    isFixed = values.type === 'fixed' && attrValue === undefined,
                    typeValues = types.map((type) => {
                        const { value } = type;
                        if (value === 'attribute') {
                            return Object.assign({ isSelected: !isFixed }, type);
                        }

                        if (value === 'fixed') {
                            return Object.assign({ isSelected: isFixed }, type);
                        }

                        return Object.assign({ isSelected: value === values.type }, type);
                    }),
                    selected = typeValues.find((type) => type.isSelected);

                return Object.assign({}, parameter, {
                    types:      typeValues,
                    isFixed:    isFixed,
                    paramValue: values.value,
                    hasValues:  true,
                    multi:      selected.type === 'attribute' && !isFixed,
                    values:     attrs.map((attr) => {
                        console.log(attr, values);
                        return Object.assign({
                            isSelected: attr.value === values.value
                        }, attr);
                    })
                });
            }

            return parameter;
        });
    }

    function setupSave (rule, click, user) {
        $.content.find('[data-save]').on('click', () => {
            const values = {
                click_id: click.id,
                title:    $.content.find('#title').val(),
                nfa_id:   user.id, // get from /default_user,
                trigger:  configuration.getTrigger(),
                action:   configuration.getAction()
            };

            if (values.trigger !== false && values.action !== false) {
                $.ajax({
                    url:         `/rules/${rule.id}`,
                    type:        'PUT',
                    data:        JSON.stringify(values),
                    dataType:    'json',
                    contentType: 'application/json'
                }).then(() => {
                    page.redirect(`/dashboard/rules/${rule.id}/success`);
                });
            }
        });
    }

    function setup (rule, click, user) {
        $('select').material_select();
        configuration.trackable();
        configuration.typeable(click);
        setupSave(rule, click, user);
    }

    module.exports = {
        enter (ctx) {
            const { click, rule, user } = ctx,
                { url } = click,
                index = url.indexOf(utils.query(click.url)),
                editable = Object.assign({}, { click }, {
                    rule,
                    isAnd:      rule.trigger.logic_operator === 'and',
                    trackable:  getTrackable(click, rule),
                    parameters: getDefaultActions(eventTracking(click), click, rule),
                    parsedUrl:  index > 0 ? url.slice(0, index) : url
                });

            console.log(editable);
            $.content.html(template(editable));
            setup(rule, click, user);
        },

        exit (ctx, next) {
            $('select').material_select('destroy');
            configuration.end();
            next();
        }
    };
}(window.jQuery))
