module.exports = (req, res, next) => {
    if (res.locals.user.isAdmin) {
        next();
    } else {
        res.redirect('/app');
    }
}