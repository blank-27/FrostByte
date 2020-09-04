const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
require('./router/socket')(io)
require('./db/connect')
const authRouter = require('./router/routes')
const teacherRouter = require('./router/teacher')
const studentRouter = require('./router/student')
const verfyRouter = require('./router/verify')
const path = require('path')


var Path = path.join(__dirname, '/public')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json());
app.use(express.static(Path))
app.use(express.urlencoded({ extended: true }));
app.use(authRouter)
app.use(teacherRouter)
app.use(studentRouter)
app.use(verfyRouter)



const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.render('index')
})

server.listen(port, () => {
    console.log(`server is started at port ${port}`)
})