/*
 * @Author: hwx
 * @Date: 2022-06-20 11:48:21
 * @FilePath: \SanGuo\assets\script\game\module\bag\v\BagItemIcon.ts
 * @Description: 背包道具图标
 */
import ItemModel from '../../../com/item/ItemModel';
import { ItemIcon } from '../../../com/item/ItemIcon';
import { ItemBagType, ItemType, ItemWhere } from '../../../com/item/ItemConst';
import { BagMgr } from '../BagMgr';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class BagItemIcon extends cc.Component {
    @property(ItemIcon)
    private NdIcon: ItemIcon = null;

    @property(cc.Sprite)
    private SprNew: cc.Sprite = null;
    @property(cc.Sprite)
    private SprArrow: cc.Sprite = null;

    private _itemModel: ItemModel;

    public setData(itemModel: ItemModel): void {
        // 复用后把数据的新字去掉
        this.setItemNotNew();

        // 设置新数据
        this._itemModel = itemModel;
        this.NdIcon.setData(itemModel, { where: ItemWhere.BAG, needName: true, needNum: true });
        this.NdIcon.setClickCallback(() => {
            if (this.SprNew.node.active) {
                this.SprNew.node.active = false;
                itemModel.isNew = false;
                // 修改原数据
                BagMgr.I.setItemIsNew(this._itemModel.data.OnlyId, false);
            }
        }, this);

        // 一键使用红点
        // if (itemModel.cfg.OneKeyUse) {
        //     UtilRedDot.New(this.node, v3(37, 37, 0));
        // } else {
        //     UtilRedDot.Hide(this.node);
        // }

        UtilRedDot.UpdateRed(this.node, itemModel.cfg.Type === ItemType.CHEST, cc.v2(37, 37));

        // 新道具新字
        this.SprNew.node.active = !!itemModel.isNew;

        if (itemModel.cfg.BagType === ItemBagType.EQUIP_ROLE) {
            /** 角色已穿戴 */
            const roleEquipMap = BagMgr.I.getOnEquipMapWithEquipPart();
            const equipModel = roleEquipMap.get(itemModel.cfg.EquipPart);
            // 该部位有穿戴，并且有战力 才可以对比战力
            if (equipModel && equipModel.fightValue) { // 战力大于 已经穿的装备 显示上升箭头
                if (equipModel.fightValue >= itemModel.fightValue) {
                    this.SprArrow.node.active = false;
                } else {
                    // 人物基础等级 lv
                    const userLevel: number = RoleMgr.I.d.Level;
                    // 角色穿戴战力小于 背包  && 军衔等级需要满足
                    const armyLevel = RoleMgr.I.getArmyLevel();
                    const userStar = RoleMgr.I.getArmyStar();

                    const equipRebornLv = itemModel.cfg.ArmyLevel;
                    const equipStar = itemModel.cfg.Star;
                    const equipLevel: number = itemModel.cfg.Level;

                    if (equipRebornLv) {
                        if (armyLevel > equipRebornLv) { // 判断星级
                            this.SprArrow.node.active = true;
                        } else if (armyLevel === equipRebornLv && userStar >= equipStar) {
                            this.SprArrow.node.active = true;
                        } else {
                            this.SprArrow.node.active = false;
                        }
                    } else if (userLevel >= equipLevel) { // 玩家等级大于装备等级
                        this.SprArrow.node.active = true;
                    }
                }
            } else { // 没穿直接显示
                this.SprArrow.node.active = true;
            }
        } else {
            this.SprArrow.node.active = false;
        }
    }

    protected onDisable(): void {
        // 隐藏后把数据的新字去掉
        this.setItemNotNew();
    }

    private setItemNotNew() {
        if (this._itemModel && this._itemModel.isNew) {
            // 深度拷贝数据，不会影响原数据
            this._itemModel.isNew = false;
            // 修改原数据
            BagMgr.I.setItemIsNew(this._itemModel.data.OnlyId, false);
        }
    }
}
