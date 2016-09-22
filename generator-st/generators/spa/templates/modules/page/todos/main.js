var AppView = require('./view/app');

module.exports = function (options) {
    // Finally, we kick things off by creating the **App**.
    return new AppView(options);
};
