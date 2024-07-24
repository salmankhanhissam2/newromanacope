
// const Product = require('../models/Product');

// const createProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       code,
//       productstype,
//       price,
//       description,
//       servicePeriod,
//       AddtionOfProductsInvoice,
//       tags,
//       prohibited,
//       availabilityOfProducts,
//       quantity,
//       isVisibleToBuyers,
//       productOptionsEnabled,
//       productOptions
//     } = req.body;

//     const productData = {
//       name,
//       code,
//       productstype,
//       price,
//       description,
//       servicePeriod,
//       AddtionOfProductsInvoice,
//       tags,
//       prohibited,
//       availabilityOfProducts,
//       productOptionsEnabled,
//       productOptions,
//       owner: req.user._id
//     };

//     if (availabilityOfProducts === 'Limited') {
//       productData.quantity = quantity;
//       productData.isVisibleToBuyers = isVisibleToBuyers;
//     }

//     if (productOptionsEnabled) {
//       productData.productOptions = productOptions;
//     } else {
//       productData.productOptions = undefined;
//     }

//     const product = new Product(productData);

//     const createdProduct = await product.save();
//     res.status(201).json(createdProduct);
//   } catch (error) {
//     res.status(400).json({ message: 'Failed to create product', error: error.message });
//   }
// };

// const getAllProducts = async (req, res) => {
//   try {
//     let products;

//     if (req.user.role === 'admin') {
//       products = await Product.find({});
//     } else if (req.user.role === 'seller') {
//       products = await Product.find({ owner: req.user._id });
//     } else {
//       return res.status(403).json({ message: 'You do not have permission to view these products' });
//     }

//     res.status(200).json(products);
//   } catch (error) {
//     res.status(400).json({ message: 'Failed to retrieve products', error: error.message });
//   }
// };


// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(400).json({ message: 'Failed to retrieve product', error: error.message });
//   }
// };
// const updateProduct = async (req, res) => {
//   try {
//     const {
//       availabilityOfProducts,
//       quantity,
//       isVisibleToBuyers,
//       ...updateData
//     } = req.body;

//     if (availabilityOfProducts === 'Limited') {
//       updateData.quantity = quantity;
//       updateData.isVisibleToBuyers = isVisibleToBuyers;
//     } else {
//       updateData.quantity = undefined;
//       updateData.isVisibleToBuyers = undefined;
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     res.status(400).json({ message: 'Failed to update product', error: error.message });
//   }
// };

// const deleteProduct = async (req, res) => {
//   try {
//     const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//     if (!deletedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: 'Failed to delete product', error: error.message });
//   }
// };

// module.exports = {
//   createProduct,
//   getAllProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct
// };


