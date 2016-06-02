var libs = {
  portal: require('/lib/xp/portal'),
  thymeleaf: require('/lib/xp/thymeleaf')
};
var cartLib = require('cartLib');
var contentHelper = require('contentHelper');
var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');

// Handle GET request
exports.get = handleGet;

function handleGet(req) {

  var site = libs.portal.getSite(); // Current site
  var content = libs.portal.getContent(); // Current content
  var view = resolve('default.html'); // The view to render
  var model = createModel(); // The model to send to the view

  function createModel() {
    var model = {};

    model.mainRegion = content.page.regions['main'];
    model.siteName = site.displayName;

    var cart = cartLib.getCart();
    log.info("*** CART PART***");
    log.info(JSON.stringify(cart, null, 2));
    //TODO: extract method
    var items = [];
    if (cart && cart.data.items) {
      cart.data.items.forEach(function (item) {
        log.info(item.product);
        var product = contentLib.get({
          key: item.product
        });
        items.push({
          product: product,
          quantity: item.quantity,
          removeFromCart: portal.serviceUrl({
            service: "cart",
            params: {
              action: "remove",
              productId: product._id
            }
          })
        });
      });
    }

    model.cart = cart;
    model.items = items;

    return model;
  }

  return {
    body: libs.thymeleaf.render(view, model)
  };
}
