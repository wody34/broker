var express = require('express'),
    ws_server = express(),
    path = require('path'),
    fs = require('fs'),
    sysinfo = require('./sysinfo_agent.js');



//HTTP server Listen
var server = ws_server.listen(3000, function(){
    console.log('This server is running on the port ' + this.address().port );
});

ws_server.get('/init', function(req, res){
    if (req.ip.substr(0, 7) == "::ffff:") {
        sysinfo.init(req.ip.substr(7))
    }

    res.status(200).send("[Init finished]");
});

ws_server.get('/ws_app', function(req, res){
    var req_query = req.query;
    console.log('[GET] app received');
    // res.status(200).send("Webservice started");

    var exec = require('child_process').exec
    var child = exec('ffmpeg -i ./origin_input.mp4 -vcodec libx264 -s 1280x720 -b:v 2000k -keyint_min 150 -an ./full_output_1280x720_2000k.ts -y',
        function (error, stdout, stderr) {
            console.log('STDOUT: ' + stdout);
            if (error !== null) {
                console.log('EXEC ERROR: ' + error);
            }
            res.status(200).send("[Webservice finished]");
        });
});
