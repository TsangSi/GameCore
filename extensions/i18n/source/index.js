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
exports.__esModule = true;
exports.ready = exports.$ = exports.style = exports.template = void 0;
var path_1 = require("path");
var fs_1 = require("fs");
var language_1 = require("../utils/language");
var package_json_1 = require("../package.json");
var vue_1 = require("../source/vue");
exports.template = fs_1.readFileSync(path_1.join(__dirname, './template/home.html'), 'utf-8');
exports.style = fs_1.readFileSync(path_1.join(__dirname, 'style/home.css'), 'utf-8');
exports.$ = {
    home: '#home',
    current: '.current'
};
function ready() {
    return __awaiter(this, void 0, void 0, function () {
        var v;
        return __generator(this, function (_a) {
            v = new vue_1["default"]({
                el: this.$.home,
                data: function () {
                    return {
                        state: 'normal',
                        languages: [],
                        current: '',
                        _language: ''
                    };
                },
                created: function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var languages, current, index;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Editor.Profile.getProject(package_json_1.name, 'languages')];
                                case 1:
                                    languages = _a.sent();
                                    if (languages.length === 0) {
                                        Editor.Profile.setProject(package_json_1.name, 'languages', languages.map(function (name) { return name; }));
                                    }
                                    if (languages) {
                                        languages.forEach(function (name) {
                                            _this.languages.push(name);
                                        });
                                    }
                                    return [4 /*yield*/, Editor.Profile.getProject(package_json_1.name, 'default_language')];
                                case 2:
                                    current = _a.sent();
                                    index = this.languages.indexOf(current);
                                    if (index !== -1) {
                                        // this.current = this.languages[0];
                                        // } else {
                                        this.current = current;
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    });
                },
                methods: {
                    changeCurrent: function (object) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                this.languageChanged(object.currentTarget.value);
                                this.current = object.currentTarget.value;
                                return [2 /*return*/];
                            });
                        });
                    },
                    languageChanged: function (name) {
                        return __awaiter(this, void 0, void 0, function () {
                            var url, label_script, find_name, new_name;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        Editor.Profile.setProject(package_json_1.name, 'default_language', name);
                                        url = path_1.join(__dirname, '../../../assets/scripts/i18n/i18n.ts');
                                        label_script = fs_1.readFileSync(url, 'utf8');
                                        find_name = this.current;
                                        new_name = name;
                                        if (this.current === '') {
                                            find_name = 'i18n/';
                                            new_name = "i18n/" + name;
                                        }
                                        label_script = label_script.replace(new RegExp(find_name), new_name);
                                        fs_1.writeFileSync(url, label_script);
                                        url = path_1.join(__dirname, '../../../assets/scripts/i18n/LocalizedLabel.ts');
                                        label_script = fs_1.readFileSync(url, 'utf8');
                                        if (this.current === '') {
                                            find_name = '_dataID: string = \'';
                                            new_name = "_dataID: string = '" + name;
                                        }
                                        label_script = label_script.replace(new RegExp(find_name), new_name);
                                        fs_1.writeFileSync(url, label_script);
                                        return [4 /*yield*/, Editor.Message.request('asset-db', 'refresh-asset', 'db://assets/scripts/i18n/LabelLocalized.ts')];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    },
                    languagesChanged: function (languages) {
                        Editor.Profile.setProject(package_json_1.name, 'languages', languages.map(function (name) { return name; }));
                    },
                    updatename: function (key) {
                        return Editor.I18n.t("i18n." + key);
                    },
                    _getLanguagePath: function (language) {
                        return path_1.join('gamelogic/i18n/', language + ".ts");
                    },
                    inputname: function (object) {
                        this._language = object.currentTarget.value;
                    },
                    changeEdit: function () {
                        if (this.state === 'edit') {
                            this.state = 'normal';
                        }
                        else {
                            this.state = 'edit';
                        }
                    },
                    changeCreate: function () {
                        if (this.state === 'create') {
                            this.state = 'normal';
                            this._language = '';
                        }
                        else {
                            this.state = 'create';
                            this._language = '';
                        }
                    },
                    createLanguage: function (name) {
                        var _this = this;
                        // 检查是否不存在
                        if (!name) {
                            return alert('创建语言失败 - 名称不能为空');
                        }
                        // 检查是否重名
                        if (this.languages.indexOf(name) !== -1) {
                            return alert('创建语言失败 - 该语言已经存在');
                        }
                        language_1.create(name).then(function () {
                            _this.languages.push(name);
                            if (!_this.current) {
                                _this.languageChanged(_this.languages[0]);
                                _this.current = _this.languages[0];
                            }
                            _this.languagesChanged(_this.languages);
                            _this._language = '';
                            _this.state = 'normal';
                        })["catch"](function () {
                            _this._language = '';
                            _this.state = 'normal';
                            // todo 错误提示
                        });
                    },
                    deleteLanguage: function (name) {
                        return __awaiter(this, void 0, void 0, function () {
                            var dialog_info;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        // 检查是否存在
                                        if (this.languages.indexOf(name) === -1) {
                                            return [2 /*return*/, alert('删除语言失败 - 该语言不存在')];
                                        }
                                        return [4 /*yield*/, Editor.Dialog.warn('Delete i18n language data, this cannot be undone!', {
                                                buttons: ['Cancel', 'OK'],
                                                title: 'Delete Language Data',
                                                detail: name
                                            })];
                                    case 1:
                                        dialog_info = _a.sent();
                                        if (dialog_info.response === 0) {
                                            return [2 /*return*/];
                                        }
                                        // 删除 profile
                                        language_1.remove(name).then(function () {
                                            var index = _this.languages.indexOf(name);
                                            _this.languages.splice(index, 1);
                                            _this.languagesChanged(_this.languages);
                                            if (name === _this.current) {
                                                var new_language = _this.languages[0] || '';
                                                _this.languageChanged(new_language);
                                                _this.current = new_language;
                                            }
                                        })["catch"](function () {
                                            // todo 错误提示
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }
                }
            });
            return [2 /*return*/];
        });
    });
}
exports.ready = ready;
