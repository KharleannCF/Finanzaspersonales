const express = require('express');
const router = express.Router();
const db = require('../dataconnect');



function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()
    hours = '' + (d.getHours()),
        minutes = '' + d.getMinutes();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if (minutes.length < 2)
        minutes = '0' + minutes;
    if (hours.length < 2)
        hours = '0' + hours;
    let fecha = [year, month, day].join('-');
    fecha = fecha + 'T' + hours + ':' + minutes;
    return fecha;
}

router.route('/:transaccion')
    .get((req, res) => {
        let sql = `SELECT * FROM categorias WHERE creatorId = ${res.locals.user.id} OR creatorId = 1`
        let categorias = []
        let monedas = []
        db.query(sql, (err, result) => {
            if (err) throw err;
            categorias = result;
            sql = `SELECT * FROM monedas`;
            db.query(sql, (err, result) => {
                if (err) throw err;
                monedas = result;
                res.render('app/gastos/home', {
                    transaccion: req.params.transaccion,
                    categorias: categorias,
                    monedas: monedas
                })
            })
        })


    }).post((req, res) => {
        let sql = 'INSERT INTO ' + req.params.transaccion + ' SET ?'

        let elemento = {
            categoria: req.body.categoria,
            titulo: req.body.titulo,
            moneda: req.body.moneda,
            monto: req.body.monto,
            fecha: req.body.fecha,
            descripcion: req.body.descripcion,
            creatorId: res.locals.user.id
        }
        db.query(sql, elemento, (err, result) => {
            if (err) throw err
            res.redirect(`${req.params.transaccion}/listado`)
        })
    })

router.get('/:transaccion/listado', (req, res) => {
    let trans = req.params.transaccion
    let sql = `SELECT ${trans}.id, ${trans}.titulo, ${trans}.monto, monedas.nombre as moneda FROM ` + req.params.transaccion + ` LEFT JOIN monedas ON ${trans}.moneda = monedas.id WHERE creatorId = ${res.locals.user.id}`
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('app/gastos/listado', { transaccion: req.params.transaccion, lista: result })
    })
})

router.route('/:transaccion/:id')
    .get((req, res) => {
        let sql = `SELECT * FROM ${req.params.transaccion}  WHERE id =  ${req.params.id}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            sql = 'SELECT nombre FROM categorias WHERE id = ' + result[0].categoria;
            db.query(sql, (err, categoria) => {
                if (err) throw err;
                result[0].categoria = categoria[0].nombre
                sql = 'SELECT nombre FROM monedas WHERE id = ' + result[0].moneda;
                db.query(sql, (err, moneda) => {
                    if (err) throw err;
                    result[0].moneda = moneda[0].nombre
                    res.render('app/gastos/show', { transaccion: req.params.transaccion, elem: result[0] })
                })
            })

        })
    })
router.route('/:transaccion/:id/edit')
    .get((req, res) => {
        let sql = `SELECT * FROM ${req.params.transaccion}  WHERE id =  ${req.params.id}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            let dateString = formatDate(result[0].fecha)
            result[0].fecha = dateString;
            sql = 'SELECT * FROM categorias WHERE creatorId = ' + res.locals.user.id + ' OR creatorId = 1';
            db.query(sql, (err, categorias) => {
                if (err) throw err;
                sql = 'SELECT * FROM monedas';
                db.query(sql, (err, monedas) => {
                    if (err) throw err;
                    res.render('app/gastos/edit', {
                        transaccion: req.params.transaccion,
                        elem: result[0],
                        categorias: categorias,
                        monedas: monedas
                    })
                })
            })

        })
    }).put((req, res) => {
        let sql = `UPDATE ${req.params.transaccion} SET titulo='${req.body.titulo}',categoria='${req.body.categoria}', descripcion='${req.body.descripcion}', monto='${req.body.monto}', moneda='${req.body.moneda}', fecha='${req.body.fecha}' WHERE id =${req.params.id}`;
        `UPDATE categorias SET nombre='${req.body.nombre}' WHERE id = ${req.params.id}`
        db.query(sql, (err, categorias) => {
            if (err) throw err;
            res.redirect(`/app/gastos/${req.params.transaccion}/listado`)
        })
    }).delete((req, res) => {
        let sql = `DELETE FROM ${req.params.transaccion} WHERE id = ${req.params.id}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.redirect(`/app/gastos/${req.params.transaccion}/listado`)
        })
    });

module.exports = router