var cartLib = require('cartLib');
var customerLib = require('customerLib');
var contentLib = require('/lib/xp/content');
var contentHelper = require('contentHelper');
var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');

exports.get = function (req) {
  var model = {};

  var cart = cartLib.getCart(customerLib.getCustomer()._id);
  log.info("*** CART PART***");
  log.info(JSON.stringify(cart, null, 2));
  //TODO: extract method
  var items = [];
  var itemCount = 0;
  if (cart && cart.data.items) {
    if (!Array.isArray(cart.data.items)) {
      cart.data.items = [cart.data.items];
    }
    cart.data.items.forEach(function (item) {
      log.info(item.product);
      var product = contentLib.get({
        key: item.product
      });
      var price = product.data.price * item.quantity;
      itemCount = itemCount + item.quantity;
      items.push({
        product: product,
        price: price,
        quantity: item.quantity,
        removeFromCart: portal.serviceUrl({
          service: "cart",
          params: {
            action: "remove",
            productId: product._id,
            quantity: 1
          }
        })
      });
    });
  }

  var totalPrice = 0;
  items.forEach(function (item) {
    totalPrice += item.price;
  });

  model.itemCount = itemCount;
  model.componentUrl = portal.componentUrl({});
  model.cart = cart;
  model.items = items;
  model.totalPrice = totalPrice;

  return {
    body: thymeleaf.render(resolve('cart.html'), model),
  }
}
