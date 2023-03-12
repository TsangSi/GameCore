/* eslint-disable max-len */
/*
 * @Author: hwx
 * @Date: 2022-06-17 14:17:55
 * @FilePath: \SanGuo\assets\script\game\com\tips\part\ItemTipsAttrsPart.ts
 * @Description: 道具Tips属性部件
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { AttrInfo } from '../../../base/attribute/AttrInfo';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { UtilEquip } from '../../../base/utils/UtilEquip';
import ModelMgr from '../../../manager/ModelMgr';
import { GradeMgr } from '../../../module/grade/GradeMgr';
import { ItemQuality, ItemType } from '../../item/ItemConst';
import ItemGemTip from '../item/ItemGemTip';
import { ItemTipsAttrItemInfo, ItemTipsAttrItemType } from '../ItemTipsConst';
import { BaseItemTipsPart } from './BaseItemTipsPart';
import { ItemTipsAttrItem } from './ItemTipsAttrItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsAttrsPart extends BaseItemTipsPart {
    @property(cc.Node)
    private NdItemTipsGemItem: cc.Node = null;

    @property(cc.Node)
    private NdGridLayout: cc.Node = null;

    @property(cc.RichText)
    private LabProperty: cc.RichText = null;

    protected refresh(): void {
        const attrsList: ItemTipsAttrItemInfo[] = [];
        // 基础属性
        const baseAttrId = this.itemModel.cfg.AttrId;
        let attrInfo: AttrInfo;
        if (baseAttrId) {
            attrInfo = AttrModel.MakeAttrInfo(baseAttrId);
        }
        const equipAttrId: number = this.getOtherTypeAttrId();
        if (equipAttrId) {
            if (attrInfo) {
                attrInfo.add({ attrs: UtilAttr.GetAttrBaseListById(equipAttrId) });
            } else {
                attrInfo = AttrModel.MakeAttrInfo(equipAttrId);
            }
        }
        UtilEquip.GetEquipAttrId(this.itemModel.cfg.SubType, this.itemModel.cfg.EquipPart, this.itemModel.data.OnlyId);
        // 基础属性
        if (attrInfo?.attrs?.length > 0) {
            const attrStr = UtilAttr.GetShowAttrStr(attrInfo.attrs, AttrInfo.ShowAttrType.SpaceAndColon);
            const title = this.itemModel.cfg.Type === ItemType.EQUIP ? i18n.tt(Lang.item_tips_base_attr_title) : i18n.tt(Lang.item_tips_attr);

            // 获取装备强化相关
            let strengthLv = 0;
            let strengthAttrStr = '';
            let goldLv = 0;
            let goldAttrStr = '';
            if (this.opts?.strengthLv) {
                strengthLv = this.opts?.strengthLv;
            }
            if (this.opts?.strengthAttrStr) {
                strengthAttrStr = this.opts?.strengthAttrStr;
            }
            if (this.opts?.goldLv) {
                goldLv = this.opts?.goldLv;
            }
            if (this.opts?.goldAttrStr) {
                goldAttrStr = this.opts?.goldAttrStr;
            }
            const itemInfo: ItemTipsAttrItemInfo = {
                id: ItemTipsAttrItemType.BASE,
                title,
                attrStr,
                strengthLv,
                strengthAttrStr,
                goldLv,
                goldAttrStr,
            };

            if (!goldLv || !goldAttrStr) {
                const goldAttrId = GradeMgr.I.getGoldEquipAttrId(this.itemModel.cfg.SubType, this.itemModel.cfg.EquipPart, this.itemModel.data.OnlyId);
                if (goldAttrId) {
                    const goldAttr = AttrModel.MakeAttrInfo(goldAttrId);
                    const [goldFv, goldAttrStr] = UtilAttr.GetTipsStrengthFvAttrStr(this.itemModel.cfg.AttrId, goldAttr);
                    itemInfo.goldLv = GradeMgr.I.getGoldEquipLevel(this.itemModel.cfg.SubType, this.itemModel.cfg.EquipPart, this.itemModel.data.OnlyId);
                    itemInfo.goldAttrStr = goldAttrStr;
                }
            }

            attrsList.push(itemInfo);
        }

        // 附加属性
        const addAttr = this.itemModel.data.AddAttr;
        if (addAttr && addAttr.length > 0) {
            const attrStr = UtilAttr.GetShowAttr1Str(addAttr);
            attrsList.push({ id: ItemTipsAttrItemType.ADD, title: i18n.tt(Lang.item_tips_add_attr_title), attrStr });
        } else if (this.itemModel.cfg.SubType === ItemType.EQUIP_ROLE && this.itemModel.cfg.Quality >= ItemQuality.PURPLE) {
            attrsList.push({
                id: ItemTipsAttrItemType.ADD,
                title: i18n.tt(Lang.item_tips_add_attr_title),
                attrStr: `<color=${UtilColor.GreenD}>${i18n.tt(Lang.com_random_attr)}\n${i18n.tt(Lang.com_random_attr)}\n${i18n.tt(Lang.com_random_attr)}</c>`,
            });
        }

        UtilCocos.LayoutFill(this.node, (item, index) => {
            const compt = item.getComponent(ItemTipsAttrItem);
            if (compt) {
                compt.setData(attrsList[index]);
            }
        }, attrsList.length);

        // 宝石属性
        if (this.NdItemTipsGemItem && this.NdGridLayout && this.LabProperty) {
            if (this.opts?.equipGemInfoArr && this.opts?.equipGemInfoArr.length > 0) {
                let str = '';
                UtilCocos.LayoutFill(this.NdGridLayout, (node, i) => {
                    const info = this.opts?.equipGemInfoArr[i];
                    if (info) {
                        const comp = node.getComponent(ItemGemTip);
                        comp.setData(info.icon, info.name, info.isSkill ? info.rawDesc : info.desc, this.NdGridLayout);
                        if (info.isSkill) {
                            if (str.length) str += '\n';
                            str += `${info.skillName} 【${info.skillLevel}${i18n.tt(Lang.equip_lev)}】：${info.desc}`;
                        }
                    }
                }, this.opts?.equipGemInfoArr.length);
                this.LabProperty.string = str;
                this.NdItemTipsGemItem.active = true;
            } else {
                this.NdItemTipsGemItem.active = false;
            }
        }

        // 显示属性
        this.node.active = attrsList.length > 0;
    }

    /**
     * 获取动画资源类型
     * @param subType 道具子类型
     * @returns ANIM_TYPE
     */
    private getResType(subType: number): ANIM_TYPE {
        switch (subType) {
            case ItemType.SKIN_HORSE: return ANIM_TYPE.HORSE;
            case ItemType.SKIN_WING: return ANIM_TYPE.WING;
            case ItemType.SKIN_WEAPON: return ANIM_TYPE.WEAPON;
            case ItemType.SKIN_FASHION: return ANIM_TYPE.ROLE;
            default: return '' as ANIM_TYPE;
        }
    }

    private getOtherTypeAttrId(): number {
        let tmpAttrId: number = 0;
        switch (this.itemModel.cfg.SubType) {
            case ItemType.SKIN_HORSE:
            case ItemType.SKIN_WING:
            case ItemType.SKIN_WEAPON:
                tmpAttrId = GradeMgr.I.getGradeSkinAnimIdByItemId(this.itemModel.cfg.Id, this.itemModel.cfg.SubType)?.AttrId;
                break;
            case ItemType.SKIN_FASHION:
                tmpAttrId = ModelMgr.I.RoleSkinModel.getSkinAnimIdByItemId(this.itemModel.cfg.Id)?.AttrId;
                break;
            default:
                break;
        }
        return tmpAttrId || 0;
    }
}
