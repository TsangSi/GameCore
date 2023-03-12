/*
 * @Author: hrd
 * @Date: 2022-05-27 17:41:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-27 17:33:18
 * @FilePath: \SanGuo\assets\script\game\com\win\WinBase.ts
 * @Description:
 */
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';

const { ccclass, property } = cc._decorator;
@ccclass
export default class WinBase extends BaseUiView {
    /** 内容节点 */
    @property(cc.Node)
    protected NdContent: cc.Node = null;
    /** 遮罩 */
    @property(cc.Node)
    protected NodeBlack: cc.Node = null;

    protected onLoad(): void {
        super.onLoad();
    }

    public showEffect(): void {
        // 弹出动画效果
    }
}
