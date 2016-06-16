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
  function editor(c) {
    var currentData = c.data.items;
    log.info("HI FROM EDITOR");

    if (!currentData) {
      c.data.items = {
        "product": productId,
        "quantity": quantity
      }
    } else {
      if (!Array.isArray(c.data.items)) {
        if (c.data.items.product == productId) {
          var currentQuantity = parseInt(c.data.items["quantity"]);
          c.data.items["quantity"] = currentQuantity + parseInt(quantity);
        } else {
          var array = [];
          array.push(c.data.items);
          array.push({
            "product": productId,
            "quantity": quantity
          });
          c.data.items = array;
        }
      } else {
        var exists = false;
        c.data.items.forEach(function(item) {
          if (item.product == productId) {
            var currentQuantity = parseInt(item.quantity);
            item.quantity = currentQuantity + parseInt(quantity);
            exists = true;
          }
        });
        if (!exists) {
          c.data.items.push({
            "product": productId,
            "quantity": quantity
          })
        }
      }
    }
    return c;
  }

  contentLib.modify({
    key: cartId,
    editor: editor
  });

}


function removeFromCart(cartId, quantity, productId) {
  if (!cartId) throw "Cannot remove from cart. Missing parameter: cartId";
  if (!quantity) throw "Cannot remove from cart. Missing parameter: quantity";
  if (!productId) throw "Cannot remove from cart. Missing parameter: productId";

  function editor(c) {
    var currentData = c.data.items;
    if (!currentData) {
      return c;
    } else {
      if (!Array.isArray(c.data.items)) {
        if (c.data.items.product == productId) {
          var currentQuantity = parseInt(c.data.items["quantity"]);
          var newQuantity = currentQuantity - parseInt(quantity);
          if (newQuantity == 0) {
            c.data.items = null;
          } else {
            c.data.items["quantity"] = newQuantity;
          }
        }
      } else {
        c.data.items.forEach(function(item, index) {
          if (item.product == productId) {
            var currentQuantity = parseInt(item.quantity);
            var newQuantity = currentQuantity - parseInt(quantity);
            if (newQuantity == 0) {
              c.data.items[index] = null;
            } else {
              item.quantity = newQuantity;
            }
          }
        });
      }
    }
    return c;
  }

  contentLib.modify({
    key: cartId,
    editor: editor
  });
}

function getCart(customer) {
  if (!customer && !customer._id) throw "Cannot get cart. Missing parameter: customer";
  var cartResult = contentLib.query({
    query: "data.customer = '" + customer._id + "'",
    branch: 'draft',
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
      branch: 'draft',
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
