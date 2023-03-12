import { EventClient } from '../../../../../app/base/event/EventClient';
import { i18n } from '../../../../../i18n/i18n';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import ItemModel from '../../../../com/item/ItemModel';
import { E } from '../../../../const/EventName';

const { ccclass, property } = cc._decorator;

@ccclass
export class NdBuildItem extends cc.Component {
    /** 图标 */
    @property(ItemIcon)
    private icon: ItemIcon = null;
    /** 物品加载中状态 */
    private loading: boolean = false;

    @property(cc.Node)
    private bgNd: cc.Node = null;

    @property(cc.Label)
    private LabCount: cc.Label = null;

    @property(cc.Label)
    private LabLv: cc.Label = null;

    @property(cc.Node)
    private clickNode: cc.Node = null;

    public start(): void {
        this.clickNode.active = false;
        UtilGame.Click(this.clickNode, () => {
            EventClient.I.emit(E.UpStar.ClickSelectEquip);
        }, this, { scale: 1 });
    }

    public loadIcon(data: ItemModel, opts?: any): void {
        if (this.bgNd) { // 隐藏背景
            this.bgNd.active = false;
        }
        this.icon.node.active = true;
        this.icon.setData(data, opts);
    }

    public setLv(lv: number): void {
        this.LabLv.string = lv ? `${lv}${i18n.jie}` : '';// 阶
    }

    public setCount(strNum: string, color: cc.Color): void {
        this.LabCount.string = strNum;
        this.LabCount.node.color = color;
    }

    public hideLv(sta: boolean = false): void {
        this.LabLv.node.active = sta;
    }

    public hideCount(sta: boolean = false): void {
        this.LabCount.node.active = sta;
    }

    public clear(): void {
        this.bgNd.active = true;
        if (this.icon) {
            this.icon.node.active = false;
        }

        this.hideCount();
        this.hideLv();
        this.setData(null);
    }

    public setData(dta: any): void {
        if (dta) {
            this.clickNode.active = true;
        } else {
            this.clickNode.active = false;
        }
    }

    public hideClickNode(sta: boolean): void {
        this.clickNode.active = sta;
    }
}
