var contentHelper = require('contentHelper');

exports = {
    createOrder: createOrderFromCart,
    updateOrder: updateOrderStatus
};

function createOrderFromCart(cart, shippingAddress, amount) {
    var orderId = getOrderId();
    var params = {
        name: orderId,
        displayName: orderId,
        type: 'order',
        path: '/orders',
        data: {
            amount: amount,
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

function getOrderId() {
    var count = contentHelper.contentCount({
        type: 'order'
    });
    var date = new Date();
    

    return count + "" + date.getMilliseconds();
}
