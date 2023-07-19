const Poster = require('../models/posterModel')
// @route  get /
// @desc  get home page
// @access public

let getHomePage =async (req, res) => {
    const poster = await  Poster.find().lean()
    res.render('home', {
        hello: ' hello nodejs handlebars',
        title:'home page',
        user:req.session.user,
        url:process.env.URL,
        poster:poster.reverse().slice(0, 8)
      })
}

module.exports = {
    getHomePage:getHomePage
}