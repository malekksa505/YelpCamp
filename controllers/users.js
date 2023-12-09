const User = require('../models/user');

module.exports.newUser = async(req,res,next) => {
    try {
        const {username,email,password} = req.body;
        const user = new User({email,username});
        const registerdUser = await User.register(user, password);
        req.login(registerdUser,(err) => {
            if(err) return next();
            req.flash('success', 'Welcome to yelp camp');
            res.redirect('/campgrounds');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
}

module.exports.registerForm =  (req,res) => {
    res.render('user/register', {title: 'Register Area'});
}

module.exports.LoginForm = (req,res) => {
    res.render('user/login', {title: 'Login area'});
}

module.exports.loginUser = (req,res) => {
    req.flash('success', 'Welcome Back!');
    const redirectURL = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectURL)
}

module.exports.logout = (req,res) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
    req.flash('success', 'Bye!')
    res.redirect('/campgrounds');
    });
}