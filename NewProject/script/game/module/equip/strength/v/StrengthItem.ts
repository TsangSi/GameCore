import { DynamicImage } from '../../../../base/components/DynamicImage';
import { UtilEquip } from '../../../../base/utils/UtilEquip';
import { ItemIconOptions } from '../../../../com/item/ItemConst';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import ItemModel from '../../../../com/item/ItemModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class StrengthItem extends cc.Component {
    @property(ItemIcon) /** 图标 */
    private ItemIcon: ItemIcon = null;

    @property(DynamicImage)/** 默认装备图标 */
    private SprDefaultIcon: DynamicImage = null;

    @property(cc.Label) /** 装备强化等级 */
    private LabLv: cc.Label = null;

    @property(cc.Node)// 屏蔽点击
    private NdEvent: cc.Node = null;

    /** 设置强化等级 */
    public setLabLv(lv: number, activate: boolean = true): void {
        if (!activate) {
            this.LabLv.node.active = false;
            return;
        }
        const str = lv ? `+${lv}` : '';
        this.LabLv.string = str;
    }

    /** 设置ItemIcon数据 */
    public loadIcon(data: ItemModel, opts?: ItemIconOptions): void {
        this.ItemIcon.setData(data, opts);
    }

    /** 默认图标 */
    public initDefaultIcon(active: boolean, equipPart?: number): void {
        if (active) {
            const equipIconStr: string = UtilEquip.getEquipIconByPart(equipPart);
            this.SprDefaultIcon.loadImage(equipIconStr, 1, false);
            this.ItemIcon.setData(null);
            this.ItemIcon.refreshQualityBg(0);
        }
        this.SprDefaultIcon.node.active = active;
    }

    // 屏蔽点击
    public showEventNode(activate: boolean): void {
        this.NdEvent.active = activate;
    }
}
