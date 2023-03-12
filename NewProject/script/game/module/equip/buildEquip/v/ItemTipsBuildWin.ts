/** import {' cc._decorator, cc.Node, cc.Label } 'from 'cc';  // */
import { i18n, Lang } from '../../../../../i18n/i18n';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import ItemModel from '../../../../com/item/ItemModel';
import WinBase from '../../../../com/win/WinBase';
import { RoleMgr } from '../../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsBuildWin extends WinBase {
    //
    @property(cc.Node)
    private NdSprMask: cc.Node = null;

    /** 标题 */
    @property(cc.Label)
    private LabTitle: cc.Label = null;
    @property(cc.Label)
    private LabType: cc.Label = null;

    @property(cc.Label)
    private LabDescs: cc.Label[] = [];

    @property(ItemIcon)
    private itemIcon: ItemIcon = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => {
            this.close();
        }, this, { scale: 1 });
    }

    public init(param?: ItemModel[]): void {
        console.log(param);
        const item: ItemModel = param[0];
        const rebornLv: number = RoleMgr.I.getArmyLevel() || 1;

        this.itemIcon.setData(item, { hideStar: true });

        this.LabTitle.string = `${rebornLv}${i18n.lv}${item.cfg.Name}`;// 级
        this.LabType.string = `${i18n.tt(Lang.item_tips_type_title)}${UtilItem.GetRoleEquipPartName(item.cfg.EquipPart)}`;// 类型

        const name: string = item.cfg.Name;

        this.LabDescs[0].string = `${i18n.tt(Lang.build_bdhd)} ${rebornLv}${i18n.lv}2${i18n.star}${name}`;// 保底获得
        this.LabDescs[1].string = `${i18n.tt(Lang.build_glhd)} ${rebornLv}${i18n.lv}3${i18n.star}${name}`;// 概率获得
        this.LabDescs[2].string = `${i18n.tt(Lang.build_glhd)} ${rebornLv}${i18n.lv}4${i18n.star}${name}`;// 概率获得
        this.LabDescs[3].string = `${i18n.tt(Lang.build_glhd)} ${rebornLv}${i18n.lv}5${i18n.star}${name}`;// 概率获得
        // this.LabDescs[3].string = `概率获得 ${rebornLv}级5星${item.cfg.Name}`;
        //
    }
}
