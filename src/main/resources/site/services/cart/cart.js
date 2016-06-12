var cartLib = require('cartLib');
var payup = require('payupLib');

exports.post = actionSelector;
exports.get = actionSelector;

function actionSelector(req) {
  var context = payup.context();
  switch (req.params.action) {
    case 'add':
      cartLib.addToCart(req.params.productId);
      break;
    case 'remove':
      cartLib.removeFromCart(context.cart._id, req.params.quantity, req.params.productId);
      break;
    case 'addQty':
      cartLib.addToCartQuantity(context.cart._id, req.params.quantity, req.params.productId);
      break;
  }
}
