/*
 * @Author: hrd
 * @Date: 2022-09-06 20:32:38
 * @Description: cocos 动画帧事件
 */
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';

const { ccclass, menu, property } = cc._decorator;
@ccclass
@menu('常用组件/AnimFrameEvent')
export class AnimFrameEvent extends BaseCmp {
    /** 动画空节点 */
    @property(cc.Node)
    private NdAnim: cc.Node = null;
    /** 帧事件回调函数 */
    public callBack: (param: unknown, nd?: cc.Node) => void = null;
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unused-vars
    public eventFunc(param): void {
        if (this.callBack) {
            this.callBack(param, this.NdAnim);
        }
    }
}
