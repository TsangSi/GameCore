/*
 * @Author: kexd
 * @Date: 2022-04-24 11:51:31
 * @LastEditTime: 2022-12-13 10:57:15
 * @LastEditors: Please set LastEditors
 * @Description: 动画控制器基类
 * @FilePath: \SanGuo\assets\script\game\base\anim\AnimCmp.ts
 */
import AnimCom from './AnimCom';

const { ccclass } = cc._decorator;

@ccclass
export class AnimCmp extends cc.Component {
    /**
     * 动画节点
     */
    private pNode: AnimCom = null;

    protected onLoad(): void {
        this.pNode = this.node as AnimCom;
    }

    protected onDestroy(): void {
        // 调用AnimBase的release清除数据，纹理资源的清除是在CreateAnimaForSheet里
        if (this.pNode) {
            this.pNode.isUsed = false;
            // this.pNode.release();
        }
        this.pNode = null;
        // 清所有的定时事件
        this.unscheduleAllCallbacks();
    }

    protected onEnable(): void {
        //
    }

    protected onDisable(): void {
        //
    }
}
