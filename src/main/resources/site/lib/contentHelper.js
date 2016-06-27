var contentLib = require('/lib/xp/content');
var contextLib = require('/lib/xp/context');
var portal = require('/lib/xp/portal');

exports = {
    list: list,
    deleteContent: deleteContent,
    createContent: createContent,
    modifyContent: modifyContent,
    contentCount: contentCount
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
    var branch = contextLib.get().branch;
    contextLib.run({
        branch: 'draft',
        user: {
            login: 'su',
            userStore: 'system'
        }
    }, function () {
        contentLib.delete({
            key: contentId
        });
        publish(contentId, branch);
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
        var branch = contextLib.get().branch;
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
            publish(c._id, branch);
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
    var branch = contextLib.get().branch;
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
        publish(c._id, branch);
    });
}

function contentCount(params) {
    if (!params) throw "Cannot create content. Missing parameter: params";
    if (!params.type) throw "Cannot create content. Missing parameter: type";

    var result = contentLib.query({
        query: "",
        branch: 'draft',
        contentTypes: [
            'no.iskald.payup.store:' + params.type
        ]
    });

    return result.total;
}

function publish(key, branch) {

    log.info("**** Branch -> " + branch);
    if (branch == 'master') {
        contentLib.publish({keys: [key], sourceBranch: 'draft', targetBranch: 'master'});
    }
}
