(function ($) {
    'use strict';

    const template = require('app/templates/dashboard.hbs');
    module.exports = function dashboard () {
        $.content.html(template());
        $.get('/default_user').then((user) => {
            $.content.html(template(user));

            const $googleId = $('#google-id');
            $googleId.focus();

            const $tid = $.content.find('#update-tid');
            $tid.click(function() {
                $tid.addClass('disabled');
                $.post('/update_tid', { tid: $googleId.val() }).then(function() {
                    $tid.removeClass('disabled');
                    $tid.text('Saved!');
                    setTimeout(function() { $tid.text('Save'); }, 1000);
                });
            });
        });
    };
}(window.jQuery));
