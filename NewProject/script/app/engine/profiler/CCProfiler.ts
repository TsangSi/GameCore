/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable new-cap */
export default class CCProfiler {
}

let _rootNode: cc.Node;
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (e) => {
    if (e.keyCode !== cc.macro.KEY.c) return;

    if (!_rootNode) {
        const keys = Object.keys(cc.game['_persistRootNodes']);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, dot-notation
        _rootNode = cc.game[`_persistRootNodes`][keys[0]];
        if (_rootNode) {
            const childrens: cc.Node[] = _rootNode[`_children`];
            const rightNode = childrens[1];
            rightNode.x = 350;

            const lbLeft: cc.Label = childrens[0].getComponent(cc.Label);
            const lbRight: cc.Label = childrens[1].getComponent(cc.Label);
            lbLeft.fontSize = 30;
            lbRight.fontSize = 30;
            lbLeft.lineHeight = 30;
            lbRight.lineHeight = 30;

            const c1: cc.Color = new cc.Color(255, 0, 0, 255);// 左边颜色
            const c2 = new cc.Color(0, 0, 255, 255);// 右边颜色
            lbLeft.node.color = c1;
            lbRight.node.color = c2;
            // lbLeft.string += '按上下左右箭头移动 \n';
        }
    }
    if (_rootNode) {
        if (e.keyCode === 38) { // 按 上
            _rootNode.y += 20;
        }
        if (e.keyCode === 40) { // 按 下
            _rootNode.y -= 20;
        }
        if (e.keyCode === 37) { // 按 左
            _rootNode.x -= 20;
        }
        if (e.keyCode === 39) { // 按 右
            _rootNode.x += 20;
        }
    }
}, this);
