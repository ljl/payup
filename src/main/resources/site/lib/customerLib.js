var authLib = require('/lib/xp/auth');
var contentLib = require('/lib/xp/content');
var portalLib = require('/lib/xp/portal');

exports = {
  getCustomer: getCustomer
}

function getCustomer() {
  var user = authLib.getUser().key;

  if (user) {
    var customer = fetchCustomer(user);
    if (!customer) {
      return createCustomer(user);
    }
    return customer;
  }
  throw "User doesnt exist";
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
  var site = portalLib.getSite();
  var createCustomerResult = contentLib.create({
    name: 'customer-' + userKey,
    parentPath: site._path + '/customers',
    displayName: 'customer-' + userKey,
    contentType: 'no.iskald.payup.store:customer',
    data: {
      userKey: userKey
    }
  });

  return createCustomerResult;
}
