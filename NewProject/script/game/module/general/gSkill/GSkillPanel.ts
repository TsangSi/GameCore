/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-11-15 15:46:08
 * @FilePath: \SanGuo\assets\script\game\module\general\gSkill\GSkillPanel.ts
 * @Description: 武将-技能
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagItemChangeInfo } from '../../bag/BagConst';
import {
    EGeneralSkillType, GeneralMsg, GeneralRarity, ISkillEx, ESkillState, ESkillItemShow, GeneralTitle, ESkillQuality,
} from '../GeneralConst';
import { GSkillItem } from '../com/GSkillItem';
import ListView from '../../../base/components/listview/ListView';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { GeneralModel } from '../GeneralModel';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { ItemType } from '../../../com/item/ItemConst';
import { Config } from '../../../base/config/Config';
import { ShowTips } from '../../../com/ShowTips';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { BagMgr } from '../../bag/BagMgr';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { TipsSkillInfo } from '../../../com/tips/skillPart/SkillTopPart';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ActiveInfoSingle } from '../../../com/attr/ActiveAttrList';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GSkillPanel extends WinTabPage {
    @property(cc.Node)
    private BtnLeft: cc.Node = null;
    @property(cc.Node)
    private BtnRight: cc.Node = null;
    @property(cc.Node)
    private NdSkill: cc.Node = null;
    @property(cc.Node)
    private NdUpAttr: cc.Node = null;
    @property(cc.Label)
    private LabUpAttr: cc.Label = null;
    @property(cc.Node)
    private NdRecom: cc.Node = null;
    @property(cc.Node)
    private BtnReturn: cc.Node = null;
    @property(cc.Label)
    private LabLockSkillNum: cc.Label = null;
    @property(ListView)
    private ListView: ListView = null;
    // 学习
    @property(cc.Node)
    private NdStudy: cc.Node = null;
    @property(cc.Node)
    private NdAdd: cc.Node = null;
    @property(cc.Node)
    private NdGetSoure: cc.Node = null;
    @property(cc.Node)
    private NdGetSkill: cc.Node = null;
    @property(DynamicImage)
    private SprCurrency: DynamicImage = null;
    @property(cc.Label)
    private LabNum: cc.Label = null;

    private _ndSkillItems: cc.Node[] = [];
    private _ndSkillItem: cc.Node = null;

    private _M: GeneralModel = null;
    private _curData: GeneralMsg = null;
    private _generalIds: string[] = [];
    private _index: number = 0;

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
        this.uptContent();
    }

    private addE() {
        EventClient.I.on(E.General.GSkillStudy, this.uptSkillStudy, this);
        EventClient.I.on(E.General.UptAwaken, this.uptContent, this);
        EventClient.I.on(E.General.GSkillAwaken, this.uptAwaken, this);
        EventClient.I.on(E.General.GSkillLock, this.uptContent, this);
        EventClient.I.on(E.Bag.ItemChange, this.onBagChange, this);
        EventClient.I.on(E.General.GSkillChoose, this.uptChoose, this);
        EventClient.I.on(E.General.GRecycle, this.uptRecycle, this);
    }

    private remE() {
        EventClient.I.off(E.General.GSkillStudy, this.uptSkillStudy, this);
        EventClient.I.off(E.General.UptAwaken, this.uptContent, this);
        EventClient.I.off(E.General.GSkillAwaken, this.uptAwaken, this);
        EventClient.I.off(E.General.GSkillLock, this.uptContent, this);
        EventClient.I.off(E.Bag.ItemChange, this.onBagChange, this);
        EventClient.I.off(E.General.GSkillChoose, this.uptChoose, this);
        EventClient.I.off(E.General.GRecycle, this.uptRecycle, this);
    }

    private clk() {
        UtilGame.Click(this.BtnLeft, () => {
            this.changeGeneral(false);
        }, this);

        UtilGame.Click(this.BtnRight, () => {
            this.changeGeneral(true);
        }, this);

        UtilGame.Click(this.NdUpAttr, this.uptAttrTips, this);

        UtilGame.Click(this.BtnReturn, () => {
            WinMgr.I.open(ViewConst.GSkillRecycleWin);
        }, this);

        UtilGame.Click(this.NdRecom, () => {
            WinMgr.I.open(ViewConst.GSkillRecomWin, this._curData.cfg.RecomSkilId);
        }, this, { scale: 1 });

        UtilGame.Click(this.NdStudy, () => {
            // 点击+
            WinMgr.I.open(ViewConst.GSkillChooseWin, this._skillCommon);
        }, this);

        UtilGame.Click(this.NdAdd, () => {
            // 点击+
            WinMgr.I.open(ViewConst.GSkillChooseWin, this._skillCommon);
        }, this);

        UtilGame.Click(this.NdGetSoure, () => {
            this._M.openSource();
        }, this);

        UtilGame.Click(this.NdGetSkill, () => {
            // 点击学习 先判断
            if (!this._selectItem) {
                MsgToastMgr.Show(i18n.tt(Lang.general_skill_nopush));
                return;
            }
            // 消耗是否足够
            if (this._lockCost && this._lockSkillNum) {
                const have: number = BagMgr.I.getItemNum(this._lockCost.id);
                if (have < this._lockCost.need) {
                    WinMgr.I.open(ViewConst.ItemSourceWin, this._lockCost.id);
                    return;
                }
            }
            // 判断是否有未锁定的顶级技能书
            let isTopQualityBookUnLock: boolean = false;
            const cfg: ConfigIndexer = Config.Get(Config.Type.Cfg_G_SkillQuality);
            for (let i = 0; i < this._skillCommon.length; i++) {
                if (!this._skillCommon[i].Lock) {
                    const skillCfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(this._skillCommon[i].SkillId);
                    if (skillCfg) {
                        const qcfg: Cfg_G_SkillQuality = cfg.getValueByKey(skillCfg.Quality);
                        if (qcfg && qcfg.Quality === ESkillQuality.Top) {
                            isTopQualityBookUnLock = true;
                            break;
                        }
                    }
                }
            }
            if (isTopQualityBookUnLock) {
                const str = UtilString.FormatArray(i18n.tt(Lang.general_skill_top), [UtilColor.NorV, UtilColor.RedV]);
                ModelMgr.I.MsgBoxModel.ShowBox(str, () => {
                    ControllerMgr.I.GeneralController.reqGeneralStudySkill(this._curData.generalData.OnlyId, this._selectItem);
                }, { showToggle: 'QualityUpRarity', tipTogState: false });
            } else {
                ControllerMgr.I.GeneralController.reqGeneralStudySkill(this._curData.generalData.OnlyId, this._selectItem);
            }
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
            this.uptContent();
        }
    }

    /** 回收返回的刷新 */
    private uptRecycle(recycleItems: number[]) {
        let isSelectBerecycle: boolean = false;
        if (this._selectItem) {
            for (let i = 0; i < recycleItems.length; i++) {
                if (recycleItems[i] === this._selectItem) {
                    isSelectBerecycle = true;
                    break;
                }
            }
        }
        if (isSelectBerecycle) {
            this._selectSkill = 0;
            this._selectItem = 0;
            this.uptSelectSkill();
        }
    }

    /** 属性展示 */
    private uptAttrTips() {
        const data = this.getAttrTips();
        const tips = UtilString.FormatArray(i18n.tt(Lang.general_skill_tips), [
            this._skillCommon.length,
            `${Math.ceil(data.ratio / 100)}%`,
            data.topNum,
            data.midNum,
            data.lowNum,
            UtilColor.YellowD,
            UtilColor.GreenG,
        ]);
        const pos = this.NdUpAttr.convertToWorldSpaceAR(cc.v2(60, 150));
        ShowTips.show(tips, pos);
    }

    private getAttrTips(): { topNum: number, midNum: number, lowNum: number, ratio: number } {
        this._skillCommon = this._M.getSkillByType(this._curData.generalData.Skills, EGeneralSkillType.SkillCommon);
        let topNum: number = 0;
        let midNum: number = 0;
        let lowNum: number = 0;
        let ratio: number = 0;
        const cfg: ConfigIndexer = Config.Get(Config.Type.Cfg_G_SkillQuality);
        for (let i = 0; i < this._skillCommon.length; i++) {
            const skillCfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(this._skillCommon[i].SkillId);
            if (skillCfg) {
                const qcfg: Cfg_G_SkillQuality = cfg.getValueByKey(skillCfg.Quality);
                if (qcfg) {
                    ratio += qcfg.AttrInc;
                    if (qcfg.Quality === ESkillQuality.Low) {
                        lowNum++;
                    } else if (qcfg.Quality === ESkillQuality.Mid) {
                        midNum++;
                    } else if (qcfg.Quality === ESkillQuality.Top) {
                        topNum++;
                    }
                }
            }
        }
        return {
            topNum, midNum, lowNum, ratio,
        };
    }

    /** 学习 */
    private uptStudy() {
        // 属性提升
        const tipsData = this.getAttrTips();
        this.LabUpAttr.string = `${Math.ceil(tipsData.ratio / 100)}%`;
        // 消耗
        this.uptCost(this._lockSkillNum);
        // 技能书
        this.uptSelectSkill();
    }

    /** 选择了哪个技能书 */
    private _selectSkill: number = 0;
    private _selectItem: number = 0;
    private uptChoose(itemId: number, skillId: number) {
        this._selectSkill = skillId;
        this._selectItem = itemId;
        this.uptSelectSkill();
    }

    private uptSelectSkill() {
        const ex: ISkillEx = {
            skillId: this._selectSkill,
            showNameOrLv: ESkillItemShow.OnlyName,
            isShowLock: false,
            isUnStudy: false,
            isShowUnStudy: false,
        };

        if (this._ndSkillItem) {
            this._ndSkillItem.getComponent(GSkillItem).setData(ex, this.openSkillChoose, this);
        } else {
            ResMgr.I.loadLocal(UI_PATH_ENUM.Module_General_Com_GSkillItem, cc.Prefab, (e, p: cc.Prefab) => {
                if (e) return;
                if (this._ndSkillItem) {
                    this._ndSkillItem.active = true;
                    this._ndSkillItem.getComponent(GSkillItem).setData(ex, this.openSkillChoose, this);
                } else {
                    // 还没有
                    const child = cc.instantiate(p);
                    this._ndSkillItem = child;
                    this._ndSkillItem.active = true;
                    this.NdStudy.addChild(child);
                    this._ndSkillItem.getComponent(GSkillItem).setData(ex, this.openSkillChoose, this);
                }
            });
        }

        this.NdAdd.active = this._selectSkill === 0;
    }

    private openSkillChoose() {
        WinMgr.I.open(ViewConst.GSkillChooseWin, this._skillCommon);
    }

    private uptCost(lockNum: number) {
        // 锁定技能的消耗
        if (!lockNum) {
            this.SprCurrency.node.active = false;
            this.LabNum.node.active = false;
            return;
        }

        this.SprCurrency.node.active = true;
        this.LabNum.node.active = true;
        const skillLock: Cfg_G_SkillLock = Config.Get(Config.Type.Cfg_G_SkillLock).getValueByKey(lockNum);
        const cost = skillLock.Cost.split(':');
        const id: number = +cost[0];
        const need: number = +cost[1];
        this._lockCost = { id, need };
        const have: number = BagMgr.I.getItemNum(id);
        this.LabNum.string = `${UtilNum.Convert(have)}/${need}`;
        const color: cc.Color = have >= need ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.RedV);
        this.LabNum.node.color = color;
        const costImgUrl: string = UtilCurrency.getIconByCurrencyType(id);
        this.SprCurrency.loadImage(costImgUrl, 1, true);
    }

    /** 不同头衔的武将，其可公共技能上限 */
    private _skillMax: number = 0;
    /** 不同头衔的武将，其可锁定的（公共）技能上限 */
    private _skillLockMax: number = 0;
    /** 当前头衔下可学习的（公共）技能上限 */
    private _canStudyMax: number = 0;
    /** 公共技能列表（武将身上拿，但是要刷选出是公共技能） */
    private _skillCommon: GeneralSkill[] = [];
    /** 当前已经锁定了的技能的数量 */
    private _lockSkillNum: number = 0;
    /** 锁定技能的消耗 */
    private _lockCost: { id: number, need: number } = cc.js.createMap(true);
    /** 新增的技能id */
    private _newSkillId: number = 0;

    private uptSkillList() {
        const curTitle: number = this._curData.generalData.Title;
        const maxTitle: number = curTitle >= GeneralTitle.Title7 ? GeneralTitle.Title9 : curTitle >= GeneralTitle.Title4 ? GeneralTitle.Title6 : GeneralTitle.Title3;
        const cfgMax: Cfg_GeneralTitle = Config.Get(Config.Type.Cfg_GeneralTitle).getValueByKey(maxTitle);
        this._skillMax = cfgMax.SkillMax;
        const cfg: Cfg_GeneralTitle = Config.Get(Config.Type.Cfg_GeneralTitle).getValueByKey(curTitle);
        this._canStudyMax = cfg.SkillMax;
        this._skillLockMax = cfg.SkillLockMax;
        this._skillCommon = this._M.getSkillByType(this._curData.generalData.Skills, EGeneralSkillType.SkillCommon);
        this._lockSkillNum = this._skillCommon.reduce((pre: number, cur: GeneralSkill) => pre + cur.Lock, 0);

        this.LabLockSkillNum.string = `${this._lockSkillNum}/${this._skillLockMax}`;
        const color: cc.Color = this._lockSkillNum >= this._skillLockMax ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.RedV);
        this.LabLockSkillNum.node.color = color;

        this.ListView.setNumItems(this._skillMax);
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: GeneralSkill = this._skillCommon[idx];
        const item = node.getComponent(GSkillItem);
        if (item) {
            if (data) {
                const ex: ISkillEx = {
                    skillId: data.SkillId,
                    skillType: data.SkillType,
                    skillLv: data.SkillLv,
                    isLock: !!data.Lock,
                    isShowLock: !!data.Lock || (this._lockSkillNum < this._skillLockMax),
                    showNameOrLv: ESkillItemShow.OnlyName,
                    isUnStudy: idx >= this._skillCommon.length,
                };
                item.getComponent(GSkillItem).setData(ex, this.clickSkill, this);
                if (this._newSkillId === data.SkillId) {
                    item.getComponent(GSkillItem).playAnim();
                    this._newSkillId = 0;
                }
            } else {
                const ex: ISkillEx = {
                    skillId: 0,
                    isShowUnStudy: false,
                };
                if (idx >= this._canStudyMax) {
                    ex.isShowUnStudy = true;
                }
                item.getComponent(GSkillItem).setData(ex);
            }
        }
    }

    /**
     *
     * @param ex 数据
     * @param clickType 点击类型：1.查看技能 2.激活 3.锁定 4.取消锁定
     */
    private clickSkill(ex: ISkillEx, clickType: number): void {
        if (clickType === 1) {
            const skillCfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(ex.skillId);
            const typeName = this._M.getSkillTypeName(ex.skillType);
            const tipsInfo: TipsSkillInfo = {
                skillId: ex.skillId,
                iconId: skillCfg.SkillIconID,
                type: 3,
                skillType: ex.skillType,
                typeName: `类型： ${typeName}`,
                name: skillCfg.SkillName,
                level: ex.skillType === EGeneralSkillType.SkillTalent ? ex.skillLv : 0,
                unlock: ex.skillState,
                unlockString: ex.activeDesc,
            };

            if (ex.skillType === EGeneralSkillType.SkillTalent) {
                WinMgr.I.open(ViewConst.GeneralSkillWin, tipsInfo, this._curData);
                return;
            }

            const skillInfo: ActiveInfoSingle[] = [];
            // 觉醒技能
            if (ex.skillType === EGeneralSkillType.SkillAwaken) {
                // 1. 未激活: 技能效果和升级条件
                if (ex.skillState === ESkillState.UnActive) {
                    skillInfo.push({ title: '技能效果', data: UtilSkillInfo.GetSkillDesc(skillCfg) });
                    skillInfo.push({ title: '激活条件', data: i18n.tt(Lang.general_skill_active) });
                } else if (ex.skillState === ESkillState.CanActive) {
                    // 可激活
                    ControllerMgr.I.GeneralController.reqGeneralAwakenSkill(this._curData.generalData.OnlyId);
                } else {
                    // 已激活
                    skillInfo.push({ title: '技能效果', data: UtilSkillInfo.GetSkillDesc(skillCfg) });
                }
            } else {
                skillInfo.push({ title: '技能效果', data: UtilSkillInfo.GetSkillDesc(skillCfg, ex.skillLv) });
                skillInfo.push({ title: `【${i18n.tt(Lang.com_next_limit)}】`, data: i18n.tt(Lang.com_level_max), infoColor: UtilColor.GreenD });
            }

            WinMgr.I.open(ViewConst.TipsSkillWin, tipsInfo, skillInfo);
        } else if (clickType === 2) {
            // 请求激活觉醒技能
            ControllerMgr.I.GeneralController.reqGeneralAwakenSkill(this._curData.generalData.OnlyId);
        } else if (clickType === 3) {
            // 请求锁定/锁定
            ControllerMgr.I.GeneralController.reqGeneralSkillLock(this._curData.generalData.OnlyId, ex.skillId);
        } else if (clickType === 4) {
            // 请求解锁/锁定
            ControllerMgr.I.GeneralController.reqGeneralSkillLock(this._curData.generalData.OnlyId, ex.skillId);
        }
    }

    private uptRSkill() {
        // 先看下当前武将会有多少个技能类型
        const skillIds: GeneralSkill[] = [];
        if (this._curData.cfg.BaseSkillId) {
            const skill: GeneralSkill = {
                SkillId: +this._curData.cfg.BaseSkillId,
                SkillType: EGeneralSkillType.SkillActive,
                SkillLv: 1,
                Lock: 0,
            };
            skillIds.push(skill);
        }
        if (this._curData.cfg.TalentSkillID) {
            const skillData: GeneralSkill = this._M.getSkillById(this._curData.generalData.Skills, +this._curData.cfg.TalentSkillID);
            const skill: GeneralSkill = {
                SkillId: +this._curData.cfg.TalentSkillID,
                SkillType: EGeneralSkillType.SkillTalent,
                SkillLv: skillData ? skillData.SkillLv : 1,
                Lock: 0,
            };
            skillIds.push(skill);
        }
        if (this._curData.cfg.AwakenSkillID && this._curData.cfg.Rarity === GeneralRarity.Rarity5) {
            const skill: GeneralSkill = {
                SkillId: +this._curData.cfg.AwakenSkillID,
                SkillType: EGeneralSkillType.SkillAwaken,
                SkillLv: 1,
                Lock: 0,
            };
            skillIds.push(skill);
        }
        // 多余的这里只隐藏
        if (this._ndSkillItems) {
            for (let index = skillIds.length; index < this._ndSkillItems.length; index++) {
                const element = this._ndSkillItems[index];
                element.active = false;
            }
        }

        let isAllLoad: boolean = true;
        const isLoad: boolean[] = [true, true, true];
        for (let i = 0; i < skillIds.length; i++) {
            if (this._ndSkillItems[i]) {
                this._ndSkillItems[i].active = true;

                const ex: ISkillEx = this.getEx(skillIds[i]);
                this._ndSkillItems[i].getComponent(GSkillItem).setData(ex, this.clickSkill, this);
            } else {
                isLoad[i] = false;
                isAllLoad = false;
            }
        }
        if (isAllLoad) return;
        ResMgr.I.loadLocal(UI_PATH_ENUM.Module_General_Com_GSkillItem, cc.Prefab, (e, p: cc.Prefab) => {
            if (e) return;
            for (let i = 0; i < skillIds.length; i++) {
                if (isLoad[i]) continue;

                const ex: ISkillEx = this.getEx(skillIds[i]);

                if (this._ndSkillItems[i]) {
                    this._ndSkillItems[i].active = true;
                    this._ndSkillItems[i].getComponent(GSkillItem).setData(ex, this.clickSkill, this);
                } else {
                    // 还没有
                    const child = cc.instantiate(p);
                    this._ndSkillItems[i] = child;
                    this._ndSkillItems[i].active = true;
                    this.NdSkill.addChild(child);
                    this._ndSkillItems[i].getComponent(GSkillItem).setData(ex, this.clickSkill, this);
                }
            }
        });
    }

    private getEx(d: GeneralSkill): ISkillEx {
        // 天赋技能有技能等级
        // const skillLv: number = 1
        // if (d.SkillType === EGeneralSkillType.SkillTalent) {
        //     const skillData: GeneralSkill = this._M.getSkillById(this._curData.generalData.Skills, +this._curData.cfg.TalentSkillID);
        //     if (skillData) skillLv = skillData.SkillLv
        // }
        const ex: ISkillEx = {
            skillId: d.SkillId,
            skillType: d.SkillType,
            skillLv: d.SkillLv,
            isLock: !!d.Lock,
            showNameOrLv: ESkillItemShow.OnlyName,
            isShowLock: false,
            isUnStudy: false,
        };
        if (d.SkillType === EGeneralSkillType.SkillAwaken) {
            // 觉醒技能状态
            ex.skillState = this._M.getAwakenSkillState(this._curData, d.SkillId);
            ex.activeDesc = i18n.tt(Lang.general_skill_active);
        }
        return ex;
    }

    private uptAwaken() {
        this.uptChoose(0, 0);
        this.uptContent();
    }

    /** 学习技能书的刷新 */
    private uptSkillStudy(skillId: number) {
        this._newSkillId = skillId;
        this._selectItem = 0;
        this._selectSkill = 0;

        // 技能列表
        this.uptSkillList();
        // 技能学习
        this.uptStudy();
    }

    private uptContent() {
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

        if (this.node.active) {
            EventClient.I.emit(E.General.UptEntity, this._curData);
        }

        // 右上角的技能
        this.uptRSkill();
        // 技能列表
        this.uptSkillList();
        // 技能学习
        this.uptStudy();
        //
        this.uptArrow();
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
        this.uptContent();
    }

    private uptArrow() {
        this.BtnLeft.active = this._index > 0;
        this.BtnRight.active = this._index < this._generalIds.length - 1;
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
