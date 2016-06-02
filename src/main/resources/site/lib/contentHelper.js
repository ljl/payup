var contentLib = require('/lib/xp/content');

exports = {
  list: list
};

function list(contentListCsv) {
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
