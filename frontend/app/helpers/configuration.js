(function ($) {
    'use strict';

    const utils = require('app/utils'),
        valueTemplate = require('app/templates/type-value.hbs'),
        multipleValueTemplate = require('app/templates/type-value-multiple.hbs');

    function getAttributes (attrs, filter = () => { true }, cb = () => {}) {
        return Object.keys(attrs).filter(filter).reduce((result, name) => {
            const values = attrs[name];
            return result.concat(values.split(' ').map((value) => {
                return cb(name, value);
            }));
        }, [])
    }

    const typeHandler = {
        attribute (values) {
            return {
                type: 'fixed',
                value: Array.prototype.slice.call(values.find('select > option:selected'))
                            .filter((el) => $(el).val() !== '')
                            .map((el) => $(el).val()).join()
            }
        },

        fixed (values) {
            return {
                type:  'fixed',
                value: values.find('input').val()
            };
        },

        'dynamic-attribute' (values) {
            return {
                type:  'dynamic-attribute',
                value: values.find('select > option:selected').val()
            };
        },

        'location-path' (values) {
            return {
                type:  'location-path',
                value: values.find('select > option:selected').val()
            }
        },

        'href-path' (values) {
            return {
                type:  'href-path',
                value: values.find('select > option:selected').val()
            };
        },

        'location-query' (values) {
            return {
                type:  'location-query',
                value: values.find('select > option:selected').val()
            }
        }
    }

    const typeValue = {
        attribute (click) {
            const { attrs } = click.payload;
            return multipleValueTemplate({
                types: getAttributes(attrs, (name) => name.indexOf('data-') === -1, (name, value) => {
                    return {
                        name, value
                    };
                })
            });
        },

        'dynamic-attribute' (click) {
            const { attrs } = click.payload;
            return valueTemplate({
                title: 'Choose your option',
                types: getAttributes(attrs, (name) => name.indexOf('data-') === 0, (name) => {
                    return {
                        name,
                        value: name
                    }
                })
            })
        },

        'location-path' (click, path = '/path/to/path/you/get/somewhere') {
            return valueTemplate({
                title: path,
                types: path.split('/').slice(1).map((name, value) => {
                    return {
                        value: `${value}`,
                        name:  `Level ${value + 1}: ${name}`
                    };
                })
            });
        },

        'href-path' (click) {
            const { clickableLink } = click.payload;
            return this['location-path'](click, utils.pathname(clickableLink));
        },

        'location-query' (click) {
            const qs = utils.query(click.url),
                obj  = utils.qsToObj(qs);
            return valueTemplate({
                title: qs,
                types: Object.keys(obj).map((name) => {
                    return {
                        value: name,
                        name
                    };
                })
            });
        },

        fixed () {
            return $('<input type="text" class="validate" placeholder="Your value">').prop('outerHTML');
        }
    };

    function trackable () {
        $.content.find('[data-trackable]').change((ev) => {
            const $target = $(ev.target);
            if ($target.find(':selected').data('custom') === '') {
                $target.parent().siblings('[data-custom-value]').removeClass('invisible');
            } else {
                $target.parent().siblings('[data-custom-value]').addClass('invisible');
            }
        });
    }

    function typeable (click) {
        $.content.find('[data-type]').change((ev) => {
            const $target = $(ev.target),
                option = $target.find(':selected').val(),
                $typeValue = $target.parent().siblings('[data-type-value]');

            if (!$typeValue.hasClass('invisible')) {
                $typeValue.find('select').material_select('destroy');
            }

            $typeValue.removeClass('invisible')
                    .html(typeValue[option](click))
                    .find('select')
                    .material_select();
        });
    }

    function getTrigger () {
        const $trigger = $.content.find('#trigger'),
            $locationOnly = $trigger.find('#location-only'),
            rules = Array.prototype.slice.call($trigger.find('#rules [type=checkbox]')).filter((el) => $(el).is(':checked')).map((el) => {
                const $el      = $(el),
                    $siblings  = $el.parent().siblings(),
                    $trackable = $siblings.find('[data-trackable]'),
                    isCustom   = $trackable.find(':selected').data('custom') === '';
                return {
                    attribute: $el.val(),
                    operator:  $siblings.find('[data-operator]').val(),
                    value:     isCustom ? $($siblings[2]).val() : $trackable.val()
                };
            });

        return rules.length === 0 ? false : {
            location_only: $locationOnly.is(':checked'),
            location: $locationOnly.val(),
            logic_operator: $.content.find('#operator').val(),
            rules
        };
    }

    function getAction () {
        const $types = $.content.find('[data-action-type-values]'),
            payload = Array.prototype.slice.call($types.find('[data-type]')).reduce((result, el) => {
                const $el      = $(el),
                    type       = $el.find(':selected').val(),
                    handleType = $el.data('type'),
                    $values    = $el.parent().siblings('[data-type-value]');

                if (typeHandler.hasOwnProperty(type)) {
                    result[handleType] = typeHandler[type]($values);
                }

                return result;
            }, {}),
            mandatoryFilled = ['category', 'action'].every((mandatory) => (payload[mandatory] || {}).value);
        debugger;
        return Object.keys(payload).length === 0 || !mandatoryFilled ? false : {
            type: $.content.find('#action-type').val(),
            payload
        };
    }

    function saveable (click, user, success) {
        const mandatory = ['title', 'trigger', 'action'];
        const validConfig = (values) => mandatory.every((field) => values[field] !== false);
        $.content.find('[data-save]').on('click', () => {
            mandatory.forEach((el) => $.content.find(`[data-${el}-message]`).addClass('hide'));

            const values = {
                click_id: click.id,
                title:    $.content.find('#title').val() || false,
                nfa_id:   user.id,
                trigger:  getTrigger(),
                action:   getAction()
            };

            if (validConfig(values)) {
                success(values);
            } else {
                mandatory.filter((el) => values[el] === false).forEach((el) => {
                    $.content.find(`[data-${el}-message]`).removeClass('hide');
                });
            }
        });
    }

    module.exports = {
        start (click) {
            trackable();
            typeable(click);
            saveable(...arguments);
        },

        end () {
            $.content.find('[data-trackable]').off('change');
            $.content.find('[data-type]').off('change');
            $.content.find('[data-save]').off('click');
        }
    }
}(window.jQuery))
