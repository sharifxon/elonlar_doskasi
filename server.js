 const express = require('express');
 const dotenv = require('dotenv')
 const path  = require('path')
   const exphbs = require('express-handlebars')
   const Handlebars = require('handlebars')
   const session = require('express-session')
  const MongoStore = require('connect-mongodb-session')(session)
  const flash = require('connect-flash')
  const helmet = require('helmet')
  const compression = require('compression')
  const helpers =  require('./utils/hbsHelpers')
   const homeRouter = require('./routes/homeRouter')
   const posterRouter = require('./routes/posterRouter')
   const connectDB = require('./config/db')


   
 dotenv.config()

// connecting to DB
 connectDB()

 const app = express()

  

 app.engine('.hbs', exphbs.engine({extname: '.hbs', defaultLayout: 'main'}))
 app.set('view engine', '.hbs')

//  inistaliziea  session storage
const store = new MongoStore({
  collection: 'session',
  uri:process.env.MONGO_URI
})

//body parser
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//register handlebars helpers
helpers(Handlebars)

// session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  rsave:false,
  saveUninitialized:false,
  store

}))
 
app.use(flash())
app.use(helmet())
app.use(compression())

 app.use(express.static(path.join(__dirname, 'public')))

 

app.use('/', homeRouter)
 app.use('/posters', posterRouter)
 app.use('/auth', require('./routes/authRouter'))
 app.use('/profile', require('./routes/profileRouter'))



 const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`server running on : ${PORT}`)
  })