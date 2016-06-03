var cartLib = require('cartLib');
var customerLib = require('customerLib');

exports.post = actionSelector;
exports.get = actionSelector;

function actionSelector(req) {
  log.info("***CARTSERVICE***");
  log.info(JSON.stringify(req, null, 2));
  switch (req.params.action) {
    case 'add':
      cartLib.addToCart(req.params.productId);
      break;
    case 'remove':
      cartLib.removeFromCart(req.params.productId);
      break;
    case 'addQty':
      var customer = customerLib.getCustomer();
      var cart = cartLib.getCart(customer._id);
      cartLib.addToCartQuantity(cart._id, req.params.quantity, req.params.productId);
      break;
  }
}
