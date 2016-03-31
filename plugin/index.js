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

    }

    /**
     * Returns only several users for the preview.
     *
     * @param socket
     * @param payload should include 'limit' and 'pid', where 'pid' - post identifier
     * @param callback map which includes properties: 'total' overall count of users in a result and 'users' list of users with limited field-set
     */
    function getVotersShort(socket, payload, callback) {
        var limit  = payload['limit'] || 3,
            result = {
                total: 0,
                users: []
            };
        async.waterfall([
            async.apply(getUserIdentifiers, payload['pid']),
            function (ids, next) {
                var len = ids.length;

                if (len > limit) {
                    ids = ids.slice(0, limit);
                }

                result.total = len;
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
