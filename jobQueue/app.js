var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    request = require('request'),
    jobManager = require('./job_manager.js');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//HTTP server Listen
var server = app.listen(55555, function(){
    console.log('This server is running on the port ' + this.address().port );
});

var current_data = [];

app.get('/job_req', function(req, res){
    console.log('[GET] job_req');

    var tmp_task = {
        enqueueTime: Date.now()
    };

    jobManager.enqueue(tmp_task);

    res.status(200).send("Web service request is enqueued");
});

app.get('/job_deq', function(req, res){
    console.log('[GET] job_del');

    var tmp_task = jobManager.dequeue();
    console.log('Dequeued job:'+JSON.stringify(tmp_task));

    res.status(200).send("Dequeued job: "+JSON.stringify(tmp_task));
});

app.get('/q_show', function(req, res){
    console.log('[GET] q_show');

    var tmp_task = jobManager.show();
    console.log('Job Queue: '+JSON.stringify(tmp_task));

    res.status(200).send("Job Queue: "+JSON.stringify(tmp_task));
});
