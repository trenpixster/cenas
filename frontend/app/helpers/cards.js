(function ($) {
    'use strict';

    module.exports = {
        init () {
            $.content.find('.activator').on('click', (ev) => {
                const $card = $(ev.target).closest('.card'),
                    $reveal = $card.find('.card-reveal');

                setTimeout(() => {
                    $card.velocity({ height: `${$reveal.prop('scrollHeight')}px` }, { duration: 300, queue: false, easing: 'easeInOutQuad' });
                }, 300);
            });

            $(document).on('click', '.card-reveal', (ev) => {
                const $card = $(ev.target).closest('.card');
                setTimeout(() => {
                    $card.velocity({ height: '151px' }, { duration: 300, queue: false, easing: 'easeInOutQuad' });
                }, 300);
            });
        },

        destroy () {
            $(document).off('click', '.card-reveal');
        }
    }
}(window.jQuery))
