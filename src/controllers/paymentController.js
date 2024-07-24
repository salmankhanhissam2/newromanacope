const paypal = require('paypal-rest-sdk');
const { PAYPAL_MODE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

paypal.configure({
  'mode': PAYPAL_MODE,
  'client_id': PAYPAL_CLIENT_ID,
  'client_secret': PAYPAL_CLIENT_SECRET
});

const renderBuyPage = async (req, res) => {
  try {
    res.render('index');
  } catch (error) {
    console.log(error.message);
  }
};

const payProduct = async (req, res) => {
  try {
    const { productId, amount, currency } = req.body;
    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "http://localhost:4200/paymentsuccess",
        "cancel_url": "http://localhost:3000/cancel"
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": "Product",
            "sku": productId,
            "price": amount,
            "currency": currency,
            "quantity": 1
          }]
        },
        "amount": {
          "currency": currency,
          "total": amount
        },
        "description": "Product payment"
      }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.json({ approval_url: payment.links[i].href });
          }
        }
      }
    });

  } catch (error) {
    console.log(error.message);
  }
};

const successPage = async (req, res) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
        "amount": {
          "currency": "USD",
          "total": "25.00"
        }
      }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log(JSON.stringify(payment));
        res.render('success');
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const cancelPage = async (req, res) => {
  try {
    res.render('cancel');
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  renderBuyPage,
  payProduct,
  successPage,
  cancelPage
};
