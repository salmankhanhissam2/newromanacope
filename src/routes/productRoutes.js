const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, sellerMiddleware } = require('../middlewares/authMiddleware');
const checkOwnership = require('../controllers/checkOwnershipMiddleware');
const upload = require('../config/multer');

router.post('/', authMiddleware, sellerMiddleware, upload.single('image'), productController.createProduct);
router.get('/', authMiddleware, productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', authMiddleware, sellerMiddleware, checkOwnership, upload.single('image'), productController.updateProduct);
router.delete('/:id', authMiddleware, sellerMiddleware, checkOwnership, productController.deleteProduct);

module.exports = router;
