var $ = require('jquery');
var hello = require('../hello/hello');
$.ajax({
    url:'/api/hello',
    success: function (res) {
        res = res || {};
        if(res.status == 'success'){
            var data = res.data || {};
            $('#hello').html(hello(data.msg));
        }
    }
})
