// 扩展内定义的方法
exports.methods = {
    open: function () {
        Editor.Panel.open('i18n');
    }
};
// 当扩展被启动的时候执行
exports.load = function () { };
// 当扩展被关闭的时候执行
exports.unload = function () { };
