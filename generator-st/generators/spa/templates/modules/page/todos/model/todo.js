var _ = require('underscore');
var Backbone = require('backbone');
// Todo Model
// ----------

// Our basic **Todo** model has `title`, `order`, and `done` attributes.
var Todo = Backbone.Model.extend({

    // Default attributes for the todo item.
    defaults: function() {
        return {
            title: "empty todo...",
            order: 1,
            done: false
        };
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
        this.save({done: !this.get("done")});
    }

});

module.exports = Todo;
