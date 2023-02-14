"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.unload = exports.onAfterBuild = exports.onAfterCompressSettings = exports.onBeforeCompressSettings = exports.onBeforeBuild = exports.load = exports.throwError = void 0;
var path = require('path');
// import { path } from "cc";
var original_fs_1 = require("original-fs");
var PACKAGE_NAME = 'hot-update';
function log() {
    var arg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arg[_i] = arguments[_i];
    }
    return console.log.apply(console, __spreadArrays(["[" + PACKAGE_NAME + "] "], arg));
}
var allAssets = [];
exports.throwError = true;
function load() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[" + PACKAGE_NAME + "] Load cocos plugin example in builder.");
                    return [4 /*yield*/, Editor.Message.request('asset-db', 'query-assets')];
                case 1:
                    allAssets = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.load = load;
function onBeforeBuild(options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Todo some thing
            log(PACKAGE_NAME + ".webTestOption", 'onBeforeBuild');
            return [2 /*return*/];
        });
    });
}
exports.onBeforeBuild = onBeforeBuild;
function onBeforeCompressSettings(options, result) {
    return __awaiter(this, void 0, void 0, function () {
        var pkgOptions;
        return __generator(this, function (_a) {
            pkgOptions = options.packages[PACKAGE_NAME];
            if (pkgOptions.webTestOption) {
                console.debug('webTestOption', true);
            }
            // Todo some thing
            console.debug('get settings test', result.settings);
            return [2 /*return*/];
        });
    });
}
exports.onBeforeCompressSettings = onBeforeCompressSettings;
function onAfterCompressSettings(options, result) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Todo some thing
            console.log('webTestOption', 'onAfterCompressSettings');
            return [2 /*return*/];
        });
    });
}
exports.onAfterCompressSettings = onAfterCompressSettings;
function onAfterBuild(options, result) {
    return __awaiter(this, void 0, void 0, function () {
        var uuidTestMap, _i, _a, name_1, uuid, inject_script, url;
        return __generator(this, function (_b) {
            uuidTestMap = {
                image: '57520716-48c8-4a19-8acf-41c9f8777fb0'
            };
            for (_i = 0, _a = Object.keys(uuidTestMap); _i < _a.length; _i++) {
                name_1 = _a[_i];
                uuid = uuidTestMap[name_1];
                console.debug("containsAsset of " + name_1, result.containsAsset(uuid));
                console.debug("getAssetPathInfo of " + name_1, result.getAssetPathInfo(uuid));
                console.debug("getRawAssetPaths of " + name_1, result.getRawAssetPaths(uuid));
                console.debug("getJsonPathInfo of " + name_1, result.getJsonPathInfo(uuid));
            }
            inject_script = "\n    (function () {\n        if (typeof window.jsb === 'object') {\n            var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');\n            if (hotUpdateSearchPaths) {\n                var paths = JSON.parse(hotUpdateSearchPaths);\n                jsb.fileUtils.setSearchPaths(paths);\n    \n                var fileList = [];\n                var storagePath = paths[0] || '';\n                var tempPath = storagePath + '_temp/';\n                var baseOffset = tempPath.length;\n    \n                if (jsb.fileUtils.isDirectoryExist(tempPath) && !jsb.fileUtils.isFileExist(tempPath + 'project.manifest.temp')) {\n                    jsb.fileUtils.listFilesRecursively(tempPath, fileList);\n                    fileList.forEach(srcPath => {\n                        var relativePath = srcPath.substr(baseOffset);\n                        var dstPath = storagePath + relativePath;\n    \n                        if (srcPath[srcPath.length] == '/') {\n                            cc.fileUtils.createDirectory(dstPath)\n                        }\n                        else {\n                            if (cc.fileUtils.isFileExist(dstPath)) {\n                                cc.fileUtils.removeFile(dstPath)\n                            }\n                            cc.fileUtils.renameFile(srcPath, dstPath);\n                        }\n                    })\n                    cc.fileUtils.removeDirectory(tempPath);\n                }\n            }\n        }\n    })();\n    ";
            console.log('开始写入main.js');
            url = path.join(result.paths.dir, 'main.js');
            original_fs_1.readFile(url, 'utf8', function (err, data) {
                if (err) {
                    throw err;
                }
                var newStr = inject_script + data;
                original_fs_1.writeFile(url, newStr, function (error) {
                    if (error) {
                        throw error;
                    }
                    console.log('写入完成main.js');
                    console.log("SearchPath updated in built main.js for hot update");
                });
            });
            return [2 /*return*/];
        });
    });
}
exports.onAfterBuild = onAfterBuild;
function unload() {
    console.log("[" + PACKAGE_NAME + "] Unload cocos plugin example in builder.");
}
exports.unload = unload;
