var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    adaptor = require('./openstack_adaptor.js');

var vm_list = {};
var terminate_vm_list = {};


/////////////////////////////////////////////////

function bucketProvisioningAlloc(cb) {
    vm_list.sort(function(a, b) {
        return a.concurrent > b.concurrent
    });

    var select = null
    var idle = 0
    for (var i in vm_list) {
        if(vm_list[i].concurrent < threshold && select == null) {
            select = vm_list[i]
        }
        if(vm_list[i].concurrent == 0) {
            idle += 1
        }
    }

    if(idle < RESERVE) {
        os_adaptor.createVM({
            name: 'worker',
            image: 'lab11worker',
            flavor: 'test.small'
        }, function(vm) {
            console.log(vm);
            vm_list.push(vm)
        });
    }
    cb(select)
}

function bucketProvisioningDealloc(vm) {
    var idle = 0;
    var selectIdx = -1;

    vm_list[vm.vm].concurrent -= 1;

    for (var i in vm_list) {
        if(vm_list[i].concurrent == 0) {
            idle += 1;
            selectIdx = i;
        }
    }

    if (idle > 1) {
        vm_list.splice(selectIdx, 1)
    }
}

/////////////////////////////////////////////////

module.exports = {
    allocVM: function(task) {
        tmp = undefined;
        for (var i in vm_list){
            if (vm_list[i].data['currentload_idle'] > 90 && vm_list[i].concurrent < 3){
                tmp = vm_list[i];

                // status update for VM allocation
                if(vm_list[i].concurrent == undefined){
                    vm_list[i].concurrent = 1;
                }
                else{
                    vm_list[i].concurrent += 1;
                }

                break;
            }
        }

        return tmp;
    },
	deallocVM: function(vm) {
        vm_list[vm.vm].concurrent -= 1;
	},
	scale: function() {
		//VM scaling에 대한 decision 수행
		for (id in vm_list){
            // avr_util 계산
            // num_of_idle_vm 계산
		}

		if (avr_util > threshold){
            return 1;
		}
		else if (avr_util < thres2 && num_of_idle_vm > 0){
            return -1;
		}
		else{
            return 0;
		}
	},
	manager: function() {

		setTimeout(function() {
			decision = scale();
			if (decision > 0){
                createVM();
			}
			else if (decision < 0){
                terminateVM();
			}
		}, 1500)

	},
	createVM: function() {
        self.createVM({
            name: 'worker',
            image: 'lab11worker1',
            flavor: 'test.small'
        }, function(vm) {
            console.log(vm);
            // self.terminateVM(server)
            vm_list[vm.ipAddr] = VMInstance(vm.id, vm.ipAddr, {})
        });

	},
	terminateVM: function() {
		delete vm_list[id];
	},
    sysinfo: function(req, res, body){
        var temp_data = req.body;
        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        ip = ip.split(':').pop();

        console.log('[POST] sysinfo from: '+ip);
        // console.log(temp_data);

        if(vm_list==undefined){
            vm_list[temp_data.ip] = temp_data;
        }
        if(vm_list[temp_data.ip].concurrent==undefined){
            vm_list[temp_data.ip].concurrent = 0;
        }
        vm_list[temp_data.ip].vm = temp_data.vm;
        vm_list[temp_data.ip].ip = ip;
        vm_list[temp_data.ip].data = temp_data.data;

        res.status(200).send("POST completed");
        // console.log(vm_list);
    },
    curinfo: function(req, res) {
        console.log('[GET] curinfo');
        res.status(200).send(vm_list);
    }
};

function VMInstance(vm_id, ipaddress, vm_status) {
	return {
		vm: vm_id,
		ip: ipaddress,
		data: vm_status
	}
}


