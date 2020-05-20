const db = require('../dataconnect');

module.exports = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login');
    } else {
        let sql = `SELECT * FROM clientes WHERE id = ${req.session.userId}`;
        let query = db.query(sql, (err, user) => {
            if (err) throw err;
            if (user.length < 1) {
                res.redirect('/users/login');
            } else {
                res.locals = { user: user[0] };
                next();
            }
        })
    }
}