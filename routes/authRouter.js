const {Router} = require('express')
const router = Router()

const {getLoginPage,
     getRegisterPage, 
     newUserRegister,
     loginUser,
     logout
    
    } = require('../controllers/authControllers')

    const {guest} = require('../middleware/auth')

router.get('/signup', guest, getRegisterPage)
router.get('/login', guest, getLoginPage)
router.post('/signup', guest, newUserRegister)
router.post('/login', guest, loginUser)
router.get('/logout', logout)


module.exports = router




