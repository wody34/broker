var request = require('request')
var os = require('os');
const si = require('systeminformation');

var vm_id = os.hostname();
var vm_ip = '';

module.exports = {
    init: function(ipAddr) {
        request = request.defaults({
            baseUrl: 'http://'+ipAddr+':55555'
        });
        var sendInterval = setInterval(function(){
            var sysdata = {}

            si.cpu(function(data) {
                // console.log('CPU-Information:');
                // console.log(data);
                sysdata.speed = data.speed;
                sysdata.speedmin = data.speedmin;
                sysdata.speedmax = data.speedmax;
                sysdata.cores = data.cores;

                si.cpuCurrentspeed(function(data) {
                    // console.log('CPU-currentspeed:');
                    // console.log(data);
                    sysdata.min = data.min;
                    sysdata.max = data.max;
                    sysdata.avg = data.avg;

                    si.currentLoad(function(data) {
                        // console.log('Current load:');
                        // console.log(data);
                        sysdata.currentload = data.currentload;
                        sysdata.currentload_user = data.currentload_user;
                        sysdata.currentload_system = data.currentload_system;
                        sysdata.currentload_nice = data.currentload_nice;
                        sysdata.currentload_idle = data.currentload_idle;
                        sysdata.currentload_irq = data.currentload_irq;

                        request({method: 'POST', uri: '/sysinfo', json: {vm: vm_id, ip: vm_ip, data: sysdata}}, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                // Print out the response body
                                console.log(body)
                            }
                            else{
                                console.log(error);
                            }
                        });
                    });
                });
            });

        }, 2000);
    }
};
