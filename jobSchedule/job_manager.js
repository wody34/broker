var queue = [];
var name = "";

// functions for job scheduling policy
function sjf(a, b) {
    return a.exeTime < b.exeTime;
}

function fifo(a, b) {
    return a.enqueueTime < b.enqueueTime;
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
        console.log('Selected job: '+JSON.stringify(task));
    }
}

module.exports = {
    enqueue: function (task) {
        task.enqueueTime = Date.now();
        queue.push(task);
        console.log("Enqueued job: "+JSON.stringify(task));
        // schedule();
    },
    dequeue: dequeue,
    schedule: schedule,
    start: function(n) {
        name = n;
        setInterval(schedule, 7000);
    },
    show: function(){
        return queue;
    }
}
