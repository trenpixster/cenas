(function () {
    'use strict';

    const utils = require('app/utils');

    function getValidTypes (click) {
        const types = [],
            { url } = click,
            hasData = Object.keys(click.payload.attrs).some((attr) => attr.indexOf('data-') === 0);

        if (hasData) {
            types.push({
                name: 'From data attributes',
                value: 'dynamic-attribute'
            });
        }

        if (utils.query(url) !== '') {
            types.push({
                name:  'From url query',
                value: 'location-query'
            });
        }

        return types;
    }

    function getTypes (click) {
        return [{
            name: 'From element attributes',
            value: 'attribute'
        }, {
            name:  'From clickable element path',
            value: 'href-path'
        }, {
            name: 'From url path',
            value: 'location-path'
        }].concat(getValidTypes(click)).concat([{
            name: 'From fixed value',
            value: 'fixed'
        }]);
    }

    module.exports = function eventTracking (click) {
        const types = getTypes(click);

        return [{
            name:      'Category',
            value:     'category',
            types:     types,
            mandatory: true
        }, {
            name:      'Action',
            value:     'action',
            types:     types,
            mandatory: true
        }, {
            name:  'Label',
            value: 'label',
            types: types
        }, {
            name:  'Value',
            value: 'value',
            types: types
        }];
    };
}());
