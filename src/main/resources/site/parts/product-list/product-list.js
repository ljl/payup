var contentLib = require('/lib/xp/content');
var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');

exports.get = function (req) {
  var products = contentLib.query({
    contentTypes: [
      'no.iskald.payup.store:product'
    ],
  }).hits;

  products.forEach(function (product) {
    product.imageUrl = portal.imageUrl({
      id: product.data.image,
      scale: 'width(500)',
      format: 'jpeg'
    });
    product.addToCart = portal.serviceUrl({
      service: "cart",
      params: {
        action: "addQty",
        productId: product._id,
        quantity: 1
      }
    });
  });

  var model = {
    products: products,
    portal: portal
  };
  log.info(JSON.stringify(model, null, 2));
  return {
    body: thymeleaf.render(resolve('product-list.html'), model),
  }
}
