var cartLib = require('cartLib');

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
      cartLib.addToCartQuantity(req.params.quantity, req.params.productId);
      break;
  }
}
