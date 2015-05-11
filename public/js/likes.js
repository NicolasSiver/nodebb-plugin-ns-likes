/* globals define, app, ajaxify, bootbox, socket, templates, utils */

$(document).ready(function () {
    'use strict';

    require([
        'translator'
    ], function (translator) {

        var events      = {
            'event:voted' : likesDidUpdate,
            'posts.upvote': likeDidChange,
            'posts.unvote': likeDidChange
        }, components   = {
            TOGGLE_BUTTON: 'ns/likes/toggle',
            COUNT_BUTTON : 'ns/likes/count',
            USER_LIST    : 'ns/likes/users'
        }, previewLimit = 3;

        $(window).on('action:ajaxify.start', function (ev, data) {
            if (ajaxify.currentPage !== data.url) {
                toggleSubscription(false);
            }
        });

        $(window).on('action:topic.loading', function (e) {
            //To be sure, that we subscribed only once
            toggleSubscription(false);
            toggleSubscription(true);
            addListeners(
                $(getComponentSelector(components.TOGGLE_BUTTON)),
                $(getComponentSelector(components.COUNT_BUTTON))
            );
        });

        $(window).on('action:posts.loaded', function (e, data) {
            data.posts.forEach(function (post, index) {
                addListeners(
                    getComponentByPostId(post.pid, components.TOGGLE_BUTTON),
                    getComponentByPostId(post.pid, components.COUNT_BUTTON)
                );
            });
        });

        function addListeners($toggleButtons, $countButtons) {
            $toggleButtons.on('click', function (e) {
                var $el = $(this);
                toggleLike(getPostId($el), $el.hasClass('liked'));
            });

            $countButtons.on('click', function (e) {
                showVotersFor(getPostId($(this)));
            });
        }

        function getComponentByPostId(pid, componentType) {
            return $('[data-pid="' + pid + '"]').find(getComponentSelector(componentType));
        }

        function getComponentSelector(componentType) {
            return '[component="' + componentType + '"]';
        }

        function getPostId($child) {
            return $child.parents('[data-pid]').attr('data-pid');
        }

        /**
         * Triggered on like/unliked
         * @param data {object} Fields: {downvote:false,post:{pid:"14",uid: 4,votes:2},upvote:true,user:{reputation:3}}
         */
        function likeDidChange(data) {
            var label = data.upvote ? ' Unlike' : ' Like';
            getComponentByPostId(data.post.pid, components.TOGGLE_BUTTON).toggleClass('liked', data.upvote).text(label);
        }

        /**
         * Triggered on Like entity update
         * @param data {object} Same signature as for like/unliked handler
         */
        function likesDidUpdate(data) {
            var votes = data.post.votes;
            getComponentByPostId(data.post.pid, components.COUNT_BUTTON).text(votes).data('likes', votes);
            //TODO Re-render list only if user is interested in it
            //showVotersFor(data.post.pid);
        }

        function renderVoters($el, votersData) {
            var usernames = votersData.usernames, len = usernames.length, previewUsernames, renderNames, count = votersData.otherCount;
            if (len + count > previewLimit) {
                previewUsernames = usernames.slice(0, previewLimit);
                count = count + len - previewLimit;
                //Commas are not allowed from translation
                renderNames = previewUsernames.join(', ').replace(/,/g, '|');
                translator.translate('[[topic:users_and_others, ' + renderNames + ', ' + count + ']]', function (translated) {
                    translated = translated.replace(/\|/g, ',');
                    $el.text(translated);
                });
            } else {
                $el.text(usernames.join(', '));
            }

            $el
                .css('opacity', 0)
                .animate({'opacity': 1}, 200);
        }

        function showVotersFor(pid) {
            socket.emit('posts.getUpvoters', [pid], function (error, data) {
                if (!error && data.length) {
                    renderVoters(getComponentByPostId(pid, components.USER_LIST), data[0]);
                }
            });
        }

        function toggleLike(pid, liked) {
            socket.emit(liked ? 'posts.unvote' : 'posts.upvote', {
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
});