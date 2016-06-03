var contentLib = require('/lib/xp/content');
var customerLib = require('customerLib');
var portal = require('/lib/xp/portal');
var contentUtil = __.newBean("no.iskald.payup.ContentUtil");
var cartUtil = __.newBean("no.iskald.payup.CartUtil");

exports = {
  getCart: getCart,
  addToCart: addToCart,
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


// TODO: Replace methods
function addToCart(productId) {
  var cart = getCart();
  if (!cart) {
    // TODO: separate method
    var customer = customerLib.getCustomer();
    cart = contentLib.create({
      name: customer.displayName + ' cart',
      parentPath: '/',
      displayName: customer.displayName + ' cart',
      branch: 'draft',
      contentType: 'no.iskald.payup.store:cart',
      data: {
        name: customer.displayName + ' cart',
        customer: customer._id
      }
    });
  }
  contentUtil.appendContent(cart._id, "products", productId);
  return cart;
}

function removeFromCart(productId) {
  var cart = getCart();
  contentUtil.removeContent(cart._id, "products", productId);
  return cart;
}
