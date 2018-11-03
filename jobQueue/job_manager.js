var queue = [];

// functions for exports
module.exports = {
    enqueue: function (task) {
        task.enqueueTime = Date.now();
        queue.push(task);
        console.log("Enqueued job: "+JSON.stringify(task));
    },
    dequeue: function () {
        task = queue.pop();
        if (task != undefined){
            task.dequeueTime = Date.now();
        }

        return task;
    },
    show: function () {
        return queue;
    }
}
