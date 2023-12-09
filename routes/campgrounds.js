const express = require('express');
const router = express.Router();

const CampControllers = require('../controllers/campgrounds');

const Camp = require('../models/campground')
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');

const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');


router.route('/')
    .get(catchAsync(CampControllers.index))
    .post(isLoggedIn,validateCampground, catchAsync(CampControllers.newCamp))
/* Old One
router.get("/", catchAsync(CampControllers.index));
router.post('/', isLoggedIn,validateCampground, catchAsync(CampControllers.newCamp))
*/

router.get("/new", isLoggedIn, CampControllers.newForm)

router.route('/:id')
    .get(catchAsync(CampControllers.showCamp))
    .put( isLoggedIn , isAuthor,validateCampground, catchAsync(CampControllers.editCamp))
    .delete( isLoggedIn, isAuthor, catchAsync(CampControllers.deleteCamp));

/* Old One
router.get("/:id", catchAsync(CampControllers.showCamp));
router.put('/:id', isLoggedIn , isAuthor,validateCampground, catchAsync(CampControllers.editCamp))
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(CampControllers.deleteCamp));
*/
router.get("/:id/edit",isLoggedIn, isAuthor, catchAsync(CampControllers.editFormCamp));

module.exports = router;