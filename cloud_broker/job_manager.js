vmmanager = require('./vm_manager.js');
request = require('request');

var queue = [];
var name = "";

// functions for job scheduling policy
function sjf(a, b) {
	return a.exeTime < b.exeTime;
}

function fifo(a, b) {
	return a.enqueueTime < b.enqueueTime;
}


// function for request task
function requestTask(task, vm){
    task.exeStart = Date.now();
    request({method: 'GET', url: 'http://'+vm.ip+':3000/ws_app'}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body);
        }
        else{
            console.log(error);
        }
        task.exeEnd = Date.now();

        vmmanager.deallocVM(vm);
        console.log("Web service finished!: "+JSON.stringify(task));
    });


}


// functions for exports
function dequeue(fn) {
    queue.sort(fn);
    task = queue.pop();
    if (task != undefined){
        task.dequeueTime = Date.now();
	}

    return task;
}
function schedule() {
    // select scheduling policy
    fn = null;
    if (name == 'SJF'){
        fn = sjf;
    }
    else if (name == 'FIFO'){
        fn = fifo;
    }

    if (fn == null){
        console.log("[ERROR] Function name is NULL!!");
        return -1; // print err
    }

    // choose one task to deal with
    task = dequeue(fn);

    if (task == undefined){
    	console.log("No requested jobs in Queue...");
    	return -2;
	}
	else{
        console.log('Selected task: ' + JSON.stringify(task));
	}

	// allocate VM for the Task & request to the VM
    vm = vmmanager.allocVM(task);

    if (vm == undefined){
        console.log("No VM available to allocate..");
        queue.push(task);
    }
    else{
        console.log('Allocated VM: '+JSON.stringify(vm.ip));
        requestTask(task, vm);
    }

}

module.exports = {
    enqueue: function (task) {
        task.enqueueTime = Date.now();
        queue.push(task);
        console.log(task);
        // schedule();
    },
	dequeue: dequeue,
	schedule: schedule,
	start: function(n) {
		name = n;
        setInterval(schedule, 1500);
	},
	show: function(){
		return queue;
	}
}
