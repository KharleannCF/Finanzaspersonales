const express = require('express');
const router = express.Router();
const db = require('../dataconnect');
const adminfinder = require('../middlewares/adminfinder');
const gastosRouter = require('./gastosRouter')
const reportesRouter = require('./reportesRouter')
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
    //monedas
    let sql = 'CREATE TABLE IF NOT EXISTS monedas(id INT AUTO_INCREMENT, nombre VARCHAR(255), valor INT , PRIMARY KEY (id))';
    db.query(sql, (err, result) => { if (err) { throw err } });
    sql = 'SELECT * FROM monedas';
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            let moneda = { id: 1, nombre: 'dolar', valor: 2 }
            sql = 'INSERT INTO monedas SET ?'
            db.query(sql, moneda, (err, result) => { if (err) throw err; })
            moneda = { id: 2, nombre: 'bolivar', valor: 1 }
            sql = 'INSERT INTO monedas SET ?'
            db.query(sql, moneda, (err, result) => { if (err) throw err; })
        }
    })

    //categorias
    sql = 'CREATE TABLE IF NOT EXISTS categorias(id INT AUTO_INCREMENT, nombre VARCHAR(255), creatorId INT, PRIMARY KEY (id), FOREIGN KEY (creatorId) REFERENCES clientes(id))';
    db.query(sql, (err, result) => { if (err) { throw err } });
    sql = 'SELECT * FROM categorias';
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            let categoria = { id: 1, nombre: 'generales', creatorId: 1 }
            sql = 'INSERT INTO categorias SET ?'
            db.query(sql, categoria, (err, result) => { if (err) throw err; })
        }
    })

    sql = 'CREATE TABLE IF NOT EXISTS ingresos(id INT AUTO_INCREMENT, categoria INT, descripcion VARCHAR(255), titulo VARCHAR(255), moneda INT, monto FLOAT, fecha DATETIME, creatorId INT, PRIMARY KEY (id), FOREIGN KEY (creatorId) REFERENCES clientes(id), FOREIGN KEY (categoria) REFERENCES categorias(id), FOREIGN KEY (moneda) REFERENCES monedas(id))';
    db.query(sql, (err, result) => { if (err) { throw err } });
    sql = 'CREATE TABLE IF NOT EXISTS gastos(id INT AUTO_INCREMENT, categoria INT,descripcion VARCHAR(255) , titulo VARCHAR(255), moneda INT, monto FLOAT, fecha DATETIME, creatorId INT, PRIMARY KEY (id), FOREIGN KEY (creatorId) REFERENCES clientes(id), FOREIGN KEY (categoria) REFERENCES categorias(id), FOREIGN KEY (moneda) REFERENCES monedas(id))';
    db.query(sql, (err, result) => { if (err) { throw err } });
    sql = `SELECT SUM(monto) AS ingresos FROM ingresos WHERE creatorId ='${res.locals.user.id}'`
    db.query(sql, (err, ingresos) => {
        if (err) throw err;
        sql = `SELECT SUM(monto) AS gastos FROM gastos WHERE creatorId ='${res.locals.user.id}'`
        db.query(sql, (err, gastos) => {
            if (err) throw err;
            res.render('app/home', { nombre: res.locals.user.nombre, admin: res.locals.user.isAdmin, ingresos: ingresos[0].ingresos, gastos: gastos[0].gastos, balance: (ingresos[0].ingresos - gastos[0].gastos) })
        })
    })

})


router.all('/admin/:option*', adminfinder);
router.get('/admin/:option', (req, res) => {
    let sql = (req.params.option == 'categorias') ?
        `SELECT * FROM ${req.params.option} WHERE creatorId = 1` :
        `SELECT * FROM ${req.params.option}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('app/admin/option', {
            elementos: result,
            nombre: req.params.option.charAt(0).toLocaleUpperCase() + req.params.option.slice(1)
        })
    })
});


router.route('/moneda/:id/edit')
    .get((req, res) => {
        let sql = `SELECT * FROM monedas WHERE id = ${req.params.id}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render('app/moneda', {
                id: result[0].id,
                nombre: result[0].nombre.charAt(0).toLocaleUpperCase() + result[0].nombre.slice(1),
                valor: result[0].valor
            })
        })
    }).put((req, res) => {
        let sql = `UPDATE monedas SET nombre='${req.body.nombre}', valor='${req.body.valor}'  WHERE id = ${req.params.id}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.redirect('/app')
        })
    }).delete((req, res) => {
        let sql = `DELETE FROM monedas WHERE id = ${req.params.id}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.redirect('/app')
        })
    });

