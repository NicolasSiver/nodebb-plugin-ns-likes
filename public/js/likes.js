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

        var events    = {
            'event:voted' : likesDidUpdate,
            'posts.upvote': likeDidChange,
            'posts.unvote': likeDidChange
        }, components = {
            TOGGLE_BUTTON: 'ns/likes/toggle',
            COUNT_BUTTON : 'ns/likes/count',
            USER_LIST    : 'ns/likes/users'
        };

        $(window).on('action:ajaxify.start', function (ev, data) {
            if (ajaxify.currentPage !== data.url) {
                toggleSubscription(false);
            }
        });

        $(window).on('action:topic.loading', function (e) {
            //To be sure, that we subscribed only once
            toggleSubscription(false);
            toggleSubscription(true);
            addListeners();
        });

        function addListeners() {
            $(getComponentSelector(components.TOGGLE_BUTTON)).on('click', function (e) {
                toggleLike($(this));
            });

            $(getComponentSelector(components.COUNT_BUTTON)).on('click', function (e) {
                showVotersFor($(this));
            });
        }

        function getComponentByPostId(pid, componentType) {
            return $('[data-pid="' + pid + '"]').find(getComponentSelector(componentType));
        }

        function getComponentSelector(componentType) {
            return '[component="' + components[componentType] + '"]';
        }

        /**
         * Triggered on like/unliked
         * @param data {object} Fields: {downvote:false,post:{pid:"14",uid: 4,votes:2},upvote:true,user:{reputation:3}}
         */
        function likeDidChange(data) {
            console.log('Like did change', data);
        }

        /**
         * Triggered on Like entity update
         * @param data {object} Same signature as for like/unliked handler
         */
        function likesDidUpdate(data) {
            var votes = data.post.votes;
            getComponentByPostId(data.post.pid, components.COUNT_BUTTON).text(votes).data('likes', votes);
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

            socket.emit($el.hasClass('liked') ? 'posts.unvote' : 'posts.upvote', {
                pid    : pid,
                room_id: app.currentRoom
            }, function (error) {
                if (error) {
                    app.alertError(error.message);
                }
            });
        }

        function toggleSubscription(state) {
            var method = state ? 'on' : 'removeListener';
            for (var socketEvent in events) {
                socket[method](socketEvent, events[socketEvent]);
            }
        }

    });

    //$(window).on('action:ajaxify.contentLoaded', function(e, data) {
    //    if (data.tpl === 'topic') {
    //        console.log('[Likes] content loaded', data);
    //    }
    //});
});