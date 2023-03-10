import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { AttrBase } from '../../../base/attribute/AttrBase';
import { IAttrBase } from '../../../base/attribute/AttrConst';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import { Config } from '../../../base/config/Config';
import { ConfigAttributeIndexer } from '../../../base/config/indexer/ConfigAttributeIndexer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import { ActiveInfoSingle } from '../../../com/attr/ActiveAttrList';
import { AttrItemA } from '../../../com/attr/AttrItemA';
import { IAttrData } from '../../../com/attr/v/AttrTips';
import ItemModel from '../../../com/item/ItemModel';
import { ItemSkill } from '../../../com/itemskill/ItemSkill';
import { TipsSkillInfo } from '../../../com/tips/skillPart/SkillTopPart';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { EGeneralSkillType } from '../../general/GeneralConst';
import FamilyModel from '../FamilyModel';
import { FamilyTotemItem } from './FamilyTotemItem';

const { ccclass, property } = cc._decorator;
/** ??????-?????? */
@ccclass
export default class FamilyTotemPage extends WinTabPage {
    @property(cc.Label)// ??????????????????
    private LabName: cc.Label = null;

    @property(cc.Label)// ??????????????????
    private LabLevel: cc.Label = null;

    @property(cc.Node)// ??????????????????
    private BtnBuild: cc.Node = null;
    @property(cc.Label)//  ???????????? ?????????
    private LabBuild: cc.Label = null;

    @property(cc.Node)// ??????
    private BtnProperty: cc.Node = null;

    @property(cc.Node)// ????????????
    private BtnLeft: cc.Node = null;
    @property(cc.Node)// ????????????
    private BtnRight: cc.Node = null;

    @property(DynamicImage)// ????????????
    private SprIcon: DynamicImage = null;

    @property(ListView) /** ???????????? */
    private list: ListView = null;

    // ????????????
    @property(cc.Node)
    private NdCost: cc.Node = null;
    @property(DynamicImage)// ??????
    private SprCost: DynamicImage = null;
    @property(cc.Label)// ??????
    private LabCost: cc.Label = null;

    @property(cc.Label)// ????????????
    private LabDesc: cc.Label = null;

    @property(cc.ProgressBar)// ????????????
    private pro: cc.ProgressBar = null;
    @property(cc.Label)// ????????????
    private LabProgress: cc.Label = null;

    @property(cc.Node)// ????????????
    private NdAttrContainer: cc.Node = null;
    @property(cc.Prefab)// ????????????
    private prefabAttr: cc.Prefab = null;

    @property(cc.Label)// ??????
    private LabFightValue: cc.Label = null;
    // @property(cc.Node)// ????????????
    // private NdPowerDetail: cc.Node = null;

    @property(cc.Node)// ????????????
    private NdItemSkill: cc.Node = null;

    @property(cc.Node)// ????????????
    private NdBuildRed: cc.Node = null;

