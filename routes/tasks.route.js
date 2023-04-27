var express = require('express');
var router = express.Router();
const task = require('../controller/task.controller')

router.post('/add', task.addTask)
router.get('/getAll', task.getAll)
router.delete('/delete/:taskId', task.deleteTask)

module.exports = router;
