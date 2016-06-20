var contentLib = require('/lib/xp/content');
var portal = require('/lib/xp/portal');
var contextLib = require('/lib/xp/context');

exports = {
  createOrder: createOrderFromCart,
  updateOrder: updateOrderStatus
};

function createOrderFromCart(cart, shippingAddress, amount, customer) {
  log.info("CREATING ORDER");
  log.info(JSON.stringify(customer, null, 2));
  var site = portal.getSite();
  var orderName = getDate();
  var order = contextLib.run({
    branch: 'draft',
    user: {
      login: 'su',
      userStore: 'system'
    }
  }, function() {
    var data = {
      amount: amount,
        cart: cart._id,
        items: cart.data.items,
        name: shippingAddress.name,
        address: shippingAddress.address,
        zip: shippingAddress.zip,
        city: shippingAddress.city
    };
    if (cart.data.customer) {
      data.customer = cart.data.customer
    }
    var o = contentLib.create({
      name: orderName,
      parentPath: site._path + '/orders',
      displayName: orderName,
      branch: 'draft',
      contentType: 'no.iskald.payup.store:order',
      data: data
    });
    contentLib.publish({keys: [o._id], sourceBranch: 'draft', targetBranch: 'master'});
    return o;
  });

  log.info(JSON.stringify(order));

  return order;
}

function updateOrderStatus(orderId, status) {
  contextLib.run({
    branch: 'draft',
    user: {
      login: 'su',
      userStore: 'system'
    }
  }, function() {
    function editor(c) {
      log.info("**** Updating orderstatus");
      c.data.status = status;
      return c;
    }

    var order = contentLib.modify({
      key: orderId,
      editor: editor,
      branch: 'draft'
    });

    contentLib.publish({keys: [order._id], sourceBranch: 'draft', targetBranch: 'master'});
  });
}

function getDate() {
  var date = new Date();
  var day = date.getDate();
  var monthIndex = date.getMonth() + 1;
  var year = date.getFullYear();

  return day + '-' + monthIndex + '-' + year + '-' + date.getMilliseconds();
}
