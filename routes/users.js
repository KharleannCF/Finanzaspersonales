const express = require('express');
const router = express.Router();
const db = require('../dataconnect');
const fs = require('fs');

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}


router.get('/', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS clientes(id INT AUTO_INCREMENT ,email VARCHAR(255), password VARCHAR(255), nombre VARCHAR(255), imagen VARCHAR(255), isAdmin BOOL, birthDate DATE, PRIMARY KEY (id))';
    db.query(sql, (err, result) => { if (err) throw err; });
    sql = 'SELECT * FROM clientes  WHERE id = 1';
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            let user = {
                id: 1,
                email: 'admin@admin.com',
                password: 'admin',
                nombre: 'admin',
                birthDate: '1999-1-1',
                isAdmin: true
            };
            sql = 'INSERT INTO clientes SET ?';
            db.query(sql, user, (err, result) => {
                if (err) throw err;
            })
        }
    })
    res.render('registro', { segundointento: false });

});

router.post('/', (req, res) => {
    let imgLink = null;
    if (req.files.image.size) {
        let extension = req.files.imagen.name.split('.').pop();
        imgLink = 'public/images/' + req.body.name + 'avatar.' + extension;
        fs.rename(req.files.imagen.path, imgLink, (err) => {
            if (err) console.log(err);
        });
    }
    let date = formatDate(req.body.birthDate)
    if (req.body.password != req.body.passwordConfirmation) {
        res.render('registro', { segundointento: true });
    } else {
        let user = {
            email: req.body.email,
            password: req.body.password,
            nombre: req.body.name,
            birthDate: date,
            imagen: imgLink,
            isAdmin: req.body.isAdmin === 'on'
        };
        let sql = 'INSERT INTO clientes SET ?';
        let query = db.query(sql, user, (err, result) => {
            if (err) throw err;
            res.redirect('users/login');
        })
    }
});

router.get('/login', (req, res) => {
    res.render('login', { incorrecto: false });
});

router.post('/login', (req, res) => {
    let sql = `SELECT * FROM clientes WHERE email = "${req.body.email}" AND password = "${req.body.password}"`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.render('login', { incorrecto: true });
        } else {
            req.session.userId = result[0].id
            res.redirect('/app');
        }
    })
});



module.exports = router;