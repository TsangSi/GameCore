// 扩展内定义的方法
exports.methods = {
    open () {
        Editor.Panel.open('i18n');
    },
};

// 当扩展被启动的时候执行
exports.load = () => {};

// 当扩展被关闭的时候执行
exports.unload = () => {};
