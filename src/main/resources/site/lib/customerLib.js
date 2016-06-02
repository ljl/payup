var authLib = require('/lib/xp/auth');
var contentLib = require('/lib/xp/content');

exports.getCustomer = function () {
  var user = authLib.getUser().key;
  var customer = contentLib.query({
    query: "data.name = '" + user + "'",
    contentTypes: [
      'no.iskald.payup.store:customer'
    ],
  });
  return customer.hits[0];
};
