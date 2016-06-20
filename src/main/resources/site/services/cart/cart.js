var cartLib = require('cartLib');
var payup = require('payupLib');
var contextLib = require('/lib/xp/context');

exports.post = actionSelector;
exports.get = actionSelector;

function actionSelector(req) {
  var context = payup.context(req);
  switch (req.params.action) {
    case 'add':
      cartLib.addToCart(req.params.productId);
      break;
    case 'remove':
      contextLib.run({
        branch: 'draft',
        user: {
          login: 'su',
          userStore: 'system'
        }
      }, function() {
        cartLib.removeFromCart(context.cart._id, req.params.quantity, req.params.productId);
      });
      break;
    case 'addQty':
      contextLib.run({
        branch: 'draft',
        user: {
          login: 'su',
          userStore: 'system'
        }
      }, function() {
        cartLib.addToCartQuantity(context.cart._id, req.params.quantity, req.params.productId);
        });

      break;
  }
}
