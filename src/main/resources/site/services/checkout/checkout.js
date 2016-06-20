var portal = require('/lib/xp/portal'); // Import the portal functions
var thymeleaf = require('/lib/xp/thymeleaf'); // Import the Thymeleaf rendering function
var i18nLib = require('/lib/xp/i18n');
var payup = require('payupLib');
var orderLib = require('orderLib');
var customerLib = require('customerLib');
var cartLib = require('cartLib');
var contentLib = require('/lib/xp/content');
var contextLib = require('/lib/xp/context');
var stripe = __.newBean("no.iskald.payup.StripeCharger");

exports.post = doCheckout;
exports.get = getCheckout;


function getLocalizedStrings() {
  return {
    cardholdername: i18nLib.localize({
      key: 'cardholdername'
    }),
    cardnumber: i18nLib.localize({
      key: 'cardnumber'
    }),
    expiration: i18nLib.localize({
      key: 'expiration'
    }),
    priceTotal: i18nLib.localize({
      key: 'priceTotal'
    })
  };
}

function getCheckout(req) {
  var context = payup.context(req);
  var view = resolve('checkout.html');
  var currency = portal.getSiteConfig().currency;
  
  var model = {
    cart: context.cart,
    items: context.cartItems,
    currency: currency,
    totalPrice: context.cartTotal,
    component: portal.getComponent(),
    completeCheckoutUrl: portal.serviceUrl({
      service: "checkout"
    }),
    publishableKey: portal.getSiteConfig().publishableKey,
    i18n: getLocalizedStrings()
  };

  return {
    body: thymeleaf.render(view, model)
  }
}

function clearOrders(context) {
  var orderResult = contentLib.query({
    query: "data.customer = '" + context.customer._id + "'",
    contentTypes: [
      'no.iskald.payup.store:order'
    ]
  });
  log.info("**** ORDER *****");
  log.info(JSON.stringify(orderResult, null, 2));
  orderResult.hits.forEach(function (o) {
    contentLib.delete({
      key: o._id
    })
  });
}

function doCheckout(req) {
  log.info("*** Performing checkout");
  var context = payup.context(req);
  var shippingAddress = getAddress(context.customer, req.params);
  log.info(JSON.stringify(shippingAddress));
  var order = orderLib.createOrder(context.cart, shippingAddress, context.cartTotal, context.customer);
  var secretApiKey = portal.getSiteConfig().secretKey;
  var currency = portal.getSiteConfig().currency;
  var charge = stripe.chargeCard(secretApiKey, req.params.token, context.cartTotal, context.cart.displayName, currency);
  log.info("*** Payment complete -> " + JSON.stringify(charge.status));

  var template;
  if (charge.status == "succeeded") {
    template = resolve('checkout-complete.html');
    orderLib.updateOrder(order._id, 'payment-complete');
    cartLib.archiveCart(context.cart._id);
  } else {
    template = resolve('checkout-failed.html');
    orderLib.updateOrder(order._id, 'payment-failed');
  }

  var model = {
    order: order,
    charge: charge
  };
  return {
    body: thymeleaf.render(template, model)
  }
}

function getAddress(customer, data) {
  var shippingAddress = {};
  if (customer) {
    var updatedCustomer = customerLib.updateAddress(context.customer, data);
    shippingAddress.name = updatedCustomer.name;
    shippingAddress.address = updatedCustomer.address;
    shippingAddress.zip = updatedCustomer.zip;
    shippingAddress.city = updatedCustomer.city;
  } else {
    shippingAddress.name = data.name;
    shippingAddress.address = data.address;
    shippingAddress.zip = data.zip;
    shippingAddress.city = data.city;
  }

  return shippingAddress;
}