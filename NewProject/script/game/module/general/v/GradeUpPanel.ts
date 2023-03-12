/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-09-22 18:35:20
 * @FilePath: \SanGuo\assets\script\game\module\general\v\GradeUpPanel.ts
 * @Description: 武将-升阶
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { EAttrType, IAttrBase } from '../../../base/attribute/AttrConst';
import { Config } from '../../../base/config/Config';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import {
    EGeneralSkillType, ESkillItemShow, GeneralMsg, ISkillEx,
} from '../GeneralConst';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import ControllerMgr from '../../../manager/ControllerMgr';
import { ItemQuality, ItemType } from '../../../com/item/ItemConst';
import { BagItemChangeInfo } from '../../bag/BagConst';
import { TipsSkillInfo } from '../../../com/tips/skillPart/SkillTopPart';
import GeneralItem from '../com/GeneralItem';
import GeneralGradeUpItem from '../com/GeneralGradeUpItem';
import UtilItem from '../../../base/utils/UtilItem';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import { UtilColorFull } from '../../../base/utils/UtilColorFull';
import { GeneralModel } from '../GeneralModel';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { GSkillItem } from '../com/GSkillItem';
import { EffectMgr } from '../../../manager/EffectMgr';
import { RES_ENUM } from '../../../const/ResPath';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ActiveInfoSingle } from '../../../com/attr/ActiveAttrList';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GradeUpPanel extends WinTabPage {
    @property(cc.Node)
    private BtnLeft: cc.Node = null;
    @property(cc.Node)
    private BtnRight: cc.Node = null;

    @property(cc.Node)
    private NdCurSkill: cc.Node = null;
    @property(cc.Node)
    private NdNextSkill: cc.Node = null;
    @property(cc.Node)
    private NdSkillArrow: cc.Node = null;

    @property(cc.Label)
    private LabCurName: cc.Label = null;
    @property(cc.Label)
    private LabNextName: cc.Label = null;
    @property(cc.Node)
    private NdNameArrow: cc.Node = null;

    @property(cc.Node)
    private BtnUp: cc.Node = null;
    @property(cc.Node)
    private BtnMax: cc.Node = null;
    @property(cc.Node)
    private NdCost1: cc.Node = null;
    @property(cc.Node)
    private NdCost2: cc.Node = null;

    @property({ type: cc.Prefab })
    private GradeUpItemPrefab: cc.Prefab = null;
    @property({ type: cc.Prefab })
    private GeneralItemPrefab: cc.Prefab = null;

    @property(cc.Label)
    private LabCurAtk: cc.Label = null;
    @property(cc.Label)
    private LabAddAtk: cc.Label = null;

    @property(cc.Label)
    private LabCurDef: cc.Label = null;
    @property(cc.Label)
    private LabAddDef: cc.Label = null;

    @property(cc.Label)
    private LabCurHp: cc.Label = null;
    @property(cc.Label)
    private LabAddHp: cc.Label = null;

    @property(cc.Label)
    private LabCurBase: cc.Label = null;
    @property(cc.Label)
    private LabAddBase: cc.Label = null;

    @property(cc.Node)
    private NdAnim: cc.Node = null;

    private _M: GeneralModel = null;
    private _curData: GeneralMsg = null;
    private _generalIds: string[] = [];
    private _index: number = 0;
    private _chooseCost: GeneralMsg[] = [];
    private _costNum: number = 0;

    protected onLoad(): void {
        super.onLoad();
        if (!this._M) {
            this._M = ModelMgr.I.GeneralModel;
        }
    }

    protected start(): void {
        super.start();
        this.clk();
        this.addE();
    }

    public setData(): void {
        if (!this._M) {
            this._M = ModelMgr.I.GeneralModel;
        }
        this._generalIds = this._M.getGeneralIds();
        this.uptContent(true);
    }

    private addE() {
        EventClient.I.on(E.General.UptGradeUp, this.uptGradeUp, this);
        EventClient.I.on(E.General.UptAttr, this.uptAttr, this);
        EventClient.I.on(E.Bag.ItemChange, this.onBagChange, this);
        EventClient.I.on(E.General.GradeHead, this.uptClickHead, this);
        EventClient.I.on(E.General.UptGradeChoose, this.uptChoose, this);
    }

    private remE() {
        EventClient.I.off(E.General.UptGradeUp, this.uptGradeUp, this);
        EventClient.I.off(E.General.UptAttr, this.uptAttr, this);
        EventClient.I.off(E.Bag.ItemChange, this.onBagChange, this);
        EventClient.I.off(E.General.GradeHead, this.uptClickHead, this);
        EventClient.I.off(E.General.UptGradeChoose, this.uptChoose, this);
    }

    private clk() {
        UtilGame.Click(this.BtnLeft, () => {
            this.changeGeneral(false);
        }, this);

        UtilGame.Click(this.BtnRight, () => {
            this.changeGeneral(true);
        }, this);

        UtilGame.Click(this.BtnUp, () => {
            // 消耗的道具是否足够
            // 是否需要消耗武将
            const canUp: boolean = this._M.canGradeUp(this._curData.generalData.OnlyId, true, true);
            if (!canUp) {
                MsgToastMgr.Show(i18n.tt(Lang.general_grade_up));
                return;
            }
            const cost: string[] = [];
            for (let i = 0; i < this._chooseCost.length; i++) {
                cost.push(this._chooseCost[i].generalData.OnlyId);
            }
            ControllerMgr.I.GeneralController.reqGeneralGradeUp(this._curData.generalData.OnlyId, cost);
        }, this);
    }

    private onBagChange(changes: BagItemChangeInfo[]) {
        let check: boolean = false;
        if (changes) {
            for (let i = 0; i < changes.length; i++) {
                if (changes[i].itemModel && changes[i].itemModel.cfg
                    && changes[i].itemModel.cfg.Type === ItemType.MATERIAL && changes[i].itemModel.cfg.SubType === ItemType.GENERAL_ITEM) {
                    check = true;
                    break;
                }
            }
        }
        if (check) {
            // this.uptContent(false);
            // 只刷新消耗就行了
            this.uptCost();
        }
    }

    /** 选中哪个武将 */
    private uptClickHead() {
        const gList: GeneralMsg[] = this._M.getGeneralListbyIId(this._curData.generalData.IId, this._curData.generalData.OnlyId);
        if (this._costNum > 0 && gList.length > 0) {
            const choose: string[] = [];
            for (let i = 0; i < this._chooseCost.length; i++) {
                choose.push(this._chooseCost[i].generalData.OnlyId);
            }
            const indexer = Config.Get(Config.Type.Cfg_GeneralGradeUp);
            const curCfg: Cfg_GeneralGradeUp = indexer.getValueByKey(this._curData.cfg.Rarity, this._curData.generalData.Grade) as Cfg_GeneralGradeUp;
            WinMgr.I.open(ViewConst.GradeUpChooseWin, this._curData, choose, curCfg.CostNum, 0);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.general_grade_less));
        }
    }

    private uptChoose(chooseList: string[]) {
        this._chooseCost = [];
        for (let i = 0; i < chooseList.length; i++) {
            const d = this._M.generalData(chooseList[i]);
            this._chooseCost.push(d);
        }
        // 消耗
        this.uptCost();
    }

    private changeGeneral(isRight: boolean) {
        if (!this._generalIds || this._generalIds.length === 0) {
            this.BtnLeft.active = false;
            this.BtnRight.active = false;
            return;
        }
        if (isRight) {
            if (this._index < this._generalIds.length - 1) {
                this._index++;
            }
        } else if (this._index > 0) {
            this._index--;
        }
        this._M.curOnlyId = this._generalIds[this._index];
        this.uptContent(true);
    }

    private uptArrow() {
        this.BtnLeft.active = this._index > 0;
        this.BtnRight.active = this._index < this._generalIds.length - 1;
    }

    private uptContent(init: boolean = false) {
        // 获取当前武将
        if (!this._M.curOnlyId) {
            this._M.curOnlyId = this._generalIds[0];
        }
        this._curData = this._M.curData;
        if (!this._curData) {
            const all = this._M.getGeneralListByRarity(0);
            all.sort(this._M.sort);
            this._curData = all[0];
        }

        if (!this._curData) return;
        if (!this._curData.cfg) {
            this._curData.cfg = Config.Get(Config.Type.Cfg_General).getValueByKey(this._curData.generalData.IId);
        }

        this._index = this._generalIds.indexOf(this._curData.generalData.OnlyId);
        // 清了选中消耗的武将
        this._chooseCost = [];

        if (this.node.active) {
            EventClient.I.emit(E.General.UptEntity, this._curData);
        }
        //
        this.uptArrow();

        // 升阶是否已满
        const isGradeMax = this._M.isGradeUpMax(this._curData.cfg.Rarity, this._curData.generalData.Grade);
        this.LabNextName.node.active = !isGradeMax;
        this.NdNameArrow.active = !isGradeMax;

        if (this._curData.generalData.Grade === 0) {
            this.LabCurName.string = `${this._curData.cfg.Name}`;
        } else {
            this.LabCurName.string = `${this._curData.cfg.Name}+${this._curData.generalData.Grade}`;
        }

        UtilColorFull.resetMat(this.LabCurName);
        if (this._curData.generalData.Quality === ItemQuality.COLORFUL) {
            UtilColorFull.setColorFull(this.LabCurName, false);
        } else {
            this.LabCurName.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(this._curData.generalData.Quality));
        }

        if (!isGradeMax) {
            UtilColorFull.resetMat(this.LabNextName);
            this.LabNextName.string = `${this._curData.cfg.Name}+${this._curData.generalData.Grade + 1}`;
            if (this._curData.generalData.Quality === ItemQuality.COLORFUL) {
                UtilColorFull.setColorFull(this.LabNextName, false);
            } else {
                this.LabNextName.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(this._curData.generalData.Quality));
            }
        }

        const curCfg: Cfg_GeneralGradeUp = Config.Get(Config.Type.Cfg_GeneralGradeUp).getValueByKey(this._curData.cfg.Rarity, this._curData.generalData.Grade) as Cfg_GeneralGradeUp;
        this.uptSkill(1);
        this.NdNextSkill.active = false;
        this.NdSkillArrow.active = false;
        if (!isGradeMax) {
            const nextCfg: Cfg_GeneralGradeUp = Config.Get(Config.Type.Cfg_GeneralGradeUp).getValueByKey(this._curData.cfg.Rarity, this._curData.generalData.Grade + 1) as Cfg_GeneralGradeUp;
            if (nextCfg.TallentSkillLv > curCfg.TallentSkillLv) {
                this.NdNextSkill.active = true;
                this.NdSkillArrow.active = true;
                this.uptSkill(2);
            }
        }

        this.BtnUp.active = !isGradeMax;
        const canUp: boolean = this._M.checkCurGradeUpRed(this._curData);
        UtilRedDot.UpdateRed(this.BtnUp, canUp, cc.v2(64, 18));
        this.BtnMax.active = isGradeMax;
        this.NdCost1.active = !isGradeMax;
        this.NdCost2.active = !isGradeMax;

        // 属性
        this.uptAttr();

        // 消耗
        this.uptCost();
    }

    private uptGradeUp() {
        this.uptContent();
        this.NdAnim.destroyAllChildren();
        EffectMgr.I.showEffect(RES_ENUM.Com_Ui_6046, this.NdAnim, cc.WrapMode.Normal);
    }

    /** 消耗武将的展示 */
    private uptCost() {
        const indexer = Config.Get(Config.Type.Cfg_GeneralGradeUp);
        const curCfg: Cfg_GeneralGradeUp = indexer.getValueByKey(this._curData.cfg.Rarity, this._curData.generalData.Grade) as Cfg_GeneralGradeUp;
        if (!curCfg) return;
        this._costNum = curCfg.CostNum;

        // 删了多余的
        for (let index = this._costNum; index < this.NdCost1.children.length; index++) {
            const element = this.NdCost1.children[index];
            element.destroy();
        }

        if (this._costNum > 0) {
            for (let i = 0; i < 1; i++) { // this._costNum
                let _d = this._chooseCost[i];
                if (!_d) {
                    const gData = new GeneralData();
                    gData.IId = this._curData.generalData.IId;
                    gData.Title = this._curData.generalData.Title;
                    gData.Quality = this._curData.generalData.Quality;
                    _d = {
                        generalData: gData,
                    };
                }
                // 已存在就刷新
                if (this.NdCost1.children[i]) {
                    this.NdCost1.children[i].getComponent(GeneralGradeUpItem).setData(0, this._curData.generalData.OnlyId, _d, this._chooseCost.length, this._costNum, i);
                } else {
                    const nd = cc.instantiate(this.GradeUpItemPrefab);
                    this.NdCost1.addChild(nd);
                    nd.getComponent(GeneralGradeUpItem).setData(0, this._curData.generalData.OnlyId, _d, this._chooseCost.length, this._costNum, i);
                }
            }
        }
        this.NdCost1.active = this._costNum > 0;

        this.uptItemCost(curCfg);
    }

    /** 消耗道具的展示 */
    private uptItemCost(cfg: Cfg_GeneralGradeUp) {
        const cost: { id: number, need: number }[] = [];
        if (cfg.ItemCost) {
            const itemCost = cfg.ItemCost.split('|');
            for (let j = 0; j < itemCost.length; j++) {
                const item = itemCost[j].split(':');
                cost.push({ id: +item[0], need: +item[1] });
            }
        }

        // 删除多余的
        for (let index = cost.length; index < this.NdCost2.children.length; index++) {
            const element = this.NdCost2.children[index];
            element.destroy();
        }

        if (cost && cost.length > 0) {
            this.NdCost2.active = true;
            for (let i = 0; i < cost.length; i++) {
                // 已存在就刷新
                if (this.NdCost2.children[i]) {
                    this.NdCost2.children[i].getComponent(GeneralItem).setAwakenData(cost[i].id, cost[i].need, false, true);
                } else {
                    const nd = cc.instantiate(this.GeneralItemPrefab);
                    this.NdCost2.addChild(nd);
                    nd.getComponent(GeneralItem).setAwakenData(cost[i].id, cost[i].need, false, true);
                }
            }
        } else {
            this.NdCost2.active = false;
        }
    }

    /** 更新属性数据 */
    private uptAttr() {
        const indexer = Config.Get(Config.Type.Cfg_GeneralGradeUp);
        const curCfg: Cfg_GeneralGradeUp = indexer.getValueByKey(this._curData.cfg.Rarity, this._curData.generalData.Grade) as Cfg_GeneralGradeUp;
        const nextCfg: Cfg_GeneralGradeUp = indexer.getValueByKey(this._curData.cfg.Rarity, this._curData.generalData.Grade + 1) as Cfg_GeneralGradeUp;

        this.LabCurAtk.string = '0';
        this.LabCurDef.string = '0';
        this.LabCurHp.string = '0';
        this.LabCurBase.string = '0%';

        if (curCfg) {
            const attr: IAttrBase[] = UtilAttr.GetAttrBaseListById(curCfg.Attr);
            for (let i = 0; i < attr.length; i++) {
                if (attr[i].attrType === EAttrType.Attr_2) {
                    this.LabCurAtk.string = `${attr[i].value}`;
                } else if (attr[i].attrType === EAttrType.Attr_3) {
                    this.LabCurDef.string = `${attr[i].value}`;
                } else if (attr[i].attrType === EAttrType.Attr_1) {
                    this.LabCurHp.string = `${attr[i].value}`;
                }
            }
            const ratio = curCfg.Ratio;
            if (ratio > 0) {
                this.LabCurBase.string = `${ratio / 100}%`;
            } else {
                this.LabCurBase.string = '0%';
            }
        }

        if (!nextCfg) {
            this.LabAddAtk.node.active = false;
            this.LabAddDef.node.active = false;
            this.LabAddHp.node.active = false;
            this.LabAddBase.node.active = false;
        } else {
            this.LabAddAtk.node.active = true;
            this.LabAddDef.node.active = true;
            this.LabAddHp.node.active = true;
            this.LabAddBase.node.active = true;

            const next: IAttrBase[] = UtilAttr.GetAttrBaseListById(nextCfg.Attr);
            for (let i = 0; i < next.length; i++) {
                if (next[i].attrType === EAttrType.Attr_2) {
                    this.LabAddAtk.string = `+${next[i].value}`;
                } else if (next[i].attrType === EAttrType.Attr_3) {
                    this.LabAddDef.string = `+${next[i].value}`;
                } else if (next[i].attrType === EAttrType.Attr_1) {
                    this.LabAddHp.string = `+${next[i].value}`;
                }
            }

            const nratio = nextCfg.Ratio;
            if (nratio > 0) {
                this.LabAddBase.string = `${nratio / 100}%`;
            } else {
                this.LabAddBase.string = '';
            }
        }
    }

    private clickSkill(ex: ISkillEx, clickType: number): void {
        const skillCfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(ex.skillId);
        if (!skillCfg) return;
        const typeName = this._M.getSkillTypeName(ex.skillType);
        const tipsInfo: TipsSkillInfo = {
            skillId: ex.skillId,
            level: ex.skillLv,
            iconId: skillCfg.SkillIconID,
            type: 3,
            skillType: ex.skillType,
            typeName: `类型： ${typeName}`,
            name: skillCfg.SkillName,
        };
        const skillInfo: ActiveInfoSingle[] = [];
        skillInfo.push({ title: '技能效果', data: UtilSkillInfo.GetSkillDesc(skillCfg) });

        WinMgr.I.open(ViewConst.GeneralSkillWin, tipsInfo, this._curData);
    }

    private uptSkill(type: number) {
        let curSkillItem: cc.Node = null;
        let parent: cc.Node = null;

        if (type === 1) {
            curSkillItem = this.NdCurSkill.getChildByName('GSkillItem');
            parent = this.NdCurSkill;
        } else {
            curSkillItem = this.NdNextSkill.getChildByName('GSkillItem');
            parent = this.NdNextSkill;
        }
        const talentSkill = this._M.getSkillByType(this._curData.generalData.Skills, EGeneralSkillType.SkillTalent);
        if (talentSkill && talentSkill[0]) {
            const skillId = talentSkill[0].SkillId;
            if (!skillId) {
                parent.active = false;
                if (curSkillItem) {
                    curSkillItem.active = false;
                }
                return;
            }
            const ex: ISkillEx = {
                skillId,
                skillLv: type === 1 ? talentSkill[0].SkillLv : talentSkill[0].SkillLv + 1,
                skillType: EGeneralSkillType.SkillTalent,
                showNameOrLv: ESkillItemShow.AllShow,
                isShowLock: false,
                isUnStudy: false,
                isShowUnStudy: false,
            };

            if (curSkillItem) {
                parent.active = true;
                curSkillItem.active = true;
                curSkillItem.getComponent(GSkillItem).setData(ex, this.clickSkill, this);
            } else {
                ResMgr.I.loadLocal(UI_PATH_ENUM.Module_General_Com_GSkillItem, cc.Prefab, (e, p: cc.Prefab) => {
                    if (e) return;
                    if (curSkillItem) {
                        parent.active = true;
                        curSkillItem.active = true;
                        curSkillItem.getComponent(GSkillItem).setData(ex, this.clickSkill, this);
                    } else if (skillId) {
                        const child = cc.instantiate(p);
                        curSkillItem = child;
                        parent.active = true;
                        curSkillItem.active = true;
                        parent.addChild(child);
                        curSkillItem.getComponent(GSkillItem).setData(ex, this.clickSkill, this);
                    }
                });
            }
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
