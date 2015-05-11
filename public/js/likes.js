$(document).ready(function () {
    'use strict';

    require([
        'translator'
    ], function (translator) {

        //$(window).on('action:posts.loaded', function (e, data) {
        //    data.posts.forEach(function (post, index) {
        //        drawRank($('[component="post/points"][data-pid="' + post.pid + '"]'), getSettings());
        //    });
        //});

        $(window).on('action:topic.loading', function (e) {
            addListeners();
        });

        function addListeners(){
            $('[component="ns/likes/toggle"]').on('click', function (e) {
                console.log('click');
            });

            $('[component="ns/likes/vote-count"]').on('click', function (e) {
                console.log('votes');
            });
        }

    });

    //$(window).on('action:ajaxify.contentLoaded', function(e, data) {
    //    if (data.tpl === 'topic') {
    //        console.log('[Likes] content loaded', data);
    //    }
    //});
});