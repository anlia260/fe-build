/**
 * app入口文件
 */
var $ = require('jquery');
var _ = window._ = require('underscore');
var Backbone = require('backbone');
var root = 'modules';
require('modules/conf/lang');
require('modules/conf/util');

var Router = Backbone.Router.extend({
    routes: {
        "": "index",
        ":module": 'loadModule'
    },
    initialize: function () {
        this.$container = $('#js-container');
    },
    index: function () {
        this.loadModule('index');
    },
    loadModule: function (name) {
        var path = [root, 'page', name, 'main'].join('/');
        var id = ['page', name].join('_');
        var $container = this.$container;
        var $el = $('#'+id);
        if(!$el.length){
            $el = $('<div id="'+id+'"></div>').appendTo($container);
        }
        require.async(path, function (callback) {
            if(!_.isFunction(callback)){
                return;
            }
            $container.children().hide();
            if(!App.Views[id]){
                App.Views[id] = callback({
                    el: $el
                });
            }
            $el.show()
        });
    }
});

var App = window.App = {
    Views:{},
    initialize: function () {
        this.router = new Router();
        Backbone.history.start();
        return this;
    }
};

module.exports = App.initialize();
