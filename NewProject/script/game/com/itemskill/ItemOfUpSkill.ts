/*
 * @Author: wangxin
 * @Date: 2022-08-09 18:21:44
 * @FilePath: \SanGuo\assets\script\game\com\itemskill\ItemOfUpSkill.ts
 * @Description: 进阶技能栏道具自定义模板
 */

import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../app/base/utils/UtilNum';
import { UtilGame } from '../../base/utils/UtilGame';
import UtilRedDot from '../../base/utils/UtilRedDot';
import { RedDotMgr } from '../../module/reddot/RedDotMgr';
import { ItemIcon } from '../item/ItemIcon';
import ItemModel from '../item/ItemModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemOfUpSkill extends cc.Component {
    @property(cc.Node)
    protected item: cc.Node = null;

    @property(cc.Node)
    protected itemList: cc.Node = null;

    private showRedDot: boolean = true;
    /**
     * 设置道具面板的道具和回调
     * @param itemData[] 道具模型list
     * @param itemNum[][] 已有道具数量， 所需道具数量
     * @param cb 回调方法
     */
    public setData(itemData: ItemModel[], itemNum: number[][], btnLabel: string, cb: () => void, redId: number): void {
        this.setItemList(itemData, itemNum[0], itemNum[1]);
        this.setClickBtn(btnLabel, cb, redId);
    }

    public setItemList(itemData: ItemModel[], countN: number[], needNum: number[]): void {
        this.showRedDot = true;
        this.itemList.destroyAllChildren();
        this.itemList.removeAllChildren();
        itemData.forEach((k, i) => {
            const item: cc.Node = cc.instantiate(this.item);
            item.active = true;
            item.getComponent(ItemIcon).setData(k, { needName: false, needNum: false, num1Show: false });
            this.itemList.addChild(item);
            this.showRedDot = this.showRedDot && countN > needNum;
            const num = item.getChildByName('itemNum');
            const numR = num.getChildByName('numR').getComponent(cc.Label);
            numR.string = UtilNum.Convert(countN[i]);
            const color: string = countN[i] >= needNum[i] ? UtilColor.GreenD : UtilColor.RedD;
            numR.node.color = UtilColor.Hex2Rgba(color);
            const numL = num.getChildByName('numL').getComponent(cc.Label);
            numL.string = `/${needNum[i].toString()}`;
        });
        this.itemList.getComponent(cc.Layout).updateLayout();
    }

    public setClickBtn(btnLabel: string, cb: () => void, redId: number): void {
        const clickBtn: cc.Node = this.node.getChildByName('clickBtn');
        clickBtn.getComponentInChildren(cc.Label).string = btnLabel;
        if (RedDotMgr.I.getStatus(redId)) {
            UtilRedDot.Bind(redId, clickBtn, cc.v2(70, 20));
        } else {
            UtilRedDot.Unbind(clickBtn);
        }
        // UtilRedDot.UpdateRed(clickBtn, redStats, v3(70, 20, 0));
        UtilGame.Click(clickBtn, cb, this);
    }
}
