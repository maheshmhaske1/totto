const express = require('express')
const router = express.Router()

const category = require('../controller/categoryDefination.controller')

router.post('/add', category.add)
router.get('/getAll', category.getAll)
router.delete('/delete/:catId', category.delete)

module.exports = router
