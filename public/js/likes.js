/* globals define, app, ajaxify, bootbox, socket, templates, utils */

$(document).ready(function () {
    'use strict';

    require([
        'translator'
    ], function (translator) {

        var events       = {
                'event:voted' : likesDidUpdate,
                'posts.upvote': likeDidChange,
                'posts.unvote': likeDidChange
            },

            components   = {
                COUNT_BUTTON : 'ns/likes/count',
                MORE         : 'ns/likes/more',
                TOGGLE_BUTTON: 'ns/likes/toggle',
                USER_LIST    : 'ns/likes/users'
            },

            previewLimit = 3,
            Color        = net.brehaut.Color,
            initColor    = Color('#9E9E9E'),
            targetColor  = Color('#4CAF50'),
            totalToColor = 8;

        $(window).on('action:ajaxify.start', function (ev, data) {
            if (ajaxify.currentPage !== data.url) {
                setSubscription(false);
            }
        });

        $(window).on('action:topic.loading', function (e) {
            //To be sure, that we subscribed only once
            setSubscription(false);
            setSubscription(true);
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

            $countButtons.each(function (index, el) {
                var $el = $(el);
                evaluateVotesNumber($el, parseInt($el.text()));
            });
        }

        function entitiesToAvatars(users) {
            function avatar(user) {
                var avatar = '';
                if (user.picture) {
                    avatar = '<div class="ns-likes-avatar" data-original-title="' + user.username + '"><img class="ns-likes-image img-responsive" component="user/picture" data-uid="' + user.uid + '" src="' + user.picture + '" align="left" itemprop="image" /></div>';
                } else {
                    avatar = '<div class="ns-likes-avatar" data-original-title="' + user.username + '"><div class="ns-likes-icon" component="user/picture" data-uid="' + user.uid + '" style="background-color: ' + user['icon:bgColor'] + ';">' + user['icon:text'] + '</div></div>';
                }
                return avatar;
            }

            return users.map(function (user) {
                return '<a href="' + ajaxify.data.relative_path + '/user/' + user.userslug + '">' + avatar(user) + '</a>';
            }).join('');
        }

        function entitiesToHtml(users) {
            return users.map(function (user) {
                return '<a href="' + ajaxify.data.relative_path + '/user/' + user.userslug + '">' + user.username + '</a>';
            }).join(', ');
        }

        function evaluateVotesNumber($button, votes) {
            $button.css(
                'color',
                initColor.blend(targetColor, votes / totalToColor).toCSS());
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
            var button = getComponentByPostId(data.post.pid, components.COUNT_BUTTON);
            button.data('likes', votes).text(votes);
            evaluateVotesNumber(button, votes);
            //TODO Re-render list only if user is interested in it
            //showVotersFor(data.post.pid);
        }

        function renderVoters(pid, voters, total) {
            var excluded = total - voters.length;
            var $userList = getComponentByPostId(pid, components.USER_LIST);
            if (excluded > 0) {
                translator.translate('[[nslikes:and]]', function (andText) {
                    translator.translate('[[nslikes:others]]', function (othersText) {
                        $userList.html(entitiesToHtml(voters) + ' ' + andText + ' ' + '<a href="#" component="ns/likes/more" class="ns-likes-more">' + excluded + ' ' + othersText + '</a>');
                        getComponentByPostId(pid, components.MORE).on('click', function (e) {
                            socket.emit(
                                'plugins.ns-likes.getVoters',
                                {pid: pid, from: previewLimit},
                                function (error, result) {
                                    if (!error && result.total) {
                                        translator.translate('[[nslikes:liked_by]]', function (title) {
                                            bootbox.dialog({
                                                title   : title,
                                                onEscape: true,
                                                backdrop: false,
                                                message : '<div class="ns-likes-list">' + entitiesToAvatars(result.users) + '</div>'
                                            });
                                            // Show Usernames as tooltips
                                            $('.ns-likes-list').find('.ns-likes-avatar').tooltip();
                                        });
                                    }
                                });
                        });
                    });
                });
            } else {
                $userList.html(entitiesToHtml(voters));
            }

            $userList
                .css('opacity', 0)
                .animate({'opacity': 1}, 200);
        }

        function showVotersFor(pid) {
            socket.emit(
                'plugins.ns-likes.getVotersShort',
                {pid: pid, limit: previewLimit},
                function (error, result) {
                    if (!error && result.total) {
                        renderVoters(pid, result.users, result.total);
                    }
                });
        }

        function setSubscription(state) {
            var method = state ? 'on' : 'removeListener';
            for (var socketEvent in events) {
                socket[method](socketEvent, events[socketEvent]);
            }
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
    });
});
