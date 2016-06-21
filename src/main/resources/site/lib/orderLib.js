var portal = require('/lib/xp/portal');
var contentHelper = require('contentHelper');

exports = {
    createOrder: createOrderFromCart,
    updateOrder: updateOrderStatus
};

function createOrderFromCart(cart, shippingAddress, amount) {
    var orderName = getDate();

    var params = {
        name: orderName,
        displayName: orderName,
        type: 'order',
        path: '/orders',
        data: {
            amount: amount,
            cart: cart._id,
            items: cart.data.items,
            name: shippingAddress.name,
            address: shippingAddress.address,
            zip: shippingAddress.zip,
            city: shippingAddress.city
        }
    };
    if (cart.data.customer) {
        params.data.customer = cart.data.customer
    }
    return contentHelper.createContent(params);
}

function updateOrderStatus(orderId, status) {
    function editor(c) {
        c.data.status = status;
        return c;
    }

    var params = {
        id: orderId,
        editor: editor
    };
    contentHelper.modifyContent(params);
}

function getDate() {
    var date = new Date();
    var day = date.getDate();
    var monthIndex = date.getMonth() + 1;
    var year = date.getFullYear();

    return day + '-' + monthIndex + '-' + year + '-' + date.getMilliseconds();
}
