const express = require("express");
const config = require('./config/config');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');


const port = 5000;

const app = express();
app.use(express.json())


// Handlebars
app.engine('.hbs', exphbs.engine({ extname: '.hbs'}));

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')))
console.log(__dirname);


app.use('/auth', require("./routes/auth"))
app.use('/posts', require("./routes/post"))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})