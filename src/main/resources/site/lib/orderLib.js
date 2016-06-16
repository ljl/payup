var contentLib = require('/lib/xp/content');
var portal = require('/lib/xp/portal');

exports = {
  createOrder: createOrderFromCart
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

function getDate() {
  var date = new Date();
  var day = date.getDate();
  var monthIndex = date.getMonth() + 1;
  var year = date.getFullYear();

  return day + '-' + monthIndex + '-' + year + '-' + date.getMilliseconds();
}
