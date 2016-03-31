(function (Plugin) {
    'use strict';

    var async  = require('async'),
        nodebb = require('./nodebb');

    var db              = nodebb.db,
        fields          = ['uid', 'username', 'userslug', 'picture', 'banned'],
        sockets         = nodebb.pluginSockets,
        socketNamespace = 'ns-likes',
        user            = nodebb.user;

    //NodeBB list of Hooks: https://github.com/NodeBB/NodeBB/wiki/Hooks
    Plugin.hooks = {
        statics: {
            load: function (params, callback) {
                var router      = params.router,
                    middleware  = params.middleware,
                    controllers = params.controllers;

                initSocket(callback);
            }
        }
    };

    function getUserIdentifiers(pid, callback) {
        var key = 'pid:' + pid + ':upvote';
        db.getSetMembers(key, function (error, result) {
            if (error || !Array.isArray(result) || !result.length) {
                return callback(error, []);
            }
            callback(null, result);
        });
    }

    function getUsers(ids, callback) {
        user.getUsersFields(ids, fields, callback);
    }

    function getVoters(socket, payload, callback) {
        getVotersSubList(payload['pid'], payload['from'], -1, callback);
    }

    /**
     * Returns only several users for the preview.
     *
     * @param socket
     * @param payload should include 'limit' and 'pid', where 'pid' - post identifier
     * @param callback map which includes properties: 'total' overall count of users in a result and 'users' list of users with limited field-set
     */
    function getVotersShort(socket, payload, callback) {
        getVotersSubList(payload['pid'], 0, payload['limit'], callback);
    }

    function getVotersSubList(pid, from, limit, callback) {
        var result = {
            total: 0,
            users: []
        }, len     = 0;

        async.waterfall([
            async.apply(getUserIdentifiers, pid),
            function (ids, next) {
                len = ids.length;
                result.total = len;

                // Check start
                if (from > 0 && from < len) {
                    ids = ids.slice(from);
                    len = ids.length;
                }

                // Apply limit
                if (limit > 0 && len > limit) {
                    ids = ids.slice(0, limit);
                }

                getUsers(ids, next);
            },
            function (users, next) {
                result.users = users;
                next(null, result);
            }
        ], callback);
    }

    function initSocket(callback) {
        sockets[socketNamespace] = {};

        //Acknowledgements
        sockets[socketNamespace].getVoters = getVoters;
        sockets[socketNamespace].getVotersShort = getVotersShort;

        callback();
    }

})(module.exports);
