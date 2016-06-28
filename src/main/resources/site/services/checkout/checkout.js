var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var i18nLib = require('/lib/xp/i18n');
var payup = require('payupLib');
var orderLib = require('orderLib');
var customerLib = require('customerLib');
var cartLib = require('cartLib');
var stripe = __.newBean("no.iskald.payup.StripeCharger");


exports.get = getCheckout;
exports.post = doCheckout;


function getCheckout(req) {
    var context = payup.context(req);
    var view = resolve('checkout.html');
    var currency = portal.getSiteConfig().currency;
    var shippingDetails = getShippingDetails(context.customer);

    var model = {
        cart: context.cart,
        items: context.cartItems,
        currency: currency,
        totalPrice: context.cartTotal,
        shippingDetails: shippingDetails,
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

function doCheckout(req) {
    var context = payup.context(req);
    var shippingAddress = getAddress(context.customer, req.params);
    var order = orderLib.createOrder(context.cart, shippingAddress, context.cartTotal);
    var secretApiKey = portal.getSiteConfig().secretKey;
    var currency = portal.getSiteConfig().currency;
    var charge = stripe.chargeCard(secretApiKey, req.params.token, context.cartTotal, 'Order ID:' + order.displayName, currency);

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
function getShippingDetails(customer) {
    var details = {};
    if (customer && customer.data) {
        details.name = customer.data.name;
        details.address = customer.data.address;
        details.zip = customer.data.zip;
        details.city = customer.data.city;
    }
    return details;
}
function getAddress(customer, data) {
    var shippingAddress = {};
    if (customer) {
        var updatedCustomer = customerLib.updateAddress(customer, data);
        shippingAddress.name = updatedCustomer.data.name;
        shippingAddress.address = updatedCustomer.data.address;
        shippingAddress.zip = updatedCustomer.data.zip;
        shippingAddress.city = updatedCustomer.data.city;
    } else {
        shippingAddress.name = data.name;
        shippingAddress.address = data.address;
        shippingAddress.zip = data.zip;
        shippingAddress.city = data.city;
    }

    return shippingAddress;
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