router.get('/moneda/edit', (req, res) => {
    let moneda = { nombre: 'nueva moneda', valor: 1 }
    sql = 'INSERT INTO monedas SET ?'
    db.query(sql, moneda, (err, result) => {
        if (err) throw err;
        let sql = `SELECT * FROM monedas WHERE id = ${result.insertId}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render('app/moneda', {
                id: result[0].id,
                nombre: result[0].nombre.charAt(0).toLocaleUpperCase() + result[0].nombre.slice(1),
                valor: result[0].valor
            })
        })
    })
});

router.route('/categorias/:id/edit')
    .get((req, res) => {
        let sql = `SELECT * FROM categorias WHERE id = ${req.params.id}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render('app/categorias', {
                id: result[0].id,
                nombre: result[0].nombre.charAt(0).toLocaleUpperCase() + result[0].nombre.slice(1),
            })
        })
    }).put((req, res) => {
        let sql = `UPDATE categorias SET nombre='${req.body.nombre}' WHERE id = ${req.params.id}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.redirect('/app')
        })
    }).delete((req, res) => {
        let sql = `DELETE FROM categorias WHERE id = ${req.params.id}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.redirect('/app')
        })
    });

router.get('/categorias/edit', (req, res) => {
    let creatorid = (res.locals.user.isAdmin) ? 1 : res.locals.user.id
    let categoria = { nombre: 'nueva categoria', creatorId: creatorid }
    sql = 'INSERT INTO categorias SET ?'
    db.query(sql, categoria, (err, result) => {
        if (err) throw err;
        let sql = `SELECT * FROM categorias WHERE id = ${result.insertId}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render('app/categorias', {
                id: result[0].id,
                nombre: result[0].nombre.charAt(0).toLocaleUpperCase() + result[0].nombre.slice(1),
            })
        })
    })
});

router.route('/clientes/:id/edit')
    .get((req, res) => {
        let sql = `SELECT * FROM clientes WHERE id = ${req.params.id}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            let dateString = formatDate(result[0].birthDate)
            res.render('app/clientes', {
                id: result[0].id,
                nombre: result[0].nombre.charAt(0).toLocaleUpperCase() + result[0].nombre.slice(1),
                birthDate: dateString,
                imagen: result[0].imagen
            })
        })
    }).put((req, res) => {
        let sql = '';
        if (req.files.imagen.size) {
            let extension = req.files.imagen.name.split('.').pop();
            let imgLink = 'public/images/' + req.body.nombre + 'avatar.' + extension;
            fs.rename(req.files.imagen.path, imgLink, (err) => {
                if (err) console.log(err);
            });
            sql = `UPDATE clientes SET nombre='${req.body.nombre}', birthDate='${req.body.birthDate}', imagen='${imgLink}' WHERE id = ${req.params.id}`
        } else {
            sql = `UPDATE clientes SET nombre='${req.body.nombre}', birthDate='${req.body.birthDate}' WHERE id = ${req.params.id}`
        }
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.redirect('/app')
        })
    }).delete((req, res) => {
        let sql = `DELETE FROM clientes WHERE id = ${req.params.id}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.redirect('/app')
        })
    });

router.get('/perfil', (req, res) => {
    let dateString = formatDate(res.locals.user.birthDate)
    res.render('app/clientes', {
        id: res.locals.user.id,
        nombre: res.locals.user.nombre,
        birthDate: dateString,
        imagen: res.locals.user.imagen
    })
});
router.get('/categorias', (req, res) => {
    let sql = `SELECT * FROM categorias WHERE creatorId = ${res.locals.user.id} OR creatorId = 1`
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('app/categoriasUser', { categorias: result })
    })
});

router.use('/gastos', gastosRouter)
router.use('/reportes', reportesRouter)



module.exports = router;