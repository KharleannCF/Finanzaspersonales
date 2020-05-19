//const mongoose = require('mongoose');
//const User = require('./models/user.js');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const usersRoutes = require('./routes/users.js');
const appRoutes = require('./routes/app.js');
const sessionMiddleware = require('./middlewares/sessionMiddleware.js');
const methodOverride = require('method-override');


let db = '';


const app = express();
app.get('/', (req, res) => {
    let sql = 'CREATE DATABASE IF NOT EXISTS finanzas';
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: ''
    }).query(sql, (err, result) => {
        if (err) throw err
    });
    db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'finanzas'
    });
    db.connect((err) => {
        if (err) {
            throw err
        } else {
            res.render('registro')
        }
    })


})

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session({
    name: 'session',
    keys: ['llave1', 'llave2']
}));

app.set('view engine', 'pug');

app.use('/users', usersRoutes);
app.use('/app', sessionMiddleware);
app.use('/app', appRoutes);

/*

//Routes
app.get('/', (req, res) => {
    res.send('Pruebas');
})

//database connection
//mongoose.connect('mongodb+srv://user1:finanzas29@cluster0-ticnm.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true },
//    () => console.log('connected to db'))
 */
app.listen(8080);