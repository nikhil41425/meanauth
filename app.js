const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const path = require('path')
const cors = require('cors')
const passport = require ('passport')
const users=require('./routes/users')
const config=require('./config/database')
const session = require('express-session');
const app = express()

const port=3000

mongoose.connect(config.database)

mongoose.connection.on('connected',()=>{
    console.log(`Database connected to ::: ${config.database}`)
})
mongoose.connection.on('error',(err)=>{
    console.log(`Database error  ::: ${err}`)
})

app.use(cors())

app.use(bodyParser.json())

require('./config/passport')(passport);

app.use(session({ secret: config.secret }))

app.use(passport.initialize());

app.use(passport.session());

app.use(express.static(path.join(__dirname,'public')))

app.use('/users',users)

app.get('/',(req,res)=>{
    res.send('end point')
})

app.listen(port,()=>{
    console.log(`Server listening to ::: ${port}`)
})

