/*
 * @Author: hrd
 * @Date: 2022-05-10 20:36:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-03 10:24:05
 * @FilePath: \SanGuo\assets\script\game\actor\ActorNickBox.ts
 * @Description:
 *
 */
import BaseCmp from '../../app/core/mvc/view/BaseCmp';
import { DynamicImage } from '../base/components/DynamicImage';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ActorNickBox extends BaseCmp {
    @property(cc.Layout)
    private LayoutBox: cc.Layout = null;
    // 官职图标
    @property(DynamicImage)
    private SprRealm: DynamicImage = null;
    @property(cc.RichText)
    private LabName: cc.RichText = null;

    public setName(v: string): void {
        this.LabName.string = v;
        this.LayoutBox.node.active = true;
    }
}
