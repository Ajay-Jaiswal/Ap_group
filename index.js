const express = require('express');
const app = express();
const route = require('./router/router');
const mongoose = require('mongoose');
const multer = require('multer')

//app.use(multer)

var cookieParser = require('cookie-parser')
const cors = require("cors")
const dotenv = require('dotenv')
 dotenv.config()

let port = 4000 || process.env.PORT

app.use(cors())
app.use(cookieParser())
app.use(express.json());

mongoose.connect("mongodb+srv://lankesh:YZMPw6IXM8OY1d8G@cluster0.thxzujr.mongodb.net/company", {
    useNewUrlParser : true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(port, function () {
    console.log('Express app running on port ' + (port))
});