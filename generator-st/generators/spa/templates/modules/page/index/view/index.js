var Backbone = require('backbone');
var tpl = require('../tpl/index.html');

var View = Backbone.View.extend({
    template: tpl,
    initialize: function () {
        this.render();
    },
    render: function () {
        this.$el.html(this.template());
    }
});

module.exports = View;
