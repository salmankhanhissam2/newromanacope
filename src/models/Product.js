
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productsAcitve: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  ProductsInternalName: {
    type: String,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  productstype: {
    type: String,
    required: true,
    enum: ['Service with digital content','Digital product', 'E-Books','Seminar/Event', 'Printed book','Other servicess'],
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  servicePeriod: {
    active: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['DateRange', 'NumberOfDays'],
      required: true
    },
    dateRange: {
      start: Date,
      end: Date
    },
    numberOfDays: Number
  },
  AddtionOfProductsInvoice: {
    active: {
      type: Boolean,
      default: false
    },
    AddtionOfProductsInvoiceData: {
      type: String,
      trim: true
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  prohibited: {
    type: Boolean,
    default: false
  },
  availabilityOfProducts: {
    type: String,
    enum: ['Limited', 'Unlimited'],
  },
  quantity: {
    type: Number,
    required: function() { return this.availabilityOfProducts === 'Limited'; }
  },
  isVisibleToBuyers: {
    type: Boolean,
    default: true
  },
  productOptionsEnabled: {
    type: Boolean,
    default: false
  },
  productOptions: [{
    category: {
      type: String,
      trim: true
    },
    options: [{
      type: String,
      trim: true
    }]
  }],
  imagePath: { type: String },
  SetActivetimeForTheProduct: {
    active: {
      type: Boolean,
      default: false
    },
    dateRange: {
      start: Date,
      end: Date
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  }
}, {
  timestamps: true
});

productSchema.index({ name: 1, code: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
