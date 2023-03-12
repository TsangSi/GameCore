/* eslint-disable dot-notation */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: zs
 * @Date: 2022-04-25 21:47:05
 * @LastEditors: Please set LastEditors
 * @Description:
 *
 */

// import { CCObject, NodeActivator } from 'cc';
console.log('CC_EDITOR=', CC_EDITOR);
cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
    setTimeout(() => {
        const _destroyComp = cc.director['_nodeActivator'].destroyComp;
        /**
         * 重写销毁组件接口
         * 节点没有激活，就不会进入节点的脚本onLoad，没有进onLoad就不会进onDestroy
         */
        cc.director['_nodeActivator'].destroyComp = function (comp: any) {
            if (!CC_EDITOR && comp.onDestroy && !(comp._objFlags & cc.Object['Flags']['IsOnLoadCalled']) && comp.node && comp.node.parent) {
                comp.onDestroy();
            }
            _destroyComp.apply(this, arguments);
        };
    }, 1000);
});
