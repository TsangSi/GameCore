/* eslint-disable max-len */
/*
 * @Author: zs
 * @Date: 2022-06-07 16:21:37
 * @FilePath: \SanGuo2\assets\script\game\module\roleskin\v\com\RoleSuitPartWin.ts
 * @Description:
 *
 */

import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { AssetType } from '../../../../../app/core/res/ResConst';
import { ANIM_TYPE } from '../../../../base/anim/AnimCfg';
import { StarLabelComponent } from '../../../../base/components/StarLabelComponent';
import { Config } from '../../../../base/config/Config';
import UtilItem from '../../../../base/utils/UtilItem';
import { NdAttrBase } from '../../../../com/attr/NdAttrBase';
import { WinCmp } from '../../../../com/win/WinCmp';
import EntityUiMgr from '../../../../entity/EntityUiMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import EntityCfg from '../../../../entity/EntityCfg';
import { ERoleSkinPageIndex, SUIT_PART_COUNT } from '../RoleSkinConst';
import { ConfigConst } from '../../../../base/config/ConfigConst';
import UtilItemList from '../../../../base/utils/UtilItemList';
import { ItemWhere } from '../../../../com/item/ItemConst';
import { UtilGame } from '../../../../base/utils/UtilGame';
import ControllerMgr from '../../../../manager/ControllerMgr';
import { EventClient } from '../../../../../app/base/event/EventClient';
import { E } from '../../../../const/EventName';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { BagItemChangeInfo } from '../../../bag/BagConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class RoleSuitPartWin extends WinCmp {
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Sprite)
    private SpriteQuality: cc.Sprite = null;
    @property(cc.Label)
    private LabelPower: cc.Label = null;
    @property(StarLabelComponent)
    private LabelStar: StarLabelComponent = null;
    @property(cc.Node)
    private NodeAttrs: cc.Node = null;
    @property(cc.Node)
    private NodeAnim: cc.Node = null;
    @property(cc.Node)
    private NodeActive: cc.Node = null;
    @property(cc.Node)
    private NodeUnActive: cc.Node = null;
    @property(cc.Node)
    private NodeStar: cc.Node = null;
    @property(cc.Node)
    private NdMax: cc.Node = null;
    @property(cc.Node)
    private ndSpecial: cc.Node = null;

    /** 按钮父节点 */
    @property(cc.Node)
    private BtnActive: cc.Node = null;
    @property(cc.Node)
    private BtnUpgrade: cc.Node = null;

    /** 按钮 */
    @property(cc.Node)
    private BtnActiveNd: cc.Node = null;
    @property(cc.Node)
    private BtnUpgradeNd: cc.Node = null;

    /** 激活消耗 */
    @property(cc.Node)
    private ndActiveNeed: cc.Node = null;
    /** 升阶消耗 */
    @property(cc.Node)
    private ndUpGradeNeed: cc.Node = null;

    // 记录部件类型 默认是皮肤  （只有华服和皮肤的处理）
    private _type: ERoleSkinPageIndex = ERoleSkinPageIndex.Skin;
    private _skinId = 0;
    private _index = 0;
    private _suitId = 0;

    protected start(): void {
        super.start();

        EventClient.I.on(E.RoleSkin.NewAddSkin, this.updateUi, this);
        EventClient.I.on(E.RoleSkin.SkinUpStar, this.updateUi, this);
        UtilGame.Click(this.BtnActiveNd, () => {
            ControllerMgr.I.RoleSkinController.C2SRoleSkinActive(this._skinId);
        }, this);

        UtilGame.Click(this.BtnUpgradeNd, () => {
            ControllerMgr.I.RoleSkinController.C2SRoleSkinRiseStar(this._skinId);
        }, this);

        EventClient.I.on(E.Bag.ItemChange, this.itemChange, this);
    }

    private itemChange(items: BagItemChangeInfo[]) {
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            const skinIndexer = Config.Get(ConfigConst.Cfg_RoleSkin);
            const skinCfg: Cfg_RoleSkin = skinIndexer.getValueByKey(this._skinId);
            if (skinCfg) {
                const needItemId = skinCfg.NeedItem;
                if (element.itemModel.cfg.Id === needItemId) {
                    this.updateUi(0);
                }
            }
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.RoleSkin.NewAddSkin, this.updateUi, this);
        EventClient.I.off(E.RoleSkin.SkinUpStar, this.updateUi, this);

        EventClient.I.off(E.Bag.ItemChange, this.itemChange, this);
    }

    private updateUi(id: number) {
        this.init([this._skinId, this._index, this._suitId, this._type]);
    }

    public init(params: any[]): void {
        const skinId: number = params[0];
        const index: number = params[1];
        const suitId: number = params[2];
        this._type = params[3] || 1;
        this._skinId = skinId;
        this._suitId = suitId;
        this._index = index;
        const star = ModelMgr.I.RoleSkinModel.getSkinStar(skinId, index, this._type);
        this.LabelStar.updateStars(star);
        if (star > 0) {
            this.NodeStar.active = true;
            UtilCocos.SetString(this.NodeStar, 'Label', star);
        }
        this.NodeAnim.destroyAllChildren();
        this.NodeAnim.removeAllChildren();
        let data: { Name: string, AnimId: number | string, AttrId: number, FieldId?: number, NeedItem?: number, FuncId?: number } = cc.js.createMap(true);
        if (!index || this._type === ERoleSkinPageIndex.SpecialSuit || this._type === ERoleSkinPageIndex.ActitySuit) {
            data = Config.Get(Config.Type.Cfg_RoleSkin).getValueByKey(skinId, {
                Name: '', AnimId: '', AttrId: 0, FieldId: 0,
            });
            const resId = ModelMgr.I.RoleSkinModel.getResIdByAnimId(data.AnimId);
            // data.AnimId = ModelMgr.I.RoleSkinModel.getResIdByAnimId(data.AnimId);
            EntityUiMgr.I.createEntity(this.NodeAnim, {
                resId, resType: EntityCfg.I.getResByIndex(index), isPlayUs: false, singleAnim: true,
            });
        } else {
            data = Config.Get(Config.Type.Cfg_GradeSkin).getValueByKey(skinId, {
                Name: '', AnimId: 0, AttrId: 0, NeedItem: 0, FuncId: 0,
            });
            const quality: number = Config.Get(Config.Type.Cfg_Item).getValueByKey(data.NeedItem, 'Quality');
            data.FieldId = quality;

            EntityUiMgr.I.createEntity(this.NodeAnim, {
                resId: data.AnimId, resType: EntityCfg.I.getResTypeByFuncId(data.FuncId), isPlayUs: false, singleAnim: true,
            });
        }
        UtilCocos.LoadSpriteFrameRemote(this.SpriteQuality, UtilItem.GetItemQualityFontImgPath(data.FieldId, true), AssetType.SpriteFrame);
        this.LabelName.string = data.Name;

        const attrInfo = ModelMgr.I.RoleSkinModel.getSkinAttrInfo(skinId, index, this._type);
        this.LabelPower.string = `${attrInfo.fightValue}`;
        for (let i = 0, n = Math.max(attrInfo.attrs.length, this.NodeAttrs.children.length); i < n; i++) {
            let node = this.NodeAttrs.children[i];
            if (attrInfo.attrs[i]) {
                node = node || cc.instantiate(this.NodeAttrs.children[0]);
                node.active = true;
                if (!this.NodeAttrs.children[i]) {
                    this.NodeAttrs.addChild(node);
                }
                node.getComponent(NdAttrBase).setAttr(attrInfo.attrs[i], { s: '+' });
            } else if (node && i !== 0) {
                node.destroy();
                this.NodeAttrs.removeChild(node);
            } else if (node) {
                node.active = false;
            }
        }

        const active = ModelMgr.I.RoleSkinModel.getSkinActive(skinId, index, this._type) || ModelMgr.I.RoleSkinModel.getSuitActiveByNum(suitId, SUIT_PART_COUNT);
        if (this._type === ERoleSkinPageIndex.SpecialSuit) {
            this.NodeActive.active = false;
            this.NodeUnActive.active = false;
            this.ndSpecial.active = true;
            this.BtnActive.active = !active;
            this.BtnUpgrade.active = active;
            const indexer = Config.Get(ConfigConst.Cfg_RoleSkinStar);
            const cfgRoleSkinStar = Config.Get(Config.Type.Cfg_RoleSkinStar);
            const index = cfgRoleSkinStar.getIntervalIndex(star);
            const cfgStar: Cfg_RoleSkinStar = indexer.getValueByIndex(index);
            const needNum = cfgStar.LevelUpItem;
            // 下一星的数据
            const nextIndex = cfgRoleSkinStar.getIntervalIndex(star + 1);
            const nextCfg: Cfg_RoleSkinStar = indexer.getValueByIndex(nextIndex);
            if (!nextCfg) {
                // 满级
                this.NdMax.active = true;
                this.BtnActive.active = false;
                this.BtnUpgrade.active = false;
                return;
            } else {
                this.NdMax.active = false;
                // 未满级
            }

            const skinIndexer = Config.Get(ConfigConst.Cfg_RoleSkin);
            const skinCfg: Cfg_RoleSkin = skinIndexer.getValueByKey(skinId);
            const needItemId = skinCfg.NeedItem;
            if (active) { // 已经激活 升星
                UtilItemList.ShowItems(this.ndUpGradeNeed, `${needItemId}:${needNum}`, {
                    option: {
                        needNum: true, where: ItemWhere.OTHER, needLimit: true,
                    },
                });
                const state = ModelMgr.I.RoleSpecialSuitModel.specialPartRedDot(skinId, star);
                UtilRedDot.UpdateRed(this.BtnUpgradeNd, state, cc.v2(70, 25));
            } else { // 未激活 激活
                UtilItemList.ShowItems(this.ndActiveNeed, `${needItemId}:${needNum}`, {
                    option: {
                        needNum: true, where: ItemWhere.OTHER, needLimit: true,
                    },
                });
                const state = ModelMgr.I.RoleSpecialSuitModel.specialPartRedDot(skinId, star);
                UtilRedDot.UpdateRed(this.BtnActiveNd, state, cc.v2(70, 25));
            }
        } else {
            this.NodeActive.active = active;
            this.NodeUnActive.active = !active;
            this.ndSpecial.active = false;
        }
    }
}
