module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must singed in first to do');
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login')
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}