const { ccclass, property } = cc._decorator;

// 从非同步->同步渲染

@ccclass
export default class CCFrameBlockSync extends cc.Component {
    // 只要有这个组件 则不会加入分帧，会同步马上渲染

    // @property(cc.String)
    // public key: string = '';
}
