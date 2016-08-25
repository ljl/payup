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
    var currency = portal.getSiteConfig().currency;
    var shippingDetails = getShippingDetails(context.customer);
    var publishableKey = portal.getSiteConfig().publishableKey;
    var secretKey = portal.getSiteConfig().secretKey;
    var model, view;

    if (publishableKey && secretKey) {
        view = resolve('checkout.html');
        
        model = {
            cart: context.cart,
            items: context.cartItems,
            currency: currency,
            totalPrice: context.cartTotal,
            shippingDetails: shippingDetails,
            component: portal.getComponent(),
            completeCheckoutUrl: portal.serviceUrl({
                service: "checkout"
            }),
            publishableKey: publishableKey,
            i18n: getLocalizedStrings()
        };
        
    } else {
        view = resolve('checkout-error.html');
        model = {
            
        }
    }
    return {
        body: thymeleaf.render(view, model)
    };
}

function doCheckout(req) {
    var context = payup.context(req);
    var shippingAddress = getAddress(context.customer, req.params);
    var secretApiKey = portal.getSiteConfig().secretKey;
    var currency = portal.getSiteConfig().currency;
    var order = orderLib.createOrder(context.cart, shippingAddress, context.cartTotal);
    if (!order) throw "Could not create order";
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
        customerLib.updateAddress(customer, data);
    }
    shippingAddress.name = data.name;
    shippingAddress.address = data.address;
    shippingAddress.zip = data.zip;
    shippingAddress.city = data.city;

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