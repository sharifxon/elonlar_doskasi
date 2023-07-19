const {Router} = require('express')
const {getHomePage} = require('../controllers/homeContollers')

const router = Router()


router.get('/', getHomePage)

module.exports = router