    public start(): void {
        super.start();
        // UtilGame.Click(this.NdPowerDetail, this._onNdPowerDetailClick, this);// ????????????
        UtilGame.Click(this.NdItemSkill, this._onNdItemSkillClick, this);// ????????????
        UtilGame.Click(this.BtnBuild, this._onBuildClick, this);// ????????????
        UtilGame.Click(this.BtnProperty, this._onBtnPropertyClick, this);// ????????????
        UtilGame.Click(this.BtnLeft, this._onNextClick, this, { customData: 0 });// ???
        UtilGame.Click(this.BtnRight, this._onNextClick, this, { customData: 1 });// ???
        EventClient.I.on(E.Bag.ItemChange, this._onItemChange, this);// ??????????????????
    }
    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Bag.ItemChange, this._onItemChange, this);
        EventClient.I.off(E.Family.FamilyTotemInfo, this._onFamilyTotemInfo, this);
    }
    private model: FamilyModel;
    private _curIdx: number = -1;// 0 1 2 3 4  ???????????????????????????
    public init(winId: number, param: unknown[], tabIdx: number, tabId?: number): void {
        super.init(winId, param, 0);
        this._curIdx = 0;
        this.model = ModelMgr.I.FamilyModel;
        EventClient.I.on(E.Family.FamilyTotemInfo, this._onFamilyTotemInfo, this);
        ControllerMgr.I.FamilyController.reqC2STotemInfo();
    }
    public refreshPage(winId: number, params: any[]): void {
        ControllerMgr.I.FamilyController.reqC2STotemInfo();
    }

    /** ?????????????????????????????? */
    private _onNdItemSkillClick(): void {
        const cfg: Cfg_Totem = this.model.getCfgTotemByIndex(this._curIdx);// ?????????????????????
        const totem: Totem = this.model.getTotemInfo(cfg.Id);
        let TotemLevel = 1;
        if (totem && totem.Level) {
            TotemLevel = totem.Level;
        }
        const cfgTotemLevel: Cfg_TotemLevel = this.model.getCfgTotomLevel(TotemLevel);// ???????????????

        const curSkillLv: number = cfgTotemLevel.SkillLevel;// ?????????????????????
        const skillid = cfg.SkillID;
        const skillCfg = UtilSkillInfo.GetCfg(Number(skillid), curSkillLv);
        const skillInfo: ActiveInfoSingle[] = [];
        // ????????????????????????
        const skillDesc = UtilSkillInfo.GetSkillDesc(skillCfg.SkillId, curSkillLv);
        skillInfo.push({ title: i18n.tt(Lang.skill_effect), data: skillDesc });

        const nextSkillLevel = cfgTotemLevel.NextSkillLevel;
        // const nextUpInfo = ModelMgr.I.RoleSkinModel.getUpgradeInfo(lv + 1);
        // ????????????????????????
        const lvUpLimit = i18n.tt(Lang.com_next_limit);
        const nexeEff = i18n.tt(Lang.skill_effect_next);
        if (nextSkillLevel) { // ??????
            const nextSkillInfo = UtilSkillInfo.GetCfg(Number(skillid), nextSkillLevel);
            const nextSkillDesc = UtilSkillInfo.GetSkillDesc(nextSkillInfo.SkillId, nextSkillLevel);
            skillInfo.push({ title: nexeEff, data: nextSkillDesc });
            // ????????????-????????????
            const mapS_T: Map<number, number> = this.model.getSkillTotemLevelMap();
            const tLevel = mapS_T.get(nextSkillLevel);
            skillInfo.push({ title: lvUpLimit, data: UtilString.FormatArgs(i18n.tt(Lang.family_skill_next_tip), tLevel) });
        } else {
            skillInfo.push({ title: nexeEff, data: `${i18n.tt(Lang.com_null)}` });
            skillInfo.push({ title: lvUpLimit, data: `${i18n.tt(Lang.com_level_max)}` });
        }

        const tipsInfo: TipsSkillInfo = {
            skillId: skillid,
            iconId: skillCfg.SkillIconID,
            type: 0,
            level: curSkillLv,
            skillType: EGeneralSkillType.SkillTalent,
            name: skillCfg.SkillName,
        };
        // ????????????Tips
        WinMgr.I.open(ViewConst.TipsSkillWin, tipsInfo, skillInfo);
    }

    /** ???????????? */
    private _onNdPowerDetailClick(): void {
        // ???????????????????????????
        // const attrData: IAttrData[] = [];

        // const attr: IAttrData = {
        //     title: i18n.tt(Lang.attr_detail), // ????????????
        //     sub: [],
        // };
        // ?????????????????????  AttrDetailTips
        // const map: Map<number, number> = this.model.getDrillAllAttrMap1();

        // map.forEach((v: number, k: number) => {
        //     attr.sub.push({ name, value: `+${v}` });
        // });
        // attrData.push(attr);

        // WinMgr.I.open(ViewConst.AttrTips, attrData, 1);// ???????????????

        // const map: Map<number, number> = this.model.getDrillAllAttrMap();
        // const info = [];
        // map.forEach((v: number, k: number) => {
        //     console.log(EAttrName);
        //     // const name = EAttrName[EAttrType[k]];
        //     // attr.sub.push({ name, value: `+${v}` });
        // });

        // info.push({ title: '????????????', data: UtilAttr.GetShowAttrStr([30101, 30101, 30102]);
        // WinMgr.I.open(ViewConst.AttrDetailTips, info);
    }

    private _onBuildClick(): void {
        const cfg: Cfg_Totem = this.model.getCfgTotemByIndex(this._curIdx);
        const totem: Totem = this.model.getTotemInfo(cfg.Id);
        if (totem) {
            const level = totem.Level;
            // ????????????
            if (cfg.MaxLv <= level) { // ????????????
                MsgToastMgr.Show(i18n.tt(Lang.com_level_max));
            } else {
                const itemId = cfg.CostItem;
                // const cfgTotemLevel: Cfg_TotemLevel = this.model.getCfgTotomLevel(level);// ???????????????

                const itemNum = 1;// Math.round(cfg.CostLevelRatio / 10000 * cfgTotemLevel.CostLevel);
                const bagNum = BagMgr.I.getItemNum(itemId);
                if (bagNum >= itemNum) {
                    ControllerMgr.I.FamilyController.reqC2STotemBuild(cfg.Id);
                } else {
                    WinMgr.I.open(ViewConst.ItemSourceWin, itemId);
                }
            }
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.family_unActive));// ???????????????
        }
    }

    // ???????????????????????????  ?????? ?????????????????????
    private _onBtnPropertyClick(): void {
        // ???????????????????????????  ?????? ?????????????????????
        // ???????????????????????????
        const len = ModelMgr.I.FamilyModel.getCfgTotemLen();// ????????????????????????
        const attrMap: Map<number, number> = new Map<number, number>();

        for (let i = 0; i < len; i++) { // ???????????????
            const cfg: Cfg_Totem = this.model.getCfgTotemByIndex(i);
            const totem: Totem = this.model.getTotemInfo(cfg.Id);
            if (totem && totem.Level) { // ??????????????????????????????
                const level = totem.Level;
                const cfgTotemLevel: Cfg_TotemLevel = this.model.getCfgTotomLevel(level);
                const attrRatio = cfgTotemLevel.AttrRatio / 10000;
                const attrId = cfg.AttrId;// ???????????????ID

                const attrInfo = AttrModel.MakeAttrInfo(attrId);
                const len1 = attrInfo.attrs.length;

                for (let j = 0; j < len1; j++) {
                    // ??????
                    const base: IAttrBase = attrInfo.attrs[j];

                    const type: number = base.attrType;// 'Attr_1'
                    let value = Math.round(base.value * attrRatio);// ???
                    const savedVal = attrMap.get(type);
                    if (savedVal) {
                        value += savedVal;
                    }
                    attrMap.set(type, value);// ??????????????????
                }
            }
        }

        const attrData: IAttrData[] = [];

        const attr: IAttrData = {
            title: i18n.tt(Lang.attr_detail), // ????????????
            sub: [],
        };
        attrMap.forEach((v: number, k: number) => {
            const name = UtilAttr.GetAttrName(k);
            attr.sub.push({ name, value: `+${v}` });
        });
        attrData.push(attr);

        WinMgr.I.open(ViewConst.AttrTips, attrData, 1);// ???????????????
    }

    private _onNextClick(e, idx): void {
        const len = ModelMgr.I.FamilyModel.getCfgTotemLen();
        if (idx) {
            if (this._curIdx >= len - 1) {
                this._curIdx = len - 1;
            } else {
                this._curIdx += 1;
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this._curIdx <= 0) {
                this._curIdx = 0;
            } else {
                this._curIdx -= 1;
            }
        }
        this._initLeftRightIcon();
        this._updateSelectIcon();
        this._selectItem();

        this.list.updateAll();
    }

    private _curSelectArr: boolean[];
    private _onFamilyTotemInfo(): void {
        this._initSelectIdx();// ???????????? ??????id?????????
        this._initSelectIcon();
        this._initLeftRightIcon();
        const len = ModelMgr.I.FamilyModel.getCfgTotemLen();
        this.list.setNumItems(len, 0);
        this._selectItem();
    }
    // ???????????? ??????id?????????
    private _initSelectIdx(): void {
        //

        const len = ModelMgr.I.FamilyModel.getCfgTotemLen();// ??????????????????

        let idx = 0;
        for (let i = 0; i < len; i++) {
            const cfg = this.model.getCfgTotemByIndex(i);
            const id = cfg.Id;
            const totem: Totem = this.model.getTotemInfo(id);
            if (totem) {
                idx = i;
            } else {
                break;
            }
        }
        this._curIdx = idx;
    }

    // ??????????????????
    private _initLeftRightIcon(): void {
        const len = ModelMgr.I.FamilyModel.getCfgTotemLen();
        if (this._curIdx <= 0) {
            this.BtnLeft.active = false;
            this.BtnRight.active = true;
        } else if (this._curIdx >= len - 1) {
            this.BtnLeft.active = true;
            this.BtnRight.active = false;
        } else {
            this.BtnLeft.active = true;
            this.BtnRight.active = true;
        }
    }

    /** ?????? ?????????????????? */
    private _updateSelectIcon(): void {
        const len = ModelMgr.I.FamilyModel.getCfgTotemLen();
        for (let i = 0; i < len; i++) {
            this._curSelectArr[i] = i === this._curIdx;
        }
    }
    /** ?????????????????? */
    private _initSelectIcon(): void {
        const len = ModelMgr.I.FamilyModel.getCfgTotemLen();
        this._curSelectArr = [];
        for (let i = 0; i < len; i++) {
            this._curSelectArr.push(i === 0);
        }
        this._updateSelectIcon();
    }

    private _selectItem() {
        this._initNameLv();// ??????
        this._initFgihtValue();// ??????
        this._initCenterInfo();// ??????
        this._initProgress();// ?????????
        this._initAttr();// ????????????
        this._initCostInfo();// ??????
        this._initSkillInfo();// ??????????????????
    }
    /** ?????????????????? */
    private _initSkillInfo() {
        const itemSkill: ItemSkill = this.NdItemSkill.getComponent(ItemSkill);

        const cfg: Cfg_Totem = this.model.getCfgTotemByIndex(this._curIdx);// ?????????????????????
        const totem: Totem = this.model.getTotemInfo(cfg.Id);

        let TotemLevel = 1;
        if (totem && totem.Level) {
            TotemLevel = totem.Level;
        }

        const cfgTotemLevel: Cfg_TotemLevel = this.model.getCfgTotomLevel(TotemLevel);// ???????????????

        const curSkillLv: number = cfgTotemLevel.SkillLevel;// ?????????????????????
        const skillId: number = cfg.SkillID;// ?????????????????????Id

        // ????????????-????????????
        const mapS_T: Map<number, number> = this.model.getSkillTotemLevelMap();

        const cfgSkillDesc: Cfg_SkillDesc = UtilSkillInfo.GetCfg(skillId);
        let openCondition = '';
        if (!curSkillLv) {
            openCondition = `${mapS_T.get(1)}${i18n.lv}${i18n.tt(Lang.boss_unlock)}`;// ?????????
        }
        itemSkill.setData(
            {
                curSkillLv, // ??????????????????
                openCondition,
                sprIconPath: `texture/skill/${cfgSkillDesc.SkillIconID}`,
            },
        );
    }
    /** ???????????? */
    private _initNameLv(): void {
        const cfg: Cfg_Totem = this.model.getCfgTotemByIndex(this._curIdx);
        this.LabName.string = cfg.Name;

        const totem: Totem = this.model.getTotemInfo(cfg.Id);
        if (totem) {
            this.LabLevel.node.active = true;
            this.LabLevel.string = `${totem.Level}${i18n.lv}`; // xx???
        } else {
            this.LabLevel.node.active = false;
        }
    }
    /** ?????? */
    private _initFgihtValue(): void {
        const cfg: Cfg_Totem = this.model.getCfgTotemByIndex(this._curIdx);
        const totem: Totem = this.model.getTotemInfo(cfg.Id);

        if (!totem || !totem.Level) {
            this.LabFightValue.string = UtilNum.Convert(0);
            return;
        }
        const level = totem.Level;

        const cfgTotemLevel: Cfg_TotemLevel = this.model.getCfgTotomLevel(level);
        const attrRatio = cfgTotemLevel.AttrRatio / 10000;

        const initAttrId = cfg.AttrId;// ???????????????ID
        const attrIndexer: ConfigAttributeIndexer = Config.Get(Config.Type.Cfg_Attribute);
        const fv = attrIndexer.getFightValueById(initAttrId);

        const fvNow = Math.round(fv * attrRatio);
        this.LabFightValue.string = UtilNum.ConvertFightValue(fvNow);
    }

    /** ???????????? ?????? */
    private _initCenterInfo(): void {
        const iconId: number = this._curIdx + 1;
        const path = `texture/family/icon_sj_totem_${iconId}@ML`;
        this.SprIcon.pngPath(path);
    }

    /** ????????? */
    private _initProgress(): void { // ????????????
        const cfg: Cfg_Totem = this.model.getCfgTotemByIndex(this._curIdx);
        const totem: Totem = this.model.getTotemInfo(cfg.Id);
        let level = 1;
        if (totem?.Level) {
            level = totem.Level;
        }
        const cfgTotemLevel: Cfg_TotemLevel = this.model.getCfgTotomLevel(level);// ???????????????
        const needPro = cfgTotemLevel.CostLevel;
        if (totem) {
            this.pro.progress = totem.Exp / needPro;
            this.LabProgress.string = `${UtilNum.Convert(totem.Exp)}/${UtilNum.Convert(needPro)}`;
        } else {
            this.pro.progress = 0;
            this.LabProgress.string = `0/${UtilNum.Convert(needPro)}`;
        }
    }

    /** ???????????? */
    private _initAttr(): void {
        const cfg: Cfg_Totem = this.model.getCfgTotemByIndex(this._curIdx);
        const totem: Totem = this.model.getTotemInfo(cfg.Id);
        let level = 1;
        if (totem?.Level) {
            level = totem.Level;
        }

        const cfgTotemLevel: Cfg_TotemLevel = this.model.getCfgTotomLevel(level);
        const attrRatio = cfgTotemLevel.AttrRatio / 10000;

        const attrId = cfg.AttrId;// ???????????????ID

        const attrInfo = AttrModel.MakeAttrInfo(attrId);
        const len = attrInfo.attrs.length;

        // ???????????????
        for (let index = len; index < this.NdAttrContainer.children.length; index++) {
            const element = this.NdAttrContainer.children[index];
            element.destroy();
        }

        for (let i = 0; i < len; i++) {
            let nd: cc.Node;
            if (i < this.NdAttrContainer.children.length) {
                nd = this.NdAttrContainer.children[i];
            } else { // ??????
                nd = cc.instantiate(this.prefabAttr);
                this.NdAttrContainer.addChild(nd);
            }

            // ??????
            const base: IAttrBase = attrInfo.attrs[i];
            if (totem) {
                base.value = Math.round(base.value * attrRatio);
            }

            // ????????????
            const maxLv: number = cfg.MaxLv;
            // ?????? ???????????????
            let add: IAttrBase = new AttrBase(base);// attrInfo.attrs[i];
            if (level !== maxLv) { // ?????????
                const nextLevel = level + 1;
                // ???????????????????????? * ?????? - ??????????????? *
                const cfgTotemLevelNext: Cfg_TotemLevel = this.model.getCfgTotomLevel(nextLevel);
                // ???????????????
                const attrRatioNext = cfgTotemLevelNext.AttrRatio / 10000;
                add.value = Math.round(base.value * attrRatioNext) - base.value;
            } else {
                add = null;
            }

            if (totem) {
                base.value = Math.round(base.value * attrRatio);
            } else {
                base.value = 0;
            }

            // const param = {
            //     isShowAdd: !!add,
            //     isShowAddSign: true,
            //     signVal: '+',
            //     baseAddwidth: 206, // ???????????????

            //     NdAttrWidth: 120, // ???????????????
            //     NdAttrSpaceX: 2,
            //     NdAttrColor: UtilColor.AttrColor,

            //     NdAddWidth: 56, // ???????????????
            //     NdAddSpaceX: 2,
            // };
            // nd.getComponent(NdAttrBaseAddition).setAttr(base, add, param);
            nd.getComponent(AttrItemA).init(base);
        }
    }

    private _onItemChange(changes: { itemModel: ItemModel, status: number }[]): void {
        if (changes.length) {
            const cfg: Cfg_Totem = this.model.getCfgTotemByIndex(this._curIdx);
            // ????????????Id??????????????????
            const totem: Totem = this.model.getTotemInfo(cfg.Id);
            let level = 1;
            if (totem?.Level) {
                level = totem.Level;
            }
            if (level < cfg.MaxLv && totem) {
                const itemId = cfg.CostItem;
                for (let i = 0, len = changes.length; i < len; i++) {
                    const item = changes[i].itemModel;
                    if (item.cfg.Id === itemId) { // ????????????id
                        this._initCostInfo();
                        break;
                    }
                }
            }
        }
    }

    /** ???????????? ?????? */
    private _initCostInfo(): void {
        // ???????????? ->???????????????
        const cfg: Cfg_Totem = this.model.getCfgTotemByIndex(this._curIdx);
        // ????????????Id??????????????????
        const totem: Totem = this.model.getTotemInfo(cfg.Id);
        let level = 1;
        if (totem?.Level) {
            level = totem.Level;
        }

        if (cfg.MaxLv <= level) { // ????????????
            this.LabDesc.node.active = false;
            this.NdCost.active = false;

            this.BtnBuild.active = true;
            this.LabBuild.string = i18n.tt(Lang.com_level_max);// '?????????';
            UtilCocos.SetSpriteGray(this.BtnBuild, true, true);
            this.NdBuildRed.active = false;
        } else {
            this.LabBuild.string = i18n.tt(Lang.family_autoBuild);// '????????????';

            // eslint-disable-next-line no-lonely-if
            if (totem) {
                /** ???????????? ->??????????????? */
                this.LabDesc.node.active = false;
                this.NdCost.active = true;
                this.BtnBuild.active = true;

                UtilCocos.SetSpriteGray(this.BtnBuild, false, true);

                const cfgTotemLevel: Cfg_TotemLevel = this.model.getCfgTotomLevel(level);

                const itemId = cfg.CostItem;
                const itemNum = 1;// Math.round(cfg.CostLevelRatio / 10000 * cfgTotemLevel.CostLevel);
                // ??????????????????
                const p = UtilItem.GetItemIconPathByItemId(itemId);
                this.SprCost.pngPath(p);
                // ????????????
                const bagNum = BagMgr.I.getItemNum(itemId);
                this.LabCost.string = `${UtilNum.Convert(bagNum)}/${UtilNum.Convert(itemNum)}`;
                this.LabCost.node.color = UtilColor.costColor(bagNum, itemNum);

                if (bagNum >= itemNum) {
                    this.NdBuildRed.active = true;
                } else {
                    this.NdBuildRed.active = false;
                }
            } else {
                this.NdCost.active = false;// ??????????????????
                this.LabDesc.node.active = true;// ??????????????????

                const limitStr: string = cfg.LevelLimit;
                const arrString = UtilString.SplitToArray(limitStr);

                const totemId: string = arrString[0][0];
                const needLevel: string = arrString[0][1];
                const cfgTotemNeed = this.model.getCfgTotemById(Number(totemId));

                // eslint-disable-next-line max-len
                this.LabDesc.string = `${cfgTotemNeed.Name}${i18n.tt(Lang.family_totemReach)}${needLevel}${i18n.tt(Lang.family_afterUnLock)}`;// `${cfg.Name}????????????${cfg.LevelLimit}????????????`;

                this.BtnBuild.active = true;
                this.NdBuildRed.active = false;
                UtilCocos.SetSpriteGray(this.BtnBuild, true, true);
            }
        }
    }

    // ??????
    private scrollEvent(node: cc.Node, index: number) {
        const item: FamilyTotemItem = node.getComponent(FamilyTotemItem);
        item.setData(index, this._curSelectArr[index]);
        node.targetOff(this);
        UtilGame.Click(node, () => {
            if (index === this._curIdx) return;

            this._curIdx = index;
            this._selectItem();
            this._initLeftRightIcon();
            this._updateSelectIcon();
            this.list.updateAll();
        }, this);
    }
}
