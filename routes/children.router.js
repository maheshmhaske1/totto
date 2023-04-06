var express = require('express');
var router = express.Router();
var children = require('../controller/children.controller')
var quetions = require('../controller/quationary.controller')

router.post('/add', children.addChildren)
router.get('/get/:childId', children.getById)
router.get('/get-byParent/:parentId', children.getByParentId)
router.put('/update/:childId', children.updateChild)
router.delete('/delete/:childId', children.delete)

router.post('/question/add',quetions.addQuations)

module.exports = router;
