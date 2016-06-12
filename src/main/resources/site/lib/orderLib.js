var contentLib = require('/lib/xp/content');
var portal = require('/lib/xp/portal');
var orderUtil = __.newBean("no.iskald.payup.OrderUtil");

exports = {
  createOrder: createOrderFromCart
};

function createOrderFromCart(cart, amount) {
  var site = portal.getSite();
  var orderName = 'Order - ' + cart._id + ' - ' + getDate();
  var order = contentLib.create({
    name: orderName,
    parentPath: site._path + '/orders',
    displayName: orderName,
    contentType: 'no.iskald.payup.store:order',
    data: {
      customer: cart.data.customer,
      amount: amount
    }
  });
  if (!Array.isArray(cart.data.items)) {
    cart.data.items = [cart.data.items];
  }

  cart.data.items.forEach(function (item) {
    log.info(JSON.stringify(item));
    orderUtil.addToOrder(order._id, item.quantity, item.product)
  });
  return order;
}

function getDate() {
  var date = new Date();
  var day = date.getDate();
  var monthIndex = date.getMonth() + 1;
  var year = date.getFullYear();

  return day + '-' + monthIndex + '-' + year + '-' + date.getMilliseconds();
}
