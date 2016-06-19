var contentLib = require('/lib/xp/content');
var portal = require('/lib/xp/portal');

exports = {
  createOrder: createOrderFromCart,
  updateOrder: updateOrderStatus
};

function createOrderFromCart(cart, amount) {
  var site = portal.getSite();
  var orderName = getDate();
  var order = contentLib.create({
    name: orderName,
    parentPath: site._path + '/orders',
    displayName: orderName,
    branch: 'draft',
    contentType: 'no.iskald.payup.store:order',
    data: {
      customer: cart.data.customer,
      amount: amount,
      cart: cart._id,
      items: cart.data.items
    }
  });

  contentLib.publish({keys: [order._id], sourceBranch: 'draft', targetBranch: 'master'});
  return order;
}

function updateOrderStatus(orderId) {
  
  function editor(c) {
    log.info("**** Updating orderstatus");
    c.data.status = 'payed';
    return c;
  }
  
  var order = contentLib.modify({
    key: orderId,
    editor: editor,
    branch: 'draft'
  });

  log.info(JSON.stringify(order));

  contentLib.publish({keys: [order._id], sourceBranch: 'draft', targetBranch: 'master'});
}

function getDate() {
  var date = new Date();
  var day = date.getDate();
  var monthIndex = date.getMonth() + 1;
  var year = date.getFullYear();

  return day + '-' + monthIndex + '-' + year + '-' + date.getMilliseconds();
}
