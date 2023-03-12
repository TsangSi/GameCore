/*
 * @Author: hwx
 * @Date: 2022-06-09 18:53:12
 * @FilePath: \SanGuo2.4\assets\script\game\com\tab\TabItemC.ts
 * @Description: 页签选项
 */
import { TabData } from './TabData';
import { TabItem } from './TabItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class TabItemC extends TabItem {
    /**
     * 设置数据
     * @param data
     */
    public setData(data: TabData): void {
        super.setData(data);
        // this.SprRightLine.node.active = data.isTrail;
    }
}
