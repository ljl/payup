var authLib = require('/lib/xp/auth');
var contentLib = require('/lib/xp/content');
var contentHelper = require('contentHelper');

exports = {
  getCustomer: getCustomer,
  updateAddress: updateAddress
};

function getCustomer() {
  var user = authLib.getUser();
  if (user && user.key) {
    var customer = fetchCustomer(user.key);
    if (!customer) {
      return createCustomer(user.key);
    }
    return customer;
  }
  return null;
}

function updateAddress(customer, params) {
  if (customer && customer.data) {
    if (customer.data.name == params.name &&
        customer.data.address == params.address &&
        customer.data.zip == params.zip &&
        customer.data.city == params.city) {
      return customer;
    }
  }

  function editor(c) {
    c.data.name = params.name;
    c.data.address = params.address;
    c.data.zip = params.zip;
    c.data.city = params.city;

    return c;
  }

  return contentHelper.modifyContent({
    id: customer._id,
    editor: editor
  });
}

function fetchCustomer(userKey) {
  var customerResult = contentLib.query({
    query: "data.userKey = '" + userKey + "'",
    branch: "draft",
    contentTypes: [
      'no.iskald.payup.store:customer'
    ]
  });
  if (customerResult.count == 0) return;

  if (customerResult.count > 1) {
    customerResult.hits.forEach(function (customer) {
      contentLib.delete({
        key: customer._id
      });
    });
  }
  return customerResult.hits[0];
}

function createCustomer(userKey) {
  var params = {
    name: 'customer-' + userKey,
    displayName: 'customer-' + userKey,
    path: '/customers',
    type: 'customer',
    data: {
      userKey: userKey
    }
  };

  return contentHelper.createContent(params);
}
