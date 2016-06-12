var portal = require('/lib/xp/portal'); // Import the portal functions
var thymeleaf = require('/lib/xp/thymeleaf'); // Import the Thymeleaf rendering function
var contentLib = require('/lib/xp/content');
var i18nLib = require('/lib/xp/i18n');
var authLib = require('/lib/xp/auth');

var stripe = __.newBean("no.iskald.stripe.StripeCharger");

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

function getContentFromIdList(idList) {
  var idList = idList + ''; // Parse as string
  var contentIdList = idList.split(',');
  var contentList = [];
  contentIdList.forEach(function (contentId) {
    var content = contentLib.get({
      key: contentId
    });
    contentList.push(content);
  });
  return contentList;
}

function getPriceTotal(contentList) {
  var amount = 0;

  contentList.forEach(function (content) {
    amount += parseFloat(content.data.price);
  });

  return amount;
}

exports.get = function (req) {
  var view = resolve('stripe.html');
  var purchaseItems = getContentFromIdList(portal.getComponent().config.item);

  var model = {
    component: portal.getComponent(),
    componentUrl: portal.componentUrl({}),
    publishableKey: portal.getSiteConfig().publishableKey,
    purchaseItems: purchaseItems,
    priceTotal: getPriceTotal(purchaseItems),
    i18n: getLocalizedStrings()
  };
  return {
    body: thymeleaf.render(view, model),
    pageContributions: {
      headEnd: css(),
      bodyEnd: scripts()
    }
  }
};

exports.post = function (req) {
  var secretApiKey = portal.getSiteConfig().secretKey;
  var currency = portal.getSiteConfig().currency;
  var purchaseItems = getContentFromIdList(portal.getComponent().config.item);
  var priceTotal = getPriceTotal(purchaseItems);
  var stripeResponse = stripe.chargeCard(secretApiKey, req.params.token, priceTotal, portal.getComponent().config.description, currency);
  var model = {};
  return {
    body: stripeResponse
  }
};
