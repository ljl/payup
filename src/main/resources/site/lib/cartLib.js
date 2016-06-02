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

function getCart() {
  var customer = customerLib.getCustomer();
  var cart;
  if (customer) {
    cart = contentLib.query({
      query: "data.customer = '" + customer._id + "'",
      contentTypes: [
        'no.iskald.payup.store:cart'
      ]
    }).hits[0];
  }

  return cart;
}

function addToCartQuantity(quantity, productId) {
  log.info("*** ADD TO CART ***");
  var site = portal.getSite();
  var cart = getCart();
  log.info(JSON.stringify(cart, null, 2));
  if (!cart) {
    // TODO: separate method
    var customer = customerLib.getCustomer();
    cart = contentLib.create({
      name: customer.displayName + ' cart',
      parentPath: site._path + '/shopping-carts',
      displayName: customer.displayName + ' cart',
      branch: 'draft',
      contentType: 'no.iskald.payup.store:cart',
      data: {
        name: customer.displayName + ' cart',
        customer: customer._id
      }
    });
  }

  cartUtil.addToCart(cart._id, quantity, productId);
  return cart;
}

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
