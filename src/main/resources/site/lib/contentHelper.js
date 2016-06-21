var contentLib = require('/lib/xp/content');
var contextLib = require('/lib/xp/context');
var portal = require('/lib/xp/portal');

exports = {
    list: list,
    deleteContent: deleteContent,
    createContent: createContent,
    modifyContent: modifyContent
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

function deleteContent(contentId) {
    contextLib.run({
        branch: 'draft',
        user: {
            login: 'su',
            userStore: 'system'
        }
    }, function () {
        contentLib.delete({
            key: contentId,
            branch: 'draft'
        });
        contentLib.publish({keys: [contentId], sourceBranch: 'draft', targetBranch: 'master'});
    });
}

function createContent(params) {
    if (!params) throw "Cannot create content. Missing parameter: params";
    if (!params.name) throw "Cannot create content. Missing parameter: name";
    if (!params.path) throw "Cannot create content. Missing parameter: path";
    if (!params.displayName) throw "Cannot create content. Missing parameter: displayName";
    if (!params.type) throw "Cannot create content. Missing parameter: type";
    if (!params.data) throw "Cannot create content. Missing parameter: data";
    var site = portal.getSite();
    try {

        return contextLib.run({
            branch: 'draft',
            user: {
                login: 'su',
                userStore: 'system'
            }
        }, function () {
            var c = contentLib.create({
                name: params.name,
                parentPath: site._path + params.path,
                displayName: params.displayName,
                contentType: 'no.iskald.payup.store:' + params.type,
                branch: 'draft',
                data: params.data
            });
            contentLib.publish({keys: [c._id], sourceBranch: 'draft', targetBranch: 'master'});

            return c;
        });
    } catch (e) {
        if (e.code == 'contentAlreadyExists') {
            log.error('There is already a content with that name');
        } else {
            log.error('Unexpected error: ' + e.message);
        }
    }
}

function modifyContent(params) {
    if (!params) throw "Cannot create content. Missing parameter: params";
    if (!params.id) throw "Cannot create content. Missing parameter: id";
    if (!params.editor) throw "Cannot create content. Missing parameter: editor";

    return contextLib.run({
        branch: 'draft',
        user: {
            login: 'su',
            userStore: 'system'
        }
    }, function () {
        var c = contentLib.modify({
            key: params.id,
            editor: params.editor,
            branch: 'draft'
        });
        contentLib.publish({keys: [c._id], sourceBranch: 'draft', targetBranch: 'master'});
    });
}

