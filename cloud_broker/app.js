var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    request = require('request'),
    jobManager = require('./job_manager.js'),
    vmmanager = require('./vm_manager.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//HTTP server Listen
var server = app.listen(55555, function(){
    console.log('This server is running on the port ' + this.address().port );
});

app.get('/ws_broker', function(req, res){
    console.log('[GET] ws_broker');
    console.log(req.query);

    jobManager.enqueue({});

    res.status(200).send("Web service request is enqueued");
});


app.post('/sysinfo', function(req, res, body){
    vmmanager.sysinfo(req, res, body)
});

app.get('/curinfo', function(req, res){
    vmmanager.curinfo(req, res)
});

app.get('/createVM', function(req, res){
    vmmanager.createVM()
    res.send('OK')
});

jobManager.start('FIFO');