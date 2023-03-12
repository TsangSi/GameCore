/*
 * @Author: hwx
 * @Date: 2022-06-17 14:18:06
 * @FilePath: \SanGuo\assets\script\game\com\tips\part\ItemTipsAvatarPart.ts
 * @Description: 道具Tips化身部件
 */
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilItem from '../../../base/utils/UtilItem';
import UtilTitle from '../../../base/utils/UtilTitle';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { GradeMgr } from '../../../module/grade/GradeMgr';
import { ItemType } from '../../item/ItemConst';
import { BaseItemTipsPart } from './BaseItemTipsPart';
import EntityCfg from '../../../entity/EntityCfg';
import { BagMgr } from '../../../module/bag/BagMgr';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsAvatarPart extends BaseItemTipsPart {
    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(DynamicImage)
    private SprQuality: DynamicImage = null;

    @property(cc.Node)
    private NdAvatar: cc.Node = null;

    @property(cc.Label)
    private LabFightValue: cc.Label = null;

    protected refresh(): void {
        // 道具名称
        UtilItem.ItemNameScrollSet(this.itemModel, this.LabName, this.itemModel.cfg.Name, true);

        // 道具品阶图标
        this.SprQuality.loadImage(`${RES_ENUM.Com_Font_Com_Font_Quality_Big}${this.itemModel.cfg.Quality}@ML`, 1, true);

        const itemId = this.itemModel.cfg.Id;
        const subType = this.itemModel.cfg.SubType;

        if (subType === ItemType.SKIN_TITLE) {
            UtilTitle.setTitle(this.NdAvatar, this.itemModel.cfg.DetailId, false, 1.3);
        } else {
            let resId: number;
            const resType = this.getResType(subType);
            if (subType === ItemType.SKIN_HORSE
                || subType === ItemType.SKIN_WING
                || subType === ItemType.SKIN_WEAPON) {
                const cfg = GradeMgr.I.getGradeSkinAnimIdByItemId(itemId, subType);
                if (cfg) {
                    resId = cfg.AnimId;
                }
            } else if (subType === ItemType.SKIN_FASHION
                || subType === ItemType.SKIN_SKIN_SPECIAL
                || subType === ItemType.SKIN_WEAPON_SPECIAL
                || subType === ItemType.SKIN_WING_SPECIAL
                || subType === ItemType.SKIN_HORSE_SPECIAL) {
                const cfg = ModelMgr.I.RoleSkinModel.getSkinAnimIdByItemId(itemId);
                if (cfg) {
                    resId = ModelMgr.I.RoleSkinModel.getResIdByAnimId(cfg.AnimId);
                }
            } else if (subType === ItemType.GENERAL_TYPE) {
                resId = EntityCfg.I.getGeneralResId(this.itemModel.cfg.DetailId);
            } else if (subType === ItemType.SKIN_GENERAL) {
                resId = EntityCfg.I.getGeneralSkinResId(this.itemModel.cfg.DetailId);
                this.LabFightValue.node.parent.parent.active = false;
            }

            if (resId && resType) {
                EntityUiMgr.I.createEntity(this.NdAvatar, {
                    resId,
                    resType,
                    isPlayUs: false,
                    isMainRole: true,
                });
            }
        }
        this.LabFightValue.string = `${this.itemModel.fightValue || BagMgr.I.getItemFightValue(this.itemModel, true)}`;
    }

    /**
     * 获取动画资源类型
     * @param subType 道具子类型
     * @returns ANIM_TYPE
     */
    private getResType(subType: number): ANIM_TYPE {
        switch (subType) {
            case ItemType.SKIN_HORSE:
            case ItemType.SKIN_HORSE_SPECIAL:
                return ANIM_TYPE.HORSE;
            case ItemType.SKIN_WING:
            case ItemType.SKIN_WING_SPECIAL:
                return ANIM_TYPE.WING;
            case ItemType.SKIN_WEAPON:
            case ItemType.SKIN_WEAPON_SPECIAL:
                return ANIM_TYPE.WEAPON;
            case ItemType.SKIN_FASHION:
            case ItemType.SKIN_SKIN_SPECIAL:
                return ANIM_TYPE.ROLE;
            case ItemType.GENERAL_TYPE:
            case ItemType.SKIN_GENERAL:
                return ANIM_TYPE.PET;
            default: return '' as ANIM_TYPE;
        }
    }
}
