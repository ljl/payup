var cartLib = require('cartLib');
var contentHelper = require('contentHelper');
var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');

exports.get = function (req) {
  var cart = cartLib.getCart();
  log.info("*** CART PART***");
  log.info(JSON.stringify(cart, null, 2));

  var products = [];
  if (cart && cart.data.products) {
    products = contentHelper.list(cart.data.products);
    products.forEach(function (product) {
      product.removeFromCart = portal.serviceUrl({
        service: "cart",
        params: {
          action: "remove",
          productId: product._id
        }
      });
    });
  }

  var model = {
    cart: cart,
    products: products
  };
  return {
    body: thymeleaf.render(resolve('cart.html'), model),
  }
}
