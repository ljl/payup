var contentLib = require('/lib/xp/content');
var contentHelper = require('contentHelper');
var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');

exports.get = function (req) {
    var currency = portal.getSiteConfig().currency;
    var config = portal.getComponent().config;

    var products = getProducts(config);
    var model = {
        products: products,
        portal: portal,
        currency: currency,
        config: config
    };

    return {
        body: thymeleaf.render(resolve('product-list.html'), model),
    }
};

function getProducts(config) {
    var products;

    if (!config || !config.item) {
        products = contentLib.query({
            contentTypes: [
                'no.iskald.payup.store:product'
            ]
        }).hits;
    } else {
        products = contentHelper.list(config.item);
    }

    if (products) {
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
    }

    return products;
}
