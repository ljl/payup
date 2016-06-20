var payup = require('payupLib');
var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');

exports.get = function (req) {
  var context = payup.context(req);
  var checkoutUrl = portal.serviceUrl({
    service: "checkout"
  });

  var model = {};
  model.checkoutUrl = checkoutUrl;
  model.itemCount = context.cartItemsTotal;
  model.componentUrl = portal.componentUrl({});
  model.cart = context.cart;
  model.items = appendRemoveFromCartLink(context.cartItems);
  model.totalPrice = context.cartTotal;

  return {
    body: thymeleaf.render(resolve('cart.html'), model)
  }
};

function appendRemoveFromCartLink(items) {
  items.forEach(function (item) {
    log.info(JSON.stringify(item));
    item.removeFromCart = portal.serviceUrl({
      service: 'cart',
      params: {
        action: 'remove',
        productId: item.product._id,
        quantity: 1
      }
    })
  });
  return items;
}
