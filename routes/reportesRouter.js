const express = require('express');
const router = express.Router();
const db = require('../dataconnect');



router.get('/', (req, res) => {
    res.render('app/reportes/home')
})

router.route('/catXmes')
    .get((req, res) => {
        res.render('app/reportes/catXmes')
    }).post((req, res) => {
        let sql = `SELECT categorias.nombre, SUM(gastos.monto) as total FROM gastos LEFT JOIN categorias ON gastos.categoria = categorias.id WHERE MONTH(fecha) = ${req.body.mes} AND gastos.creatorId = ${res.locals.user.id} GROUP BY categoria ORDER BY total`
        db.query(sql, (err, result) => {
            if (err) throw err
            req.session.query = result
            res.render('app/reportes/catXmesGen')
        })
    })

router.route('/gasXmes')
    .get((req, res) => {
        res.render('app/reportes/gasXmes')
    }).post((req, res) => {
        let sql = `SELECT categorias.nombre as categorias, gastos.titulo as gastos, gastos.monto as monto FROM gastos LEFT JOIN categorias ON gastos.categoria = categorias.id WHERE MONTH(fecha) = ${req.body.mes} AND gastos.creatorId = ${res.locals.user.id}`
        db.query(sql, (err, result) => {
            if (err) throw err
            let categorias = []
            result.forEach(element => {
                if (categorias.indexOf(element.categorias) < 0) {
                    categorias.push(element.categorias)
                }
            });
            req.session.query = result
            res.render('app/reportes/gasXmesGen', { data: categorias })
        })
    })




module.exports = router;