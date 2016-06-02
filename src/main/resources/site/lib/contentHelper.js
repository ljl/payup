var contentLib = require('/lib/xp/content');

exports.list = function (contentListCsv) {
  var contentList = (contentListCsv + "").split(',');
  var content = [];
  contentList.forEach(function (contentKey) {
    var c = contentLib.get({
      key: contentKey
    });
    content.push(c);
  });

  return content;
}
