var contentLib = require('/lib/xp/content');
var customerLib = require('customerLib');
var portal = require('/lib/xp/portal');
var contentUtil = __.newBean("no.iskald.payup.ContentUtil");
var cartUtil = __.newBean("no.iskald.payup.CartUtil");

exports = {
  getCart: getCart,
  addToCartQuantity: addToCartQuantity,
  removeFromCart: removeFromCart
};

function getCart(customerId) {
  if (!customerId) throw "Missing parameter: customerId";
  var cartResult = contentLib.query({
    query: "data.customer = '" + customerId + "'",
    contentTypes: [
      'no.iskald.payup.store:cart'
    ]
  });
  if (cartResult.count > 1) throw "Multiple carts found for customer " + customerId;

  return cartResult.hits[0];
}

function addToCartQuantity(cartId, quantity, productId) {
  var site = portal.getSite();
  if (!cartId) {
    var customer = customerLib.getCustomer();
    cartId = createCart(customer);
  }
  cartUtil.addToCart(cartId, quantity, productId);
}


function removeFromCart(cartId, quantity, productId) {
  if (!cartId) throw "Missing parameter: cartId";
  cartUtil.removeFromCart(cartId, quantity, productId);
}

function createCart(customer) {
  if (!customer) throw "Missing parameter: customer";
  var cart = contentLib.create({
    name: 'Cart for ' + customer.displayName,
    parentPath: site._path + '/shopping-carts',
    displayName: 'Cart for ' + customer.displayName,
    branch: 'draft',
    contentType: 'no.iskald.payup.store:cart',
    data: {
      name: 'Cart for ' + customer.displayName,
      customer: customer._id
    }
  });

  return cart._id;
}
