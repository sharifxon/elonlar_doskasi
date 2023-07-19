const { request, response } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

// @route  get /auth/signup
// @desc  get register page
// @access public
const getRegisterPage = (req, res) => {
    res.render('auth/reg',{
        title: 'Register page',
        url:process.env.URL,
         regError: req.flash('regError'),
    })
}

// @route  get /auth/login
// @desc  get login page
// @access public
const getLoginPage = (req, res) => {
    res.render('auth/login',{
        title: 'Login page',
        url:process.env.URL,
        loginError: req.flash('loginError'),
    })
}

// @route  POST /auth/signup
// @desc  new user to  register
// @access public
const newUserRegister = async (req, res) => {
   const  {email, username, phone, password, password2} = req.body
   const salt =await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
   const existUser = await User.findOne({email}) 

   if(existUser){
    req.flash('regError', 'Bu foydalanuvch bazada mavjud')
    return res.redirect('/auth/signup')
   }

   if(password !== password2){
    req.flash('regError', 'parollar mos kelmayapti')
    return res.redirect('/auth/signup')
   }

    await User.create({email,
        username,
        phone,
        password: hashedPassword
        })
    res.redirect('/auth/login')

}

// @route  POST /auth/ login
// @desc  login web site
// @access public
const loginUser =  async (req, res) => {
    try {
        const userExist = await User.findOne({email: req.body.email})
        if(userExist){
            const matchPassword =  await bcrypt.compare(req.body.password, userExist.password)

            if(matchPassword){
                 req.session.user = userExist
                req.session.isLogged = true
                req.session.save(err => {
                    if(err) throw err
                    res.redirect('/profile/'+ req.session.user.username)
                })

            }else{
                req.flash('loginError', 'email yoki parol xato')
                res.redirect('/auth/login')
            }
        }else{
            req.flash('loginError', 'email yoki parol xato')
            res.redirect('/auth/login')
        }
    } catch (err) {
        
        console.log(err);
    }


}
// @route  GET /auth/ login
// @desc  login web site
// @access public
const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}



module.exports = {
    getLoginPage,
    getRegisterPage,
    newUserRegister,
    loginUser,
    logout
}
