var portal = require('/lib/xp/portal'); // Import the portal functions
var thymeleaf = require('/lib/xp/thymeleaf'); // Import the Thymeleaf rendering function
var i18nLib = require('/lib/xp/i18n');
var payup = require('payupLib');
var orderLib = require('orderLib');
var contentLib = require('/lib/xp/content');
var stripe = __.newBean("no.iskald.payup.StripeCharger");

exports.post = doCheckout;
exports.get = getCheckout;

function css() {
  var html = '';
  html += '<link rel="stylesheet" type="text/css" href="';
  html += portal.assetUrl({
    path: 'css/stripe.css'
  });
  html += '" />';
  return html;
}

function scripts() {
  var html = '';
  html += '<script src="';
  html += portal.assetUrl({
    path: 'js/payup.js'
  });
  html += '"></script>';
  return html;
}

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
  var context = payup.context();
  clearOrders(context);
  var view = resolve('stripe.html');
  var order = orderLib.createOrder(context.cart, context.cartTotal);
  var model = {
    order: order,
    cart: context.cart,
    items: context.cartItems,
    totalPrice: context.cartTotal,
    component: portal.getComponent(),
    completeCheckoutUrl: portal.serviceUrl({
      service: "checkout"
    }),
    publishableKey: portal.getSiteConfig().publishableKey,
    i18n: getLocalizedStrings()
  };

  return {
    body: thymeleaf.render(view, model),
    pageContributions: {
      headEnd: css(),
      bodyEnd: scripts()
    }
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

// TODO: Should create order
function doCheckout(req) {
  var context = payup.context();

  var secretApiKey = portal.getSiteConfig().secretKey;
  var currency = portal.getSiteConfig().currency;
  var stripeResponse = stripe.chargeCard(secretApiKey, req.params.token, context.cartTotal, context.cart.displayName, currency);
  var model = {};
  return {
    body: stripeResponse
  }
}
