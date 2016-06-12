var contentLib = require('/lib/xp/content');
var portal = require('/lib/xp/portal');
var cartUtil = __.newBean("no.iskald.payup.CartUtil");

exports = {
  getCart: getCart,
  addToCartQuantity: addToCartQuantity,
  removeFromCart: removeFromCart,
  getCartItems: getCartItems
};

function addToCartQuantity(cartId, quantity, productId) {
  cartUtil.addToCart(cartId, quantity, productId);
}


function removeFromCart(cartId, quantity, productId) {
  if (!cartId) throw "Cannot remove from cart. Missing parameter: cartId";
  if (!quantity) throw "Cannot remove from cart. Missing parameter: quantity";
  if (!productId) throw "Cannot remove from cart. Missing parameter: productId";
  cartUtil.removeFromCart(cartId, quantity, productId);
}

function getCart(customer) {
  if (!customer && !customer._id) throw "Cannot get cart. Missing parameter: customer";
  var cartResult = contentLib.query({
    query: "data.customer = '" + customer._id + "'",
    contentTypes: [
      'no.iskald.payup.store:cart'
    ]
  });
  log.info(JSON.stringify(cartResult, null, 2));
  if (cartResult.count > 1) {
    log.error("Multiple carts found for customer " + customer._id);
  }

  if (cartResult.count == 1) {
    return cartResult.hits[0];
  }
  return createCart(customer);
}

function createCart(customer) {
  if (!customer) throw "Cannot create cart. Missing parameter: customer";
  var site = portal.getSite();
  try {
    var cart = contentLib.create({
      name: 'Cart - ' + customer.displayName,
      parentPath: site._path + '/shopping-carts',
      displayName: 'Cart for ' + customer.displayName,
      contentType: 'no.iskald.payup.store:cart',
      data: {
        name: 'Cart for ' + customer.displayName,
        customer: customer._id
      }
    });
  } catch (e) {
    if (e.code == 'contentAlreadyExists') {
      log.error('There is already a content with that name');
    } else {
      log.error('Unexpected error: ' + e.message);
    }
  }

  return cart;
}

function getCartItems(cart) {
  var items = [];
  if (cart && cart.data.items) {
    if (!Array.isArray(cart.data.items)) {
      cart.data.items = [cart.data.items];
    }
    cart.data.items.forEach(function (item) {
      var product = contentLib.get({
        key: item.product
      });
      var price = product.data.price * item.quantity;

      items.push({
        product: product,
        price: price,
        quantity: item.quantity
      });
    });
  }
  return items;
}
