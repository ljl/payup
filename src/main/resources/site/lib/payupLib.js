var cartLib = require('cartLib');
var customerLib = require('customerLib');

exports = {
  context: getContext
};

function getContext(req) {
  var context = {};
  context.customer = customerLib.getCustomer();
  if (!context.customer) {
    context.cart = cartLib.getCartFromSession(req.cookies.JSESSIONID);
  } else {
    context.cart = cartLib.getCartFromCustomer(context.customer);
  }
  context.cartItems = cartLib.getCartItems(context.cart);
  context.cartItemsTotal = getItemCount(context.cartItems);
  context.cartTotal = getTotalPrice(context.cartItems);
  context.req = req;

  var contextDebug = {
    method: req.method,
    url: req.url,
    session: req.cookies.JSESSIONID,
    customer: context.customer ? context.customer._name : 'no-customer',
    cart: context.cart ? context.cart._id : 'no-cart'
  };

  log.info("**** CONTEXT ****");
  log.info(JSON.stringify(contextDebug, null, 2));
  return context;
}

function getItemCount(cartItems) {
  if (!cartItems) return 0;
  var itemCount = 0;
  cartItems.forEach(function (item) {
    itemCount = itemCount + item.quantity;
  });
  return itemCount;
}

function getTotalPrice(cartItems) {
  if (!cartItems) return 0;
  var totalPrice = 0;
  cartItems.forEach(function (item) {
    totalPrice += item.price;
  });
  return totalPrice;
}
