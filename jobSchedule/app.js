var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    jobManager = require('./job_manager.js');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//HTTP server Listen
var server = app.listen(55555, function(){
    console.log('This server is running on the port ' + this.address().port );
});

var current_data = [];

app.get('/ws_broker', function(req, res){
    console.log('[GET] ws_broker');

    var est_exeTime = Math.random();
    jobManager.enqueue({exeTime: est_exeTime});

    res.status(200).send("Web service request is enqueued");
});

jobManager.start('FIFO');
