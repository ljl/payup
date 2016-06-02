var authLib = require('/lib/xp/auth');
var contentLib = require('/lib/xp/content');
var portalLib = require('/lib/xp/portal');

exports = {
  getCustomer: getCustomer
}

function getCustomer() {
  log.info("**** CUSTOMER LIB ****");
  var user = authLib.getUser().key;
  var customerResult = contentLib.query({
    query: "data.userKey = '" + user + "'",
    contentTypes: [
      'no.iskald.payup.store:customer'
    ],
  });
  log.info(JSON.stringify(customerResult, null, 2));
  if (customerResult.count == 0) {
    log.info("Customer doesnt exists, creating new from user");
    return createCustomer(user);
  }
  return customerResult.hits[0];
};

function createCustomer(userKey) {
  var site = portalLib.getSite();
  var result1 = contentLib.create({
    name: 'customer-' + userKey,
    parentPath: site._path + '/customers',
    displayName: 'customer-' + userKey,
    contentType: 'no.iskald.payup.store:customer',
    data: {
      userKey: userKey
    }
  });
}
