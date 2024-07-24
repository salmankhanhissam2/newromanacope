const Product = require('../models/Product');

const checkOwnership = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to edit this product' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = checkOwnership;
