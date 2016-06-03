var authLib = require('/lib/xp/auth');
var contentLib = require('/lib/xp/content');
var portalLib = require('/lib/xp/portal');

exports = {
  getCustomer: getCustomer
}

function getCustomer() {
  log.info("*** customerLib.getCustomer()");
  var user = authLib.getUser().key;
  log.info(user);
  if (user) {
    var customer = fetchCustomer(user);
    if (!customer) {
      return createCustomer(user);
    }
    return customer;
  }
  throw "User doesnt exist";
};

function fetchCustomer(userKey) {
  var customerResult = contentLib.query({
    query: "data.userKey = '" + userKey + "'",
    contentTypes: [
      'no.iskald.payup.store:customer'
    ],
  });
  log.info("FetchCustomer(" + userKey + ")" + JSON.stringify(customerResult, null, 2));
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
  log.info("CreateCustomer(" + userKey + ")" + JSON.stringify(createCustomerResult, null, 2));
  return createCustomerResult;
}
