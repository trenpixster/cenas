(function ($) {
    'use strict';

    const template = require('app/templates/dashboard.hbs');
    module.exports = function dashboard () {
        $.content.html(template());
        $.get('http://localhost:4000/default_user').then((user) => {
          $.content.html(template(user));
          $('#google-id').focus();

          $.content.find('#update-tid').click(function() {
            $('#update-tid').addClass('disabled');
            $.post('/update_tid', {tid: $('#google-id').val()})
            .then(function() {
              $('#update-tid').removeClass('disabled');
              $('#update-tid').text('Saved!');
              setTimeout(function() { $('#update-tid').text('Save'); }, 1000);
            });
          });

        });
    };
}(window.jQuery));
