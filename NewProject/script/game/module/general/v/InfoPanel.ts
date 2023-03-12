/*
 * @Author: kexd
 * @Date: 2022-08-16 16:50:17
 * @FilePath: \SanGuo\assets\script\game\module\general\v\InfoPanel.ts
 * @Description: 武将-主界面（信息）
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import ListView from '../../../base/components/listview/ListView';
import GeneralHead from '../com/GeneralHead';
import {
    GeneralMsg, ClickType, EGeneralSkillType, ISkillEx, ESkillItemShow, EGeneralUiType,
} from '../GeneralConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { RID } from '../../reddot/RedDotConst';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { TipsSkillInfo } from '../../../com/tips/skillPart/SkillTopPart';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { FuncId } from '../../../const/FuncConst';
import { ItemType } from '../../../com/item/ItemConst';
import { BagItemChangeInfo } from '../../bag/BagConst';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import { GeneralModel } from '../GeneralModel';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { GSkillItem } from '../com/GSkillItem';
import { GeneralCombo } from '../com/GeneralCombo';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ActiveInfoSingle } from '../../../com/attr/ActiveAttrList';

const { ccclass, property } = cc._decorator;

@ccclass
export default class InfoPanel extends WinTabPage {
    @property(cc.Node)
    private BtnRelation: cc.Node = null;
    @property(cc.Node)
    private BtnSkin: cc.Node = null;
    @property(cc.Node)
    private BtnPlan: cc.Node = null;
    @property(cc.Label)
    private LabPlan: cc.Label = null;
    @property(cc.Node)
    private NdEquip0: cc.Node = null;
    @property(cc.Node)
    private NdEquip1: cc.Node = null;
    @property(cc.Node)
    private BtnBook: cc.Node = null;
    // 下拉
    @property(cc.Node)
    private NdCombo: cc.Node = null;

    // 底部展示
    @property(ListView)
    private ListHead: ListView = null;
    @property(cc.Label)
    private LabNum: cc.Label = null;
    @property(cc.Node)
    private NdSkill: cc.Node = null;

    private _M: GeneralModel = null;
    private _combIndex: number = 0;
    private _curData: GeneralMsg = null;
    private _generalList: GeneralMsg[] = [];
    private _posLock: string[] = []; // 三个位置的解锁情况
    private _ids: string[]; // 三个位置的出战情况
    private _ndSkillItem: cc.Node = null;
    private _ndComb: cc.Node = null;

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

        this.BtnSkin.active = UtilFunOpen.canShow(FuncId.GeneralSkin);
        this.uptGeneralCombo();

        UtilRedDot.Bind(RID.General.Cur.CurSkin, this.BtnSkin, cc.v2(20, 35));
        // 红点检查
        this.checkCurRed();
        // 主动调用下红点刷新
        this._M.checkComposeRed();
    }

    protected onEnable(): void {
        if (this._curData && this._generalList) {
            const idx = this._generalList.findIndex((v) => v.generalData.OnlyId === this._curData.generalData.OnlyId);
            if (idx >= 0) {
                this.ListHead.scrollTo(idx);
            }
        }
    }

    private _isinit: boolean = false;
    protected lateUpdate(dt: number): void {
        if (!this._isinit) {
            this.scheduleOnce(() => {
                this.ListHead.frameByFrameRenderNum = 0;
            }, 0.3);
            this._isinit = true;
        }
    }

    private addE() {
        EventClient.I.on(E.General.LevelUp, this.uptUI, this);
        EventClient.I.on(E.General.QualityUp, this.uptUI, this);
        EventClient.I.on(E.General.GReborn, this.uptUI, this);
        EventClient.I.on(E.General.Add, this.uptUI, this);
        EventClient.I.on(E.General.Del, this.uptUI, this);
        EventClient.I.on(E.General.UptAttr, this.uptUI, this);
        EventClient.I.on(E.BattleUnit.UptUnit, this.uptUnit, this);
        EventClient.I.on(E.General.UptTitle, this.uptUI, this);
        EventClient.I.on(E.General.GskinWear, this.uptUI, this);
        EventClient.I.on(E.General.InfoHead, this.uptClickHead, this);

        EventClient.I.on(E.Bag.ItemChange, this._onBagChange, this);
    }

    private remE() {
        EventClient.I.off(E.General.LevelUp, this.uptUI, this);
        EventClient.I.off(E.General.QualityUp, this.uptUI, this);
        EventClient.I.off(E.General.GReborn, this.uptUI, this);
        EventClient.I.off(E.General.Add, this.uptUI, this);
        EventClient.I.off(E.General.Del, this.uptUI, this);
        EventClient.I.off(E.General.UptAttr, this.uptUI, this);
        EventClient.I.off(E.BattleUnit.UptUnit, this.uptUnit, this);
        EventClient.I.off(E.General.UptTitle, this.uptUI, this);
        EventClient.I.off(E.General.GskinWear, this.uptUI, this);
        EventClient.I.off(E.General.InfoHead, this.uptClickHead, this);

        EventClient.I.off(E.Bag.ItemChange, this._onBagChange, this);
    }

    private clk() {
        UtilGame.Click(this.BtnRelation, () => {
            WinMgr.I.open(ViewConst.GFetters);
        }, this);

        UtilGame.Click(this.BtnSkin, () => {
            if (this._curData) {
                const has = ModelMgr.I.GskinModel.hasGeneralSkin(this._curData.generalData.IId);
                if (has) {
                    WinMgr.I.open(ViewConst.GskinWin);
                } else {
                    MsgToastMgr.Show(i18n.tt(Lang.general_gskin_none));
                }
            }
        }, this);

        UtilGame.Click(this.BtnPlan, () => {
            WinMgr.I.open(ViewConst.PlanWin);
        }, this);

        UtilGame.Click(this.NdEquip0, () => {
            //
        }, this);

        UtilGame.Click(this.NdEquip1, () => {
            //
        }, this);

        UtilGame.Click(this.BtnBook, () => {
            WinMgr.I.open(ViewConst.GBookWin);
        }, this);

        // 绑定红点
        UtilRedDot.Bind(RID.General.Main.Plan.Id, this.BtnPlan, cc.v2(30, 30));
        UtilRedDot.Bind(RID.General.Main.Compose, this.BtnBook, cc.v2(30, 30));
    }

    public setData(isInit: boolean): void {
        if (!this._M) {
            this._M = ModelMgr.I.GeneralModel;
        }
        // 三个位置解锁情况
        this._posLock = ModelMgr.I.PlanModel.checkGeneralPosLock();
        // 三个位置的出战情况
        this._ids = ModelMgr.I.PlanModel.getPosOnly();

        this._generalList = this._M.getGeneralListByNewRarity(this._combIndex);
        this._generalList.sort(this._M.sort);
        this._M.setGeneralIds(this._generalList);
        // 切页不改变选中
        let index = 0;
        if (!isInit) {
            const curOnlyId = this._M.curOnlyId;
            if (curOnlyId) {
                index = this._generalList.findIndex((v) => v.generalData.OnlyId === curOnlyId);
            }
        }

        this.uptContent(index);
        this.uptNum();
    }

    /** 改变出战的刷新 */
    private uptUnit() {
        // 三个位置的出战情况
        this._ids = ModelMgr.I.PlanModel.getPosOnly();
        this.uptUI();
    }

    private _onBagChange(changes: BagItemChangeInfo[]) {
        let isCheck = false;
        if (changes) {
            for (let i = 0; i < changes.length; i++) {
                if (changes[i].itemModel && changes[i].itemModel.cfg) {
                    if (changes[i].itemModel.cfg.SubType === ItemType.GENERAL_TYPE) {
                        // 检查当前武将的升阶红点（消耗本体）
                        this._M.checkCurGradeUpRed(this._curData);
                        isCheck = true;
                    } else if (changes[i].itemModel.cfg.SubType === ItemType.GENERAL_ITEM) {
                        // 检查当前武将的升级的红点
                        this._M.checkCurLevelUp(this._curData);
                        // 检查当前武将的升阶红点（消耗道具）
                        this._M.checkCurGradeUpRed(this._curData);
                        // 检查当前武将的觉醒红点
                        this._M.checkCurAwakenRed(this._curData);
                        // 检查当前武将的装备红点
                        this._M.checkCurEquipWearRed(this._curData);
                        this._M.checkCurEquipStarUpRed(this._curData);

                        isCheck = true;
                    } else if (changes[i].itemModel.cfg.SubType === ItemType.SKIN_GENERAL) {
                        // 检查当前武将的皮肤红点
                        this._M.checkCurSkinRed(this._curData);
                        isCheck = true;
                    }
                }
            }
        }
        if (isCheck) {
            const index = this._generalList.findIndex((v) => v.generalData.OnlyId === this._curData.generalData.OnlyId);
            if (index >= 0) {
                this.ListHead.updateItem(index);
            }
        }
    }

    /**
     * 这是用在list里的渲染接口，会检测每个武将卡片的红点
     * 卡片上的红点：1. 该卡片的出战红点 2. 该卡片的皮肤红点 3. 该卡片的培养（包括升级升阶觉醒）红点（只需是出战的）
    */
    private checkGeneralCardRed(data: GeneralMsg): boolean {
        // 1. 该卡片的出战红点 (和是否选中无关)
        let isRed: boolean = ModelMgr.I.PlanModel.isPlanRed(data, this._ids, this._posLock);
        if (!isRed) {
            // 2. 该卡片的皮肤红点(和出战无关，和是否选中无关)
            isRed = this._M.isCurSkinRed(data);
        }
        if (!isRed) {
            // 3. 该卡片的培养（包括升级升阶觉醒）红点，（只需是出战的,和是否选中无关）
            // 是否出战
            if (data.battlePos > 0) {
                // (1). 升级
                isRed = this._M.canLevelUp(data);
                if (!isRed) {
                    // (2). 升阶
                    isRed = this._M.canGradeUp(data.generalData.OnlyId);
                }
                if (!isRed) {
                    // (3). 觉醒
                    isRed = this._M.canAwaken(data.generalData.OnlyId);
                }
                if (!isRed) {
                    // (4). 装备
                    isRed = this._M.canWear(data);
                }
                if (!isRed) {
                    // (5). 技能
                    isRed = this._M.canSkillUp(data);
                }
            }
        }
        return isRed;
    }

    /**
     * 当前选中的武将的红点处理：主要是刷新和选中才显示的红点：皮肤及培养的升级升阶觉醒。
     */
    private checkCurRed() {
        if (!this._curData) return;
        // 检查当前武将的升级的红点
        this._M.checkCurLevelUp(this._curData);

        // 检查当前武将的升阶红点
        this._M.checkCurGradeUpRed(this._curData);

        // 检查当前武将的觉醒红点
        this._M.checkCurAwakenRed(this._curData);

        // 检查皮肤红点
        this._M.checkCurSkinRed(this._curData);

        // 检查装备红点
        this._M.checkCurEquipWearRed(this._curData);
        this._M.checkCurEquipStarUpRed(this._curData);
    }

    /**
     * 升级升品会影响排序，但是当前选中的武将不要变
     * 改变锁的状态不会影响排序，只是需要刷新即可
     */
    private uptUI() {
        if (!this._curData) return;
        // 要重新获取数据才行
        this._generalList = this._M.getGeneralListByNewRarity(this._combIndex);
        this._generalList.sort(this._M.sort);
        this._M.setGeneralIds(this._generalList);
        // 当前武将是否还存在，不存在则需要重现选择
        if (this._generalList && this._generalList.length > 0) {
            const curIndex: number = this._generalList.findIndex((v) => v.generalData.OnlyId === this._M.curOnlyId);
            if (curIndex < 0) {
                this._M.curOnlyId = this._generalList[0].generalData.OnlyId;
            }
            // 不改变选中的武将，但是需要刷新其数据
            for (let i = 0; i < this._generalList.length; i++) {
                if (this._generalList[i].generalData.OnlyId === this._M.curOnlyId) {
                    this._curData = this._generalList[i];
                    break;
                }
            }
            if (!this._curData.cfg) {
                this._curData.cfg = this._M.cfgGeneral.getValueByKey(this._curData.generalData.IId);
            }
        } else {
            this._curData = null;
        }

        this.ListHead.setNumItems(this._generalList.length);

        this.uptSkill();

        if (this._curData && this._curData.battlePos > 0) {
            this.LabPlan.string = `${this._curData.battlePos - 1}${i18n.tt(Lang.general_plan_pos)}`;
        } else {
            this.LabPlan.string = '';
        }
        // 红点检查
        this.checkCurRed();
    }

    private uptNum() {
        const cfg: Cfg_Config_General = this._M.cfgConfigGeneral.getValueByKey('GeneralMaxNum');
        this.LabNum.string = `${this._generalList.length}/${cfg.CfgValue}`;
        this.LabNum.node.color = this._generalList.length < +cfg.CfgValue ? UtilColor.Hex2Rgba(UtilColor.NorV) : UtilColor.Hex2Rgba(UtilColor.RedV);
    }

    private uptContent(index: number) {
        // 选中武将
        this._curData = this._generalList[index];
        if (this._curData) {
            this._M.curOnlyId = this._generalList[index].generalData.OnlyId;
        } else {
            return;
        }
        if (!this._curData) return;
        if (!this._curData.cfg) {
            this._curData.cfg = this._M.cfgGeneral.getValueByKey(this._curData.generalData.IId);
        }

        if (this.node.active) {
            EventClient.I.emit(E.General.UptEntity, this._curData, EGeneralUiType.Info);
        }

        this.uptSkill();

        this.ListHead.setNumItems(this._generalList.length);
        // this.ListHead.updateItem(index);
        if (this._curData && this._curData.battlePos > 0) {
            this.LabPlan.string = `${this._curData.battlePos - 1}${i18n.tt(Lang.general_plan_pos)}`;
        } else {
            this.LabPlan.string = '';
        }

        // 红点检查
        this.checkCurRed();
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: GeneralMsg = this._generalList[idx];
        const isRed: boolean = this.checkGeneralCardRed(data);

        let isSelected: boolean = false;
        if (this._curData) {
            isSelected = this._curData.generalData.OnlyId === data.generalData.OnlyId;
        }
        const item = node.getComponent(GeneralHead);
        if (data && item) {
            item.setData(data, { clickType: ClickType.Info, isRed, isSelected });
        }
    }

    /** 选中哪个武将 */
    private uptClickHead(onlyId: string) {
        const index = this._generalList.findIndex((v) => v.generalData.OnlyId === onlyId);
        if (index < 0) {
            console.warn('不存在该武将');
            return;
        }
        this._curData = this._generalList[index];
        if (!this._curData) return;
        if (!this._curData.cfg) {
            this._curData.cfg = this._M.cfgGeneral.getValueByKey(this._curData.generalData.IId);
        }
        this._M.curOnlyId = this._generalList[index].generalData.OnlyId;

        this.uptSkill();

        if (this.node.active) {
            EventClient.I.emit(E.General.UptEntity, this._curData, EGeneralUiType.Info);
        }
        // 重新刷新
        this.ListHead.setNumItems(this._generalList.length);
        // this.ListHead.updateItem(index);

        //
        if (this._curData && this._curData.battlePos > 0) {
            this.LabPlan.string = `${this._curData.battlePos - 1}${i18n.tt(Lang.general_plan_pos)}`;
        } else {
            this.LabPlan.string = '';
        }
        // 红点检查
        this.checkCurRed();
    }

    private uptSkill() {
        if (!this._curData) return;
        const skillId = parseInt(this._curData.cfg.BaseSkillId);
        const ex: ISkillEx = {
            skillId,
            skillType: EGeneralSkillType.SkillActive,
            showNameOrLv: ESkillItemShow.OnlyName,
            isShowLock: false,
            isUnStudy: false,
            isShowUnStudy: false,
        };

        if (this._ndSkillItem) {
            this._ndSkillItem.getComponent(GSkillItem).setData(ex, this.clickSkill, this);
        } else {
            ResMgr.I.loadLocal(UI_PATH_ENUM.Module_General_Com_GSkillItem, cc.Prefab, (e, p: cc.Prefab) => {
                if (e) return;
                if (this._ndSkillItem) {
                    this._ndSkillItem.active = true;
                    this._ndSkillItem.getComponent(GSkillItem).setData(ex, this.clickSkill, this);
                } else {
                    // 还没有
                    const child = cc.instantiate(p);
                    this._ndSkillItem = child;
                    this._ndSkillItem.active = true;
                    this.NdSkill.addChild(child);
                    this._ndSkillItem.getComponent(GSkillItem).setData(ex, this.clickSkill, this);
                }
            });
        }
    }

    private clickSkill(ex: ISkillEx, clickType: number): void {
        const skillCfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(ex.skillId);
        const typeName = this._M.getSkillTypeName(ex.skillType);
        const tipsInfo: TipsSkillInfo = {
            skillId: ex.skillId,
            iconId: skillCfg.SkillIconID,
            type: 3,
            skillType: ex.skillType,
            typeName: `类型： ${typeName}`,
            name: skillCfg.SkillName,
        };
        const skillInfo: ActiveInfoSingle[] = [];
        skillInfo.push({ title: '技能效果', data: UtilSkillInfo.GetSkillDesc(skillCfg) });

        WinMgr.I.open(ViewConst.TipsSkillWin, tipsInfo, skillInfo);
    }

    private uptGeneralCombo() {
        if (this._ndComb) {
            const pos = this.NdCombo.convertToWorldSpaceAR(cc.v2(-224, -108));
            this._ndComb.getComponent(GeneralCombo).setData(this._combIndex, pos, this.combSelect, this);
        } else {
            ResMgr.I.loadLocal(UI_PATH_ENUM.GeneralCombo, cc.Prefab, (e, p: cc.Prefab) => {
                if (e) return;
                if (this._ndComb) {
                    this._ndComb.active = true;
                    const pos = this.NdCombo.convertToWorldSpaceAR(cc.v2(-224, -108));
                    this._ndComb.getComponent(GeneralCombo).setData(this._combIndex, pos, this.combSelect, this);
                } else {
                    // 还没有
                    const child = cc.instantiate(p);
                    this._ndComb = child;
                    this._ndComb.active = true;
                    this.NdCombo.addChild(child);
                    const pos = this.NdCombo.convertToWorldSpaceAR(cc.v2(-224, -108));
                    this._ndComb.getComponent(GeneralCombo).setData(this._combIndex, pos, this.combSelect, this);
                }
            });
        }
    }

    private combSelect(index: number) {
        const list: GeneralMsg[] = this._M.getGeneralListByNewRarity(index);
        this._combIndex = index;
        this._generalList = list;
        this._generalList.sort(this._M.sort);
        this._M.setGeneralIds(this._generalList);

        this.uptContent(0);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
        this._M.clearGeneralIds();
    }
}
