var cartLib = require('cartLib');
var payup = require('payupLib');

exports = {
    post: actionSelector,
    get: actionSelector
};

function actionSelector(req) {
    var context = payup.context(req);
    switch (req.params.action) {
        case 'remove':
            if (!context.cart) {
                context.cart = cartLib.createCart(context);
            }
            cartLib.removeFromCart(context.cart._id, req.params.quantity, req.params.productId);
            break;
        case 'addQty':
            if (!context.cart) {
                context.cart = cartLib.createCart(context);
            }
            cartLib.addToCartQuantity(context.cart._id, req.params.quantity, req.params.productId);
            break;
    }
}
