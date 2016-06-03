var cartLib = require('cartLib');
var customerLib = require('customerLib');

var stripe = __.newBean("no.iskald.stripe.StripeCharger");

exports.post = doCheckout;
exports.get = doCheckout;

// TODO: Doesnt work, should create order
function doCheckout(req) {
  var customer = customerLib.getCustomer();
  var cart = cartLib.getCart(customer._id);

  var secretApiKey = portal.getSiteConfig().secretKey;
  var currency = portal.getSiteConfig().currency;
  var purchaseItems = getContentFromIdList(portal.getComponent().config.item);
  var priceTotal = getPriceTotal(purchaseItems);
  var stripeResponse = stripe.chargeCard(secretApiKey, req.params.token, priceTotal, portal.getComponent().config.description, currency);
  var model = {};
  return {
    body: stripeResponse
  }
}
