var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var contentLib = require('/lib/xp/content');
var authLib = require('/lib/xp/auth');
var contentHelper = require('contentHelper');
var customerLib = require('customerLib');
var cartLib = require('cartLib');

exports.get = function (req) {
  var customer = customerLib.getCustomer();
  var cart = cartLib.getCart(customer);


  var products;
  if (cart && cart.data.products) {
    products = contentHelper.list(cart.data.products);
  }

  log.info("***** CUSTOMER *****");
  log.info(JSON.stringify(customer, null, 2));
  log.info("***** CART *****");
  log.info(JSON.stringify(cart, null, 2));
  log.info("***** PRODUCTS *****");
  log.info(JSON.stringify(products, null, 2));

  var model = {
    customer: customer,
    cart: cart,
    products: products
  };
  return {
    body: thymeleaf.render(resolve('product.html'), model),
  }
}
