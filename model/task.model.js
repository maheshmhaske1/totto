const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    taskTitle: {
        type: String
    },
    task: {
        type: String,
        default: ''
    }
})


var taskModel = mongoose.model('tasks', taskSchema);
module.exports = taskModel;