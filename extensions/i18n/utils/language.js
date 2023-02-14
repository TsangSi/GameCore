"use strict";
exports.__esModule = true;
exports.remove = exports.create = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var template = fs_1.readFileSync(path_1.join(__dirname, './template.txt'), 'utf-8');
/**
 * 创建新的语言包
 * @param {string} name
 * @return {Promise}
 */
var create = function (name) {
    var js = template.replace('{{name}}', name);
    var url = "db://assets/gamelogic/i18n/" + name + ".ts";
    return new Promise(function (resolve, reject) {
        var t = Editor.Message.request('asset-db', 'create-asset', url, js, { overwrite: true });
        t.then(function () {
            resolve();
        })["catch"](function (err) {
            reject(err);
        });
    });
};
/**
 * 删除语言包
 * @param {string} name
 */
var remove = function (name) {
    var url = "db://assets/gamelogic/i18n/" + name + ".ts";
    return new Promise(function (resolve, reject) {
        var t = Editor.Message.request('asset-db', 'delete-asset', url);
        t.then(function () {
            resolve();
        })["catch"](function (err) {
            reject(err);
        });
    });
};
var _create = create;
exports.create = _create;
var _remove = remove;
exports.remove = _remove;
