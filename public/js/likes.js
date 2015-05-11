/* globals define, app, ajaxify, bootbox, socket, templates, utils */

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

        var events = {
            'event:voted' : 'updatePostVotesAndUserReputation',
            'posts.upvote': 'togglePostVote',
            'posts.unvote': 'togglePostVote'
        };

        $(window).on('action:topic.loading', function (e) {
            addListeners();
        });

        function addListeners() {
            $('[component="ns/likes/toggle"]').on('click', function (e) {
                toggleLike($(this));
            });

            $('[component="ns/likes/vote-count"]').on('click', function (e) {
                showVotersFor($(this));
            });
        }

        function renderVoters($el, votersData) {
            var usernames = votersData.usernames;
            if (usernames.length) {
                $el.text(usernames.join(', '));
            }
        }

        function showVotersFor($el) {
            var pid = $el.parents('[data-pid]').attr('data-pid');

            socket.emit('posts.getUpvoters', [pid], function (error, data) {
                if (!error && data.length) {
                    renderVoters($el.closest('.ns-likes').find('.ns-likes-users'), data[0]);
                }
            });
        }

        function toggleLike($el) {
            var pid = $el.parents('[data-pid]').attr('data-pid');

            socket.emit($el.hasClass('upvoted') ? 'posts.unvote' : 'posts.upvote', {
                pid    : pid,
                room_id: app.currentRoom
            }, function (error) {
                if (error) {
                    app.alertError(error.message);
                }
            });
        }

    });

    //$(window).on('action:ajaxify.contentLoaded', function(e, data) {
    //    if (data.tpl === 'topic') {
    //        console.log('[Likes] content loaded', data);
    //    }
    //});
});