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
                const $card = $(ev.target).closest('.card'),
                    $content = $card.find('.card-content'),
                    $action = $card.find('.card-action');

                setTimeout(() => {
                    $card.velocity({ height: `${$content.prop('scrollHeight') + $action.prop('scrollHeight')}}px` }, {
                        duration: 300, queue: false, easing: 'easeInOutQuad'
                    });
                }, 300);
            });
        },

        destroy () {
            $(document).off('click', '.card-reveal');
        }
    }
}(window.jQuery))
