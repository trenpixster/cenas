(function () {
    'use strict';

    const state = {};
    module.exports = {
        save (name, value) {
            state[name] = value;
        },

        get (name) {
            return state[name];
        }
    }
}());
