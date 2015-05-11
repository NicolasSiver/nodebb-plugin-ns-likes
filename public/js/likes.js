$(document).ready(function () {
    'use strict';

    $(window).on('action:ajaxify.contentLoaded', function(e, data) {
        if (data.tpl === 'topic') {
            console.log('[Likes] content loaded', data);
        }
    });
});