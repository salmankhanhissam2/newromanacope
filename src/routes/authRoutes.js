
const express = require('express');
const { signup, signin } = require('../controllers/authController');
const { createProduct } = require('../controllers/productController');
const { authMiddleware, sellerMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);


module.exports = router;
