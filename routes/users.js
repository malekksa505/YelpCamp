const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');

const userControllers = require('../controllers/users');



router.route('/register')
    .get( userControllers.registerForm)
    .post( catchAsync(userControllers.newUser));

/*
router.get('/register', userControllers.registerForm);
router.post('/register', catchAsync(userControllers.newUser))
*/

router.route('/login')
    .get(userControllers.LoginForm)
    .post(storeReturnTo,passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}) ,userControllers.loginUser);

/*
router.get('/login', userControllers.LoginForm);
router.post('/login', storeReturnTo,passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}) ,userControllers.loginUser)
*/

router.get('/logout', userControllers.logout)

module.exports = router;