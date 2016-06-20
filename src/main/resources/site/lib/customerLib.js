var authLib = require('/lib/xp/auth');
var contentLib = require('/lib/xp/content');
var portalLib = require('/lib/xp/portal');

exports = {
  getCustomer: getCustomer,
  updateAddress: updateAddress
};

function getCustomer() {
  var user = authLib.getUser();
  log.info("***USER");
  log.info(JSON.stringify(user, null, 2));
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
  log.info("*** Updating customer");
  if (customer.data.name == params.name &&
      customer.data.address == params.address &&
      customer.data.zip == params.zip &&
      customer.data.city == params.city) {
    return customer;
  }
  log.info("No previous settings");
  function editor(c) {
    c.data.name = params.name;
    c.data.address = params.address;
    c.data.zip = params.zip;
    c.data.city = params.city;

    return c;
  }

  var updatedCustomer = contentLib.modify({
    key: customer._id,
    editor: editor,
    branch: 'draft'
  });

  contentLib.publish({keys: [customer._id], sourceBranch: 'draft', targetBranch: 'master'});

  return updatedCustomer;
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
