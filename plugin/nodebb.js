(function (Module, NodeBB) {
    'use strict';

    Module.exports = {
        db           : NodeBB.require('./src/database'),
        pluginSockets: NodeBB.require('./src/socket.io/plugins'),
        user         : NodeBB.require('./src/user')
    };
})(module, require.main);