const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const {
      name,
      code,
      productstype,
      price,
      description,
      servicePeriod,
      AddtionOfProductsInvoice,
      tags,
      prohibited,
      availabilityOfProducts,
      quantity,
      isVisibleToBuyers,
      productOptionsEnabled,
      productOptions,
      SetActivetimeForTheProduct,
      currency = 'USD'  // Default value to EUR
    } = req.body;

    const productData = {
      name,
      code,
      productstype,
      price,
      description,
      servicePeriod,
      AddtionOfProductsInvoice,
      tags,
      prohibited,
      availabilityOfProducts,
      productOptionsEnabled,
      productOptions,
      SetActivetimeForTheProduct,
      owner: req.user._id,
      currency
    };

    if (availabilityOfProducts === 'Limited') {
      productData.quantity = quantity;
      productData.isVisibleToBuyers = isVisibleToBuyers;
    }

    if (productOptionsEnabled) {
      productData.productOptions = productOptions;
    } else {
      productData.productOptions = undefined;
    }

    if (req.file) {
      const image = req.file;
      productData.imagePath = `../uploads/images/${image.filename}`;
    }

    const product = new Product(productData);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }

  // Handle SetActivetimeForTheProduct fields
  if (SetActivetimeForTheProduct && SetActivetimeForTheProduct.active) {
    productData['SetActivetimeForTheProduct.active'] = SetActivetimeForTheProduct.active;
    if (SetActivetimeForTheProduct.dateRange) {
      productData['SetActivetimeForTheProduct.dateRange.start'] = new Date(SetActivetimeForTheProduct.dateRange.start);
      productData['SetActivetimeForTheProduct.dateRange.end'] = new Date(SetActivetimeForTheProduct.dateRange.end);
    }
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      availabilityOfProducts,
      quantity,
      isVisibleToBuyers,
      ...updateData
    } = req.body;

    if (availabilityOfProducts === 'Limited') {
      updateData.quantity = quantity;
      updateData.isVisibleToBuyers = isVisibleToBuyers;
    } else {
      updateData.quantity = undefined;
      updateData.isVisibleToBuyers = undefined;
    }

    if (req.file) {
      const image = req.file;
      updateData.imagePath = `../uploads/images/${image.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    let products;

    if (req.user.role === 'admin') {
      products = await Product.find({});
    } else if (req.user.role === 'seller') {
      products = await Product.find({ owner: req.user._id });
    } else {
      return res.status(403).json({ message: 'You do not have permission to view these products' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve products', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve product', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete product', error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};


// const Product = require('../models/Product');

// const createProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       code,
//       productstype,
//       price,
//       description,
//       servicePeriod,
//       AddtionOfProductsInvoice,
//       tags,
//       prohibited,
//       availabilityOfProducts,
//       quantity,
//       isVisibleToBuyers,
//       productOptionsEnabled,
//       productOptions,
//       SetActivetimeForTheProduct
//     } = req.body;

//     const productData = {
//       name,
//       code,
//       productstype,
//       price,
//       description,
//       servicePeriod,
//       AddtionOfProductsInvoice,
//       tags,
//       prohibited,
//       availabilityOfProducts,
//       productOptionsEnabled,
//       productOptions,
//       SetActivetimeForTheProduct,
//       owner: req.user._id
//     };

//     if (availabilityOfProducts === 'Limited') {
//       productData.quantity = quantity;
//       productData.isVisibleToBuyers = isVisibleToBuyers;
//     }

//     if (productOptionsEnabled) {
//       productData.productOptions = productOptions;
//     } else {
//       productData.productOptions = undefined;
//     }

//       // Handle SetActivetimeForTheProduct
//       if (SetActivetimeForTheProduct) {
//         productData.SetActivetimeForTheProduct = {
//           active: SetActivetimeForTheProduct.active
//         };
  
//         if (SetActivetimeForTheProduct.active && SetActivetimeForTheProduct.dateRange) {
//           productData.SetActivetimeForTheProduct.dateRange = {
//             start: new Date(SetActivetimeForTheProduct.dateRange.start),
//             end: new Date(SetActivetimeForTheProduct.dateRange.end)
//           };
//         }
//       }
  

//     if (req.file) {
//       const image = req.file;
//       productData.imagePath = `../uploads/images/${image.filename}`;
//     }

//     const product = new Product(productData);
//     const createdProduct = await product.save();
//     res.status(201).json(createdProduct);
//   } catch (error) {
//     res.status(400).json({ message: 'Failed to create product', error: error.message });
//   }
// };

// const updateProduct = async (req, res) => {
//   try {
//     const {
//       availabilityOfProducts,
//       quantity,
//       isVisibleToBuyers,
//       SetActivetimeForTheProduct,
//       ...updateData
//     } = req.body;

//     if (availabilityOfProducts === 'Limited') {
//       updateData.quantity = quantity;
//       updateData.isVisibleToBuyers = isVisibleToBuyers;
//     } else {
//       updateData.quantity = undefined;
//       updateData.isVisibleToBuyers = undefined;
//     }

//        // Handle SetActivetimeForTheProduct
//        if (SetActivetimeForTheProduct) {
//         updateData.SetActivetimeForTheProduct = {
//           active: SetActivetimeForTheProduct.active
//         };
  
//         if (SetActivetimeForTheProduct.active && SetActivetimeForTheProduct.dateRange) {
//           updateData.SetActivetimeForTheProduct.dateRange = {
//             start: new Date(SetActivetimeForTheProduct.dateRange.start),
//             end: new Date(SetActivetimeForTheProduct.dateRange.end)
//           };
//         } else {
//           updateData.SetActivetimeForTheProduct.dateRange = undefined;
//         }
//       }
  

//     if (req.file) {
//       const image = req.file;
//       updateData.imagePath = `../uploads/images/${image.filename}`;
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     res.status(400).json({ message: 'Failed to update product', error: error.message });
//   }
// };

// const getAllProducts = async (req, res) => {
//   try {
//     let products;

//     if (req.user.role === 'admin') {
//       products = await Product.find({});
//     } else if (req.user.role === 'seller') {
//       products = await Product.find({ owner: req.user._id });
//     } else {
//       return res.status(403).json({ message: 'You do not have permission to view these products' });
//     }

//     res.status(200).json(products);
//   } catch (error) {
//     res.status(400).json({ message: 'Failed to retrieve products', error: error.message });
//   }
// };

// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(400).json({ message: 'Failed to retrieve product', error: error.message });
//   }
// };

// const deleteProduct = async (req, res) => {
//   try {
//     const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//     if (!deletedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: 'Failed to delete product', error: error.message });
//   }
// };

// module.exports = {
//   createProduct,
//   getAllProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct
// };
