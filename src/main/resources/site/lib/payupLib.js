var portal = require('/lib/xp/portal'); // Import the portal functions
var thymeleaf = require('/lib/xp/thymeleaf'); // Import the Thymeleaf rendering function
var contentLib = require('/lib/xp/content');
var authLib = require('/lib/xp/auth');
var cartLib = require('cartLib');
var customerLib = require('customerLib');

exports = {
  context: getContext
};

function getContext() {
  var context = {};

  context.customer = customerLib.getCustomer();
  context.cart = cartLib.getCart(context.customer);
  context.cartItems = cartLib.getCartItems(context.cart);
  context.cartItemsTotal = getItemCount(context.cartItems);
  context.cartTotal = getTotalPrice(context.cartItems);

  log.info("**** CONTEXT ****");
  log.info(JSON.stringify(context, null, 2));
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
