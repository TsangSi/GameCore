/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-08-15 16:38:10
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\GeneralModel.ts
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { ANIM_TYPE } from '../../base/anim/AnimCfg';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigGeneralEquipIndexer } from '../../base/config/indexer/ConfigGeneralEquipIndexer';
import { ConfigGeneralSkinIndexer } from '../../base/config/indexer/ConfigGeneralSkinIndexer';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { ConfigLimitConditionIndexer } from '../../base/config/indexer/ConfigLimitConditionIndexer';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import UtilGeneral from '../../base/utils/UtilGeneral';
import { ItemType } from '../../com/item/ItemConst';
import { IBoxCfg } from '../../com/msgbox/ConfirmBox';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import { EntityUnitType } from '../../entity/EntityConst';
import ControllerMgr from '../../manager/ControllerMgr';
import ModelMgr from '../../manager/ModelMgr';
import { BagMgr } from '../bag/BagMgr';
import { IGetAwardsInfo } from '../grade/v/GradeGetAwardsWin';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import { RID, IListenInfo, REDDOT_ADD_LISTEN_INFO } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import {
    GeneralMsg, GeneralRarity, GeneralQuality, AttrIndex, GEquipMsg, EGeneralSkillType, ESkillState, GeneralTitle, ESkillQuality,
} from './GeneralConst';
import { GSkinState } from './gskin/GskinConst';
import { EAttrType, IAttrBase } from '../../base/attribute/AttrConst';
import { ConfigAttributeIndexer } from '../../base/config/indexer/ConfigAttributeIndexer';

const { ccclass } = cc._decorator;
@ccclass('GeneralModel')
export class GeneralModel extends BaseModel {
    /** 武将信息 */
    protected _generalData: Map<string, GeneralMsg> = new Map();
    /** 武将皮肤列表 */
    private _generalSkinData: Map<number, GeneralSkin> = new Map();
    /** 当前选择的武将id */
    protected _curOnlyId: string = '';

    /** 配置（Cfg_Config_General） */
    private _cfgConfigGeneral: ConfigIndexer;
    public get cfgConfigGeneral(): ConfigIndexer {
        if (!this._cfgConfigGeneral) {
            this._cfgConfigGeneral = Config.Get(Config.Type.Cfg_Config_General);
        }
        return this._cfgConfigGeneral;
    }

    /** 为了减少消耗，只需取得一次消耗的丹药数据即可 */
    private _cost: { id: number, num: number }[] = [];
    public get levelUpCost(): { id: number, num: number }[] {
        if (!this._cost || this._cost.length === 0) {
            this.initCostData();
        }
        return this._cost;
    }
    private initCostData() {
        this._cost = [];
        const cfg: Cfg_Config_General = this.cfgConfigGeneral.getValueByKey('ExpItem');
        const items = cfg.CfgValue.split('|');
        if (items && items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                const d = items[i].split(':');
                this._cost.push({
                    id: +d[0],
                    num: +d[1],
                });
            }
        }
    }

    /**
     *  总战力 =
        初始生命属性*最高品质累乘系数*（1+升阶初始稀有度最高万分比）+（最高等级生命*（生命资质/2700 +（最高资质成长值+最高武将装备成长值)/10000*(1+头衔对应增幅/10000)-1）））*（1+最高技能数*技能系数3%+最高武将装备升级万分比）+
        初始攻击属性*最高品质累乘系数*（1+升阶初始稀有度最高万分比）+（最高等级攻击*（攻击资质/1320 +（最高资质成长值+最高武将装备成长值)/10000*(1+头衔对应增幅/10000)-1）））*（1+最高技能数*技能系数3%+最高武将装备升级万分比）+
        初始防御属性*最高品质累乘系数*（1+升阶初始稀有度最高万分比）+（最高等级防御*（防御资质/720 +（最高资质成长值+最高武将装备成长值)/10000*(1+头衔对应增幅/10000)-1）））*（1+最高技能数*技能系数3%+最高武将装备升级万分比
        +升阶最高战力
        +装备最高战力
        * @param msg 传进来的msg已经有了最高品质，最高头衔，最高资质（生命，攻击，防御，成长）
     */
    public getBookFv(msg: GeneralMsg): number {
        // 基础属性
        const indexer = Config.Get<ConfigAttributeIndexer>(Config.Type.Cfg_Attribute);
        const attrs: IAttrBase[] = indexer.getAttrsById(msg.cfg.Attr);
        let baseHp: number = 0;
        let baseAtk: number = 0;
        let baseDef: number = 0;
        for (let i = 0; i < attrs.length; i++) {
            if (attrs[i].attrType === EAttrType.Attr_1) {
                baseHp = attrs[i].value;
            } else if (attrs[i].attrType === EAttrType.Attr_2) {
                baseAtk = attrs[i].value;
            } else if (attrs[i].attrType === EAttrType.Attr_3) {
                baseDef = attrs[i].value;
            }
        }
        // 最高武将装备数据
        const maxEquipStarUp: Cfg_Genera_EquipStarUp = this.getMaxEquipStarUpCfg();
        const maxEquipGrow: number = maxEquipStarUp.GrowPer;
        const maxEquipLvUp: number = maxEquipStarUp.AttrPer / 10000;
        const maxEquipFv: number = indexer.getFightValueById(maxEquipStarUp.Attr);
        // 最高升级属性
        const maxLevelUpCfg: Cfg_GeneralLevelUp = this.getMaxLevelUpCfg();
        // 最高升阶数据
        const maxGradeUpCfg: Cfg_GeneralGradeUp = this.getMaxGradeUpCfg(msg.cfg.Rarity);
        const maxGradeUpRation: number = maxGradeUpCfg.Ratio / 10000;
        const maxGradeUpFv: number = indexer.getFightValueById(maxGradeUpCfg.Attr);
        // 最高品质系数
        const minQuality = msg.cfg.Quality;
        const maxQuality = msg.generalData.Quality;
        let qualityUp: number = 1;
        if (maxQuality > minQuality) {
            const indexerQ = Config.Get(Config.Type.Cfg_GeneralQuality);
            for (let i = minQuality + 1; i <= maxQuality; i++) {
                const cfgQuality: Cfg_GeneralQuality = indexerQ.getValueByKey(i);
                qualityUp *= cfgQuality.Coefficient / 10000;
            }
        }
        //
        const c = this.getTalent();
        // 最高技能数
        const cfgTitle: Cfg_GeneralTitle = Config.Get(Config.Type.Cfg_GeneralTitle).getValueByKey(msg.generalData.Title);
        const qcfg: Cfg_G_SkillQuality = Config.Get(Config.Type.Cfg_G_SkillQuality).getValueByKey(ESkillQuality.Top);
        const titleInc: number = cfgTitle.MaxTallentInc / 10000;
        const maxSkillRatio: number = cfgTitle.SkillMax * qcfg.AttrInc / 10000;

        // 攻防血都是与这3个系数进行运算的
        const coefficient1 = qualityUp * (1 + maxGradeUpRation);
        const coefficient2 = (msg.generalData.MaxGrow + maxEquipGrow) / 10000 * (1 + titleInc) - 1;
        const coefficient3 = 1 + maxSkillRatio + maxEquipLvUp;

        const hp = baseHp * coefficient1 + maxLevelUpCfg.H_Attr * (msg.generalData.MaxHpTalent / c[2] + coefficient2) * coefficient3;
        const atk = baseAtk * coefficient1 + maxLevelUpCfg.A_Attr * (msg.generalData.MaxAtkTalent / c[0] + coefficient2) * coefficient3;
        const def = baseDef * coefficient1 + maxLevelUpCfg.D_Attr * (msg.generalData.MaxDefTalent / c[1] + coefficient2) * coefficient3;

        const totalFv = hp * 2 + atk * 20 + def * 20 + maxEquipFv + maxGradeUpFv;

        // console.log('最高战力是：', totalFv, 'hp, atk, def, maxEquipFv, maxGradeUpFv =', hp, atk, def, maxEquipFv, maxGradeUpFv);

        return Math.ceil(totalFv);
    }

    /**
     * 获取 攻击防御血量的资质系数
     */
    private getTalent(): number[] {
        const atkRatio: Cfg_Config_General = this.cfgConfigGeneral.getValueByKey('AttackRatio');
        const defRatio: Cfg_Config_General = this.cfgConfigGeneral.getValueByKey('DefenseRatio');
        const hpRatio: Cfg_Config_General = this.cfgConfigGeneral.getValueByKey('HealthyRatio');
        return [+atkRatio.CfgValue, +defRatio.CfgValue, +hpRatio.CfgValue];
    }

    /**
    * 单个属性增长值
    * @param attr 当前等级对应的资质数值
    * @param talent 当前资质数值
    * @param index 属性索引 AttrIndex
    * @param grow 成长值
    * @param equipXS 装备套装的系数
    * @returns
    */
    public oneAttrIncr(attr: number, talent: number, index: AttrIndex, grow: number, equipXS: number): number {
        const c: number = this.getTalent()[index];
        let x = 1 + (talent / c - 1) + (grow / 10000 - 1);
        x = x <= 0 ? 1 : x;
        let f = Math.floor(attr * x);
        f *= equipXS;
        return Math.floor(f);
    }

    /** 配置 Cfg_General */
    private _cfgGeneral: ConfigIndexer;
    public get cfgGeneral(): ConfigIndexer {
        if (!this._cfgGeneral) {
            this._cfgGeneral = Config.Get(Config.Type.Cfg_General);
        }
        return this._cfgGeneral;
    }

    public clearAll(): void {
        //
    }

    public onRedDotEventListen(): void {
        // 未打开界面下的红点检测（会检测到有一处地方有红点就停止检测其他的）
        RedDotCheckMgr.I.on(RID.General.Id, this.checkMainRed, this);
        // UI打开的时候，走如下的几个监听
        RedDotCheckMgr.I.on(RID.General.Main.LevelUp, this.checkLevelUpRed, this);
        RedDotCheckMgr.I.on(RID.General.Main.Plan.General, this.checkPlanRed, this);
        RedDotCheckMgr.I.on(RID.General.Main.Plan.Beauty, this.checkPlanBeautyRed, this);
        RedDotCheckMgr.I.on(RID.General.Main.GradeUp, this.checkGradeUpRed, this);
        RedDotCheckMgr.I.on(RID.General.Main.Awaken, this.checkAwakenRed, this);
        RedDotCheckMgr.I.on(RID.General.Main.Gskin, this.checkSkinRed, this);
        RedDotCheckMgr.I.on(RID.General.Main.Equip, this.checkEquipRed, this);
        RedDotCheckMgr.I.on(RID.General.Main.Skill, this.checkSkillRed, this);
        RedDotCheckMgr.I.on(RID.General.Main.Compose, this.checkComposeRed, this);
    }

    public offRedDotEventListen(): void {
        // 未打开界面下的红点检测（会检测到有一处地方有红点就停止检测其他的）
        RedDotCheckMgr.I.off(RID.General.Id, this.checkMainRed, this);
        // UI打开的时候，走如下的几个监听
        RedDotCheckMgr.I.off(RID.General.Main.LevelUp, this.checkLevelUpRed, this);
        RedDotCheckMgr.I.off(RID.General.Main.Plan.General, this.checkPlanRed, this);
        RedDotCheckMgr.I.off(RID.General.Main.Plan.Beauty, this.checkPlanBeautyRed, this);
        RedDotCheckMgr.I.off(RID.General.Main.GradeUp, this.checkGradeUpRed, this);
        RedDotCheckMgr.I.off(RID.General.Main.Awaken, this.checkAwakenRed, this);
        RedDotCheckMgr.I.off(RID.General.Main.Gskin, this.checkSkinRed, this);
        RedDotCheckMgr.I.off(RID.General.Main.Equip, this.checkEquipRed, this);
        RedDotCheckMgr.I.off(RID.General.Main.Skill, this.checkSkillRed, this);
        RedDotCheckMgr.I.off(RID.General.Main.Compose, this.checkComposeRed, this);
    }

    public registerRedDotListen(): void {
        /** 布阵-武将 */
        const planInfo: IListenInfo = {
            ProtoId: [ProtoId.S2CAllGeneral_ID, ProtoId.S2CAddGeneral_ID, ProtoId.S2CDelGeneral_ID, ProtoId.S2CLineupInfo_ID, ProtoId.S2CChangeLineup_ID],
            // ItemSubType: [ItemType.GENERAL_ITEM],
            // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            CheckVid: [ViewConst.GeneralWin],
            // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走上面两个协议监听
            ProxyRid: [RID.General.Id],
        };
        /** 布阵-红颜 */
        const planBeautyInfo: IListenInfo = {
            ProtoId: [ProtoId.S2CLineupInfo_ID, ProtoId.S2CChangeLineup_ID, ProtoId.S2CBeautyInfo_ID, ProtoId.S2CBeautyActive_ID, ProtoId.S2CBeautyLevelUp_ID, ProtoId.S2CBeautyStarUp_ID, ProtoId.S2CBeautyLevelUpAuto_ID],
            // ItemSubType: [ItemType.BEAUTY],
            // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            CheckVid: [ViewConst.GeneralWin],
            // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走上面两个协议监听
            ProxyRid: [RID.General.Id],
        };
        const levelUpInfo: IListenInfo = {
            ProtoId: [ProtoId.S2CAllGeneral_ID, ProtoId.S2CAddGeneral_ID, ProtoId.S2CDelGeneral_ID, ProtoId.S2CLineupInfo_ID, ProtoId.S2CChangeLineup_ID, ProtoId.S2CGeneralLevelUp_ID],
            ItemSubType: [ItemType.GENERAL_ITEM],
            // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            CheckVid: [ViewConst.GeneralWin],
            // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走上面两个协议监听
            ProxyRid: [RID.General.Id],
        };
        const gradeUpInfo: IListenInfo = {
            ProtoId: [ProtoId.S2CAllGeneral_ID, ProtoId.S2CAddGeneral_ID, ProtoId.S2CDelGeneral_ID, ProtoId.S2CLineupInfo_ID, ProtoId.S2CChangeLineup_ID, ProtoId.S2CGeneralGradeUp_ID],
            ItemSubType: [ItemType.GENERAL_TYPE, ItemType.GENERAL_ITEM],
            // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            CheckVid: [ViewConst.GeneralWin],
            // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走上面两个协议监听
            ProxyRid: [RID.General.Id],
        };
        const AwakenInfo: IListenInfo = {
            ProtoId: [ProtoId.S2CAllGeneral_ID, ProtoId.S2CAddGeneral_ID, ProtoId.S2CDelGeneral_ID, ProtoId.S2CLineupInfo_ID, ProtoId.S2CChangeLineup_ID, ProtoId.S2CGeneralAwaken_ID],
            ItemSubType: [ItemType.GENERAL_ITEM],
            // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            CheckVid: [ViewConst.GeneralWin],
            // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走上面两个协议监听
            ProxyRid: [RID.General.Id],
        };
        const SkinInfo: IListenInfo = {
            ProtoId: [ProtoId.S2CAllGeneral_ID, ProtoId.S2CAddGeneral_ID, ProtoId.S2CDelGeneral_ID, ProtoId.S2CLineupInfo_ID, ProtoId.S2CChangeLineup_ID, ProtoId.S2CGeneralSkinUpdate_ID],
            ItemSubType: [ItemType.SKIN_GENERAL],
            // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            CheckVid: [ViewConst.GeneralWin],
            // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走上面两个协议监听
            ProxyRid: [RID.General.Id],
        };
        const ComposeInfo: IListenInfo = {
            ProtoId: [ProtoId.S2CAllGeneral_ID, ProtoId.S2CAddGeneral_ID, ProtoId.S2CDelGeneral_ID, ProtoId.S2CGeneralStick_ID],
            ItemSubType: [ItemType.GENERAL_ITEM],
            // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            CheckVid: [ViewConst.GeneralWin],
            // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走上面两个协议监听
            ProxyRid: [RID.General.Id],
        };
        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            { rid: RID.General.Main.Plan.General, info: planInfo },
            { rid: RID.General.Main.Plan.Beauty, info: planBeautyInfo },
            { rid: RID.General.Main.LevelUp, info: levelUpInfo },
            { rid: RID.General.Main.GradeUp, info: gradeUpInfo },
            { rid: RID.General.Main.Awaken, info: AwakenInfo },
            { rid: RID.General.Main.Gskin, info: SkinInfo },
            { rid: RID.General.Main.Compose, info: ComposeInfo },
        );
    }

    /** 检查是否有红点 */
    public checkMainRed(): boolean {
        if (!UtilFunOpen.isOpen(FuncId.General)) {
            return false;
        }
        const isRed: boolean = this.checkLevelUpRed()
            || this.checkPlanRed()
            || this.checkPlanBeautyRed()
            || this.checkGradeUpRed()
            || this.checkAwakenRed()
            || this.checkSkinRed()
            || this.checkEquipRed()
            || this.checkSkillRed()
            || this.checkComposeRed();

        return isRed;
    }

    /** 检查升级的红点 */
    public checkLevelUpRed(): boolean {
        let isRed: boolean = false;

        // 出战的武将未满级且有丹药
        const lineup: LineupUnit[] = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.General);
        if (lineup) {
            for (let i = 0; i < lineup.length; i++) {
                if (this.canLevelUp(this._generalData.get(lineup[i].OnlyId))) {
                    isRed = true;
                    break;
                }
            }
        }

        RedDotMgr.I.updateRedDot(RID.General.Main.LevelUp, isRed);

        return isRed;
    }

    public openGeneral(tabIndex: number = 0, subTabIndex: number = 0): boolean {
        if (UtilFunOpen.isOpen(FuncId.General, true)) {
            const list = this.getGeneralListByRarity(0);
            if (!list || list.length === 0) {
                MsgToastMgr.Show(i18n.tt(Lang.general_none));
                // const str = i18n.tt(Lang.general_open);
                // ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${str}</c>`, () => {
                //     // 正常是跳转的，暂没有可跳转的界面。先直接打开,版署版本先不跳
                //     // MsgToastMgr.Show(i18n.tt(Lang.general_none));
                //     // WinMgr.I.open(ViewConst.GeneralWin, tabIndex, subTabIndex);
                // });
            } else {
                WinMgr.I.open(ViewConst.GeneralWin, tabIndex, subTabIndex);
                return true;
            }
        }
        return false;
    }

    private _maxLevelUp: number = 0;
    private _maxLevelUpCfg: Cfg_GeneralLevelUp = null;
    /** 获取最高升级属性 */
    public getMaxLevelUpCfg(): Cfg_GeneralLevelUp {
        if (!this._maxLevelUpCfg) {
            this.createMaxLevel();
        }
        return this._maxLevelUpCfg;
    }

    public getMaxLevelUp(): number {
        if (!this._maxLevelUp) {
            this.createMaxLevel();
        }
        return this._maxLevelUp;
    }

    private createMaxLevel() {
        const indexer = Config.Get(Config.Type.Cfg_GeneralLevelUp);
        let level: number = 0;
        let bai: number = 0;
        let shi: number = 0;
        let ge: number = 0;
        // 思路是先找到百区间，再找到十区间，再找个区间
        let cfg: Cfg_GeneralLevelUp = null;
        do {
            bai += 100;
            cfg = indexer.getValueByKey(level + bai);
        } while (cfg);
        // console.log('最高等级数据不超过', bai);
        level = bai - 100;
        do {
            shi += 10;
            cfg = indexer.getValueByKey(level + shi);
        } while (cfg);
        // console.log('最高等级数据不超过', bai, shi);
        level = bai - 100 + shi - 10;
        do {
            ge++;
            cfg = indexer.getValueByKey(level + ge);
        } while (cfg);
        level = bai - 100 + shi - 10 + ge - 1;
        // console.log('最高等级是', level);

        this._maxLevelUp = level;
        this._maxLevelUpCfg = indexer.getValueByKey(this._maxLevelUp);
    }

    /** 获取武将装备升星最高值 */
    private _maxEquipStarUp: number = 0;
    private _maxEquipStarUpCfg: Cfg_Genera_EquipStarUp = null;
    /** 获取最高升级属性 */
    public getMaxEquipStarUpCfg(): Cfg_Genera_EquipStarUp {
        if (!this._maxEquipStarUpCfg) {
            this.createEquipStarUp();
        }
        return this._maxEquipStarUpCfg;
    }

    public getMaxEquipStarUp(): number {
        if (!this._maxEquipStarUp) {
            this.createEquipStarUp();
        }
        return this._maxEquipStarUp;
    }

    private createEquipStarUp() {
        const indexer = Config.Get(Config.Type.Cfg_Genera_EquipStarUp);
        let level: number = 0;
        let bai: number = 0;
        let shi: number = 0;
        let ge: number = 0;
        // 思路是先找到百区间，再找到十区间，再找个区间
        let cfg: Cfg_Genera_EquipStarUp = null;
        do {
            bai += 100;
            cfg = indexer.getValueByKey(level + bai, 5) as Cfg_Genera_EquipStarUp;
        } while (cfg);

        level = bai - 100;
        do {
            shi += 10;
            cfg = indexer.getValueByKey(level + shi, 5) as Cfg_Genera_EquipStarUp;
        } while (cfg);
        // console.log('最高等级数据不超过', bai, shi);
        level = bai - 100 + shi - 10;
        do {
            ge++;
            cfg = indexer.getValueByKey(level + ge, 5) as Cfg_Genera_EquipStarUp;
        } while (cfg);
        level = bai - 100 + shi - 10 + ge - 1;
        // console.log('最高等级是', level);

        this._maxEquipStarUp = level;
        this._maxEquipStarUpCfg = indexer.getValueByKey(this._maxEquipStarUp, 5) as Cfg_Genera_EquipStarUp;
    }

    /** 获取武将升阶最高值 */
    public getMaxGradeUpCfg(rarity: GeneralRarity): Cfg_GeneralGradeUp {
        const indexer = Config.Get(Config.Type.Cfg_GeneralGradeUp);
        let grade: number = 0;
        let bai: number = 0;
        let shi: number = 0;
        let ge: number = 0;
        // 思路是先找到百区间，再找到十区间，再找个区间
        let cfg: Cfg_GeneralGradeUp = null;
        do {
            bai += 100;
            cfg = indexer.getValueByKey(rarity, grade + bai) as Cfg_GeneralGradeUp;
        } while (cfg);

        grade = bai - 100;
        do {
            shi += 10;
            cfg = indexer.getValueByKey(rarity, grade + shi) as Cfg_GeneralGradeUp;
        } while (cfg);
        // console.log('最高等级数据不超过', bai, shi);
        grade = bai - 100 + shi - 10;
        do {
            ge++;
            cfg = indexer.getValueByKey(rarity, grade + ge) as Cfg_GeneralGradeUp;
        } while (cfg);
        grade = bai - 100 + shi - 10 + ge - 1;
        // console.log('最高等级是', grade);

        return indexer.getValueByKey(rarity, grade) as Cfg_GeneralGradeUp;
    }

    /** 升级是否已满 */
    public isNotFull(level: number): boolean {
        const cfg: Cfg_GeneralLevelUp = Config.Get(Config.Type.Cfg_GeneralLevelUp).getValueByKey(level + 1);
        return !!cfg;
    }

    /** 当前武将是否能升级：未满级并且拥有丹药 */
    public canLevelUp(d: GeneralMsg): boolean {
        if (!d) return false;
        const indexer = Config.Get(Config.Type.Cfg_GeneralLevelUp);
        const next: Cfg_GeneralLevelUp = indexer.getValueByKey(d.generalData.Level + 1);
        // 未满级
        if (next) {
            if (!this._cost || this._cost.length === 0) {
                this.initCostData();
            }
            for (let i = 0; i < this._cost.length; i++) {
                const have = BagMgr.I.getItemNum(this._cost[i].id);
                if (have > 0) {
                    const haveExp: number = have * this._cost[i].num;
                    const cur: Cfg_GeneralLevelUp = indexer.getValueByKey(d.generalData.Level);
                    const cost: number = cur.ExpMax;
                    if (haveExp + d.generalData.Exp >= cost) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /** 已出战并且未满级并且拥有丹药能升一级 */
    public checkCurLevelUp(msg: GeneralMsg): boolean {
        if (!msg) return false;

        const isRed: boolean = this.canLevelUp(msg);
        RedDotMgr.I.updateRedDot(RID.General.Cur.CurLvUp, isRed);

        return isRed;
    }

    /** 检查布阵的红点 */
    public checkPlanRed(): boolean {
        // 三个位置解锁情况
        const posLock: string[] = ModelMgr.I.PlanModel.checkGeneralPosLock();
        // 出战列表
        const lineup: LineupUnit[] = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.General);
        // 三个位置的出战情况
        const ids: string[] = ModelMgr.I.PlanModel.getPosOnly(lineup);

        let isRed: boolean = false;
        if (this._generalData) {
            for (const v of this._generalData.values()) {
                if (ModelMgr.I.PlanModel.isPlanRed(v, ids, posLock)) {
                    isRed = true;
                    break;
                }
            }
        }
        RedDotMgr.I.updateRedDot(RID.General.Main.Plan.General, isRed);
        return isRed;
    }

    public checkPlanBeautyRed(): boolean {
        const isRed = !ModelMgr.I.BeautyModel.isAreadyBattle && ModelMgr.I.BeautyModel.activeCount > 0;
        RedDotMgr.I.updateRedDot(RID.General.Main.Plan.Beauty, isRed);
        return isRed;
    }

    public set curOnlyId(id: string) {
        this._curOnlyId = id;
    }

    public get curOnlyId(): string {
        return this._curOnlyId;
    }

    public get curData(): GeneralMsg {
        return this._generalData.get(this._curOnlyId);
    }

    /** 获取玩家身上所有武将 */
    public get generalAllData(): Map<string, GeneralMsg> {
        for (const v of this._generalData.values()) {
            if (!v.cfg) {
                v.cfg = this.cfgGeneral.getValueByKey(v.generalData.IId);
            }
        }
        return this._generalData;
    }

    private _generalIds: string[] = [];
    public setGeneralIds(generalIds: GeneralMsg[]): void {
        if (generalIds) {
            this._generalIds = [];
            for (let i = 0; i < generalIds.length; i++) {
                this._generalIds.push(generalIds[i].generalData.OnlyId);
            }
        }
    }
    public getGeneralIds(): string[] {
        return this._generalIds;
    }
    public clearGeneralIds(): void {
        this._generalIds.length = 0;
    }

    public generalData(onlyId: string): GeneralMsg {
        const v = this._generalData.get(onlyId);
        if (v && !v.cfg) {
            v.cfg = this.cfgGeneral.getValueByKey(v.generalData.IId);
        }
        return v;
    }

    public getCfg(IId: number): Cfg_General {
        return this.cfgGeneral.getValueByKey(IId);
    }

    /** 获取动画（头像）资源 */
    public getGeneralRes(onlyId: string, isHead: boolean = false): string {
        const d: GeneralMsg = this.generalData(onlyId);
        return this.getGeneralResByData(d, isHead);
    }

    public getGeneralResByData(d: GeneralMsg, isHead: boolean = false): string {
        if (!d) {
            return '';
        }
        // 先判断是否使用了其它皮肤
        if (d.generalData.SkinId) {
            const indexer: ConfigGeneralSkinIndexer = Config.Get(Config.Type.Cfg_GeneralSkin);
            const skinCfg = indexer.getSkinData(d.generalData.SkinId);
            // 皮肤表里有数据
            if (skinCfg) {
                return `${skinCfg.AnimId}`;
            }
        }
        // 稀有度是名将，其头衔是456，否则头衔就是123
        if (!d.cfg) {
            d.cfg = this.cfgGeneral.getValueByKey(d.generalData.IId);
        }
        let title: number = d.generalData.Title;
        if (d.generalData.Title >= GeneralTitle.Title7) {
            title = d.generalData.Title - 6;
        } else if (d.generalData.Title >= GeneralTitle.Title4) {
            title = d.generalData.Title - 3;
        }
        if (title < 1) title = 1;
        if (isHead) {
            return d.cfg.RebornPetHeadIcon.split('|')[0]; // [title - 1]; //备注：和策划对了一下这里的只需要读第一个2022.11.1
        } else {
            return d.cfg.AnimId.split('|')[0]; // [title - 1]; //备注：和策划对了一下这里的只需要读第一个2022.11.1
        }
    }

    /** 获取武将id列表(不是自己且未培养过) */
    public getGeneralListbyIId(id: number, onlyId: string): GeneralMsg[] {
        const list: GeneralMsg[] = [];
        if (this._generalData) {
            this._generalData.forEach((v) => {
                if (v.generalData.IId === id) {
                    if (v.generalData.OnlyId !== onlyId && !this.hasDeveloped(v)) {
                        list.push(v);
                    }
                }
            });
        }
        return list;
    }

    /** 获取对应品质的武将列表(并且是品质未满的) */
    public getGeneralListByQuality(quality: GeneralQuality): GeneralMsg[] {
        const list: GeneralMsg[] = [];
        if (this._generalData) {
            this._generalData.forEach((v) => {
                if (quality === GeneralQuality.ALL || v.generalData.Quality === quality) {
                    // if (this.canQualityUp(v)) {
                    list.push(v);
                    // }
                }
            });
        }
        return list;
    }

    /** 获得一键选择的副武将列表：同品质；未上锁；未上阵；头衔低于名将 */
    public getGeneralListByOnekey(quality: GeneralQuality, withoutId: string): GeneralMsg[] {
        const list: GeneralMsg[] = [];
        if (this._generalData) {
            this._generalData.forEach((v) => {
                if (v.generalData.Quality === quality && !v.battlePos && !v.generalData.Lock && v.generalData.OnlyId !== withoutId) {
                    if (!v.cfg) {
                        v.cfg = this.cfgGeneral.getValueByKey(v.generalData.IId);
                    }
                    if (v.cfg.Rarity < GeneralRarity.Rarity5) {
                        list.push(v);
                    }
                }
            });
        }
        return list;
    }

    /** 获得对应稀有度的武将列表 */
    public getGeneralListByRarity(rarity: GeneralRarity, rarity2?: GeneralRarity): GeneralMsg[] {
        const list: GeneralMsg[] = [];
        if (this._generalData) {
            this._generalData.forEach((v) => {
                if (!v.cfg) {
                    v.cfg = this.cfgGeneral.getValueByKey(v.generalData.IId);
                }
                if (rarity === GeneralRarity.ALL) {
                    list.push(v);
                } else if (v.cfg.Rarity === rarity || (rarity2 && rarity2 === v.cfg.Rarity)) {
                    list.push(v);
                }
            });
        }
        return list;
    }
    /** 获得对应稀有度的武将列表排序 */
    public getGeneralListByRaritySort(rarity: GeneralRarity): GeneralMsg[] {
        const list: GeneralMsg[] = [];
        if (this._generalData) {
            this._generalData.forEach((v) => {
                if (!v.cfg) {
                    v.cfg = this.cfgGeneral.getValueByKey(v.generalData.IId);
                }
                if (rarity === GeneralRarity.ALL) {
                    list.push(v);
                } else if (v.cfg.Rarity === rarity) {
                    list.push(v);
                }
            });
        }

        list.sort((l, r) => {
            if (l.cfg.Quality !== r.cfg.Quality) {
                return r.cfg.Quality - l.cfg.Quality;
            }
            if (l.cfg.Id !== r.cfg.Id) {
                return r.cfg.Id - l.cfg.Id;
            }
            const l1 = Number(l.generalData.OnlyId.split('_')[0]);
            const r1 = Number(r.generalData.OnlyId.split('_')[0]);
            return r1 - l1;
        });
        return list;
    }

    /** 获得新版4个稀有度（1大将 2良将 3虎将 45名将）稀有度的武将列表 */
    public getGeneralListByNewRarity(index: number): GeneralMsg[] {
        if (index === 4 || index === 5) {
            return this.getGeneralListByRarity(4, 5);
        }
        return this.getGeneralListByRarity(index);
    }

    /** 信息界面的排序 */
    public sort(a: GeneralMsg, b: GeneralMsg): number {
        if (!a.cfg || !b.cfg) {
            const indexer = Config.Get(Config.Type.Cfg_General);
            a.cfg = indexer.getValueByKey(a.generalData.IId);
            b.cfg = indexer.getValueByKey(b.generalData.IId);
        }

        // 1.出战
        if (!a.battlePos && b.battlePos) {
            return 1;
        } else if (a.battlePos && !b.battlePos) {
            return -1;
        }

        // 2.稀有度
        if (a.cfg.Rarity !== b.cfg.Rarity) {
            return b.cfg.Rarity - a.cfg.Rarity;
        }

        // 3.头衔
        if (a.generalData.Title !== b.generalData.Title) {
            return b.generalData.Title - a.generalData.Title;
        }

        // 4.阶级
        if (a.generalData.Grade !== b.generalData.Grade) {
            return b.generalData.Grade - a.generalData.Grade;
        }

        // 5.品质
        if (a.cfg.Quality !== b.cfg.Quality) {
            return b.cfg.Quality - a.cfg.Quality;
        }

        // 6.等级
        if (a.generalData.Level !== b.generalData.Level) {
            return b.generalData.Level - a.generalData.Level;
        }
        return b.generalData.IId - a.generalData.IId;
    }

    /** 升品界面全部页签下的排序，相比sort多了可升品的排序,升品界面的其他页签下直接用sort来排序即可 */
    public qualityAllSort(a: GeneralMsg, b: GeneralMsg): number {
        if (!a.cfg || !b.cfg) {
            const indexer = Config.Get(Config.Type.Cfg_General);
            a.cfg = indexer.getValueByKey(a.generalData.IId);
            b.cfg = indexer.getValueByKey(b.generalData.IId);
        }

        // 1.出战
        if (!a.battlePos && b.battlePos) {
            return 1;
        } else if (a.battlePos && !b.battlePos) {
            return -1;
        }

        // 2.可升品
        if (!a.deputyEnough && b.deputyEnough) {
            return 1;
        } else if (a.deputyEnough && !b.deputyEnough) {
            return -1;
        }

        // 3.稀有度
        if (a.cfg.Rarity !== b.cfg.Rarity) {
            return b.cfg.Rarity - a.cfg.Rarity;
        }

        // 4.头衔
        if (a.generalData.Title !== b.generalData.Title) {
            return b.generalData.Title - a.generalData.Title;
        }

        // 5.阶级
        if (a.generalData.Grade !== b.generalData.Grade) {
            return b.generalData.Grade - a.generalData.Grade;
        }

        // 6.品质
        if (a.cfg.Quality !== b.cfg.Quality) {
            return b.cfg.Quality - a.cfg.Quality;
        }

        // 7.等级
        if (a.generalData.Level !== b.generalData.Level) {
            return b.generalData.Level - a.generalData.Level;
        }
        return b.generalData.IId - a.generalData.IId;
    }

    /** 选中主武将后的排序：主武将在最前，同品质副武将按 未出战-未上锁-稀有度低-头衔低-阶级低-品质低-等级低-id小 */
    public selectedSort(a: GeneralMsg, b: GeneralMsg): number {
        if (!a.cfg || !b.cfg) {
            const indexer = Config.Get(Config.Type.Cfg_General);
            a.cfg = indexer.getValueByKey(a.generalData.IId);
            b.cfg = indexer.getValueByKey(b.generalData.IId);
        }

        // 1.未出战
        if (!a.battlePos && b.battlePos) {
            return -1;
        } else if (a.battlePos && !b.battlePos) {
            return 1;
        }

        // 2.未锁
        if (!a.generalData.Lock && b.generalData.Lock) {
            return -1;
        } else if (a.generalData.Lock && !b.generalData.Lock) {
            return 1;
        }

        // 3.稀有度
        if (a.cfg.Rarity !== b.cfg.Rarity) {
            return a.cfg.Rarity - b.cfg.Rarity;
        }

        // 4.头衔
        if (a.generalData.Title !== b.generalData.Title) {
            return a.generalData.Title - b.generalData.Title;
        }

        // 5.阶级
        if (a.generalData.Grade !== b.generalData.Grade) {
            return a.generalData.Grade - b.generalData.Grade;
        }

        // 6.品质
        if (a.cfg.Quality !== b.cfg.Quality) {
            return a.cfg.Quality - b.cfg.Quality;
        }

        // 7.等级
        if (a.generalData.Level !== b.generalData.Level) {
            return a.generalData.Level - b.generalData.Level;
        }
        return a.generalData.IId - b.generalData.IId;
    }

    /** 升品里一键选择的副武将排序 */
    public onekeyDeputySort(a: GeneralMsg, b: GeneralMsg): number {
        if (!a.cfg || !b.cfg) {
            const indexer = Config.Get(Config.Type.Cfg_General);
            a.cfg = indexer.getValueByKey(a.generalData.IId);
            b.cfg = indexer.getValueByKey(b.generalData.IId);
        }

        // 3.稀有度
        if (a.cfg.Rarity !== b.cfg.Rarity) {
            return a.cfg.Rarity - b.cfg.Rarity;
        }

        // 4.头衔
        if (a.generalData.Title !== b.generalData.Title) {
            return a.generalData.Title - b.generalData.Title;
        }

        // 5.阶级
        if (a.generalData.Grade !== b.generalData.Grade) {
            return a.generalData.Grade - b.generalData.Grade;
        }

        // 6.品质
        if (a.cfg.Quality !== b.cfg.Quality) {
            return a.cfg.Quality - b.cfg.Quality;
        }

        // 7.等级
        if (a.generalData.Level !== b.generalData.Level) {
            return a.generalData.Level - b.generalData.Level;
        }
        return a.generalData.IId - b.generalData.IId;
    }

    /** 一键升品里的副将的排序 */
    public DeputySort(a: GeneralMsg, b: GeneralMsg): number {
        if (!a.cfg || !b.cfg) {
            const indexer = Config.Get(Config.Type.Cfg_General);
            a.cfg = indexer.getValueByKey(a.generalData.IId);
            b.cfg = indexer.getValueByKey(b.generalData.IId);
        }

        // 2.稀有度
        if (a.cfg.Rarity !== b.cfg.Rarity) {
            return b.cfg.Rarity - a.cfg.Rarity;
        }

        // 3.头衔
        if (a.generalData.Title !== b.generalData.Title) {
            return b.generalData.Title - a.generalData.Title;
        }

        // 4.阶级
        if (a.generalData.Grade !== b.generalData.Grade) {
            return b.generalData.Grade - a.generalData.Grade;
        }

        // 6.等级
        if (a.generalData.Level !== b.generalData.Level) {
            return b.generalData.Level - a.generalData.Level;
        }
        return b.generalData.IId - a.generalData.IId;
    }

    /** 获取该武将的最高品质 */
    public MaxQuality(rarity: number): GeneralQuality {
        const cfg: Cfg_GeneralRarity = Config.Get(Config.Type.Cfg_GeneralRarity).getValueByKey(rarity);
        if (cfg) {
            return cfg.MaxQuality;
        }
        return GeneralQuality.COLORFUL;
    }

    /** 是否可升品（当前品质还没达到最高品质） */
    public canQualityUp(data: GeneralMsg): boolean {
        if (!data) return false;
        if (!data.cfg) {
            data.cfg = this.cfgGeneral.getValueByKey(data.generalData.IId);
        }
        const maxQuality = this.MaxQuality(data.cfg.Rarity);
        return data.generalData.Quality < maxQuality;
    }

    /**
     * 是否已培养（如升级，升品, 升阶，觉醒， 装备， 战技（不需要了）， 神兵，战马)
     */
    public hasDeveloped(data: GeneralMsg): boolean {
        if (!data) return false;
        if (!data.cfg) {
            data.cfg = this.cfgGeneral.getValueByKey(data.generalData.IId);
        }
        const isDevelop: boolean = data.generalData.Level > 1 // 升级
            || data.generalData.Grade > 0 // 升阶
            || (data.generalData.AwakenItem && data.generalData.AwakenItem.length > 0) // 觉醒
            || data.generalData.Quality > data.cfg.Quality // 升品
            || (data.generalData.EquipData.WearEquips.length > 0 || data.generalData.EquipData.Level > 1 || data.generalData.EquipData.Star > 1); // 装备

        return isDevelop;
    }

    /** 是否能重生：1.已培养 2最低品质（不需要） */
    public canReborn(data: GeneralMsg): boolean {
        // const cfg: Cfg_Config_General = this.cfgConfigGeneral.getValueByKey('RebirthMinQuality');
        // return data.generalData.Quality >= +cfg.CfgValue && this.hasDeveloped(data);
        return this.hasDeveloped(data);
    }

    /** 是否能遣散：1 未培养 2稀有度不是5无双 */
    public canDisband(data: GeneralMsg): boolean {
        if (!data) return false;
        if (!data.cfg) {
            data.cfg = this.cfgGeneral.getValueByKey(data.generalData.IId);
        }
        const cfg: Cfg_Config_General = this.cfgConfigGeneral.getValueByKey('DismissRarityLimit');
        const raritys: string[] = cfg.CfgValue.split('|');
        return raritys.indexOf(`${data.cfg.Rarity}`) >= 0 && !this.hasDeveloped(data);
        // return data.cfg.Rarity < GeneralRarity.Rarity5 && !this.hasDeveloped(data);
    }

    /** 消耗武将都统一走这里的逻辑 */
    public costSelf(msg: GeneralMsg, index: number, conf: IBoxCfg, callback: (index: number) => void, context: any): boolean {
        if (!msg) return false;
        let needBox: boolean = false;
        // 上阵
        if (msg.battlePos > 0) {
            needBox = true;
            const str = i18n.tt(Lang.general_battle);
            ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${str}</c>`, () => {
                if (msg.generalData.Lock) {
                    ControllerMgr.I.GeneralController.reqLock(msg.generalData.OnlyId, 0);
                }
                if (msg.battlePos > 0) {
                    ControllerMgr.I.BattleUnitController.reqGeneralLineupPos(EntityUnitType.General, msg.battlePos, '');
                }
                callback.call(context, index);
            }, { showToggle: `${conf.showToggle}Battle`, tipTogState: !!conf.tipTogState });
        } else if (msg.generalData.Lock) {
            // 锁定
            needBox = true;
            const str = i18n.tt(Lang.general_lock);
            ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${str}</c>`, () => {
                if (msg.generalData.Lock) {
                    ControllerMgr.I.GeneralController.reqLock(msg.generalData.OnlyId, 0);
                }
                if (msg.battlePos > 0) {
                    ControllerMgr.I.BattleUnitController.reqGeneralLineupPos(EntityUnitType.General, msg.battlePos, '');
                }
                callback.call(context, index);
            }, { showToggle: `${conf.showToggle}Lock`, tipTogState: !!conf.tipTogState });
        } else {
            // 稀有度是名将
            if (!msg.cfg) {
                msg.cfg = this.cfgGeneral.getValueByKey(msg.generalData.IId);
            }
            // 是名将
            if (msg.cfg.Rarity >= GeneralRarity.Rarity5) {
                needBox = true;
                const str = i18n.tt(Lang.general_rarity);
                ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${str}</c>`, () => {
                    // 若是名将又已培养，不再弹培养的提示了
                    callback.call(context, index);
                }, { showToggle: `${conf.showToggle}Rarity`, tipTogState: !!conf.tipTogState });
            }
        }
        return needBox;
    }

    /** 是否可以成为副武将: 与主武将品质相同；未上锁；未上阵；头衔低于名将 */
    public isDeputy(d: GeneralData, mainQulity: GeneralQuality): boolean {
        const rarity: GeneralRarity = this.cfgGeneral.getValueByKey(d.IId, 'Rarity');
        return d.Quality === mainQulity && rarity < GeneralRarity.Rarity5;
    }

    /** 升品手续费 */
    public costMoney(quality: GeneralQuality): string[] {
        const cfg: Cfg_GeneralQuality = Config.Get(Config.Type.Cfg_GeneralQuality).getValueByKey(quality);
        if (cfg) {
            return cfg.Tax.split(':');
        }
        return ['', ''];
    }

    //--------------------------------------
    // 处理和协议相关的数据
    //--------------------------------------

    /** 修改出战单位后，更新武将列表数据 */
    public uptGeneralLineup(): void {
        if (this._generalData) {
            // 1. 先取下当前出战的武将列表
            const lineup: LineupUnit[] = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.General);
            // 2. 更新数据
            if (lineup) {
                this._generalData.forEach((v) => {
                    v.battlePos = 0;
                    for (let i = 0; i < lineup.length; i++) {
                        if (lineup[i].OnlyId === v.generalData.OnlyId) {
                            v.battlePos = lineup[i].Pos;
                            break;
                        }
                    }
                });
            }
        }
    }

    /** 武将信息列表数据 */
    public setAllGeneralData(d: S2CAllGeneral): void {
        if (d) {
            // 武将数据
            for (let i = 0; i < d.List.length; i++) {
                this._generalData.set(d.List[i].OnlyId, {
                    generalData: d.List[i],
                    battlePos: ModelMgr.I.BattleUnitModel.getBattleLineupPos(EntityUnitType.General, d.List[i].OnlyId),
                });
            }
            // 皮肤数据
            for (let i = 0; i < d.Skins.length; i++) {
                this._generalSkinData.set(d.Skins[i].SkinId, {
                    SkinId: d.Skins[i].SkinId,
                    SkinLv: d.Skins[i].SkinLv,
                });
            }
            // 装备数据
        }
    }

    /** 新增武将 */
    private _timeout: any;
    private _addList: IGetAwardsInfo[] = [];
    public addGeneralData(d: GeneralData): void {
        if (d) {
            this._generalData.set(d.OnlyId, { generalData: d });
            EventClient.I.emit(E.General.Add);
            //
            const msg: GeneralMsg = this._generalData.get(d.OnlyId);
            if (!msg.cfg) {
                msg.cfg = this.cfgGeneral.getValueByKey(d.IId);
            }
            const data: IGetAwardsInfo = {
                type: 0, // 0默认模板，展示获得物品。 1 三倍领取 2 限时三倍领取
                showName: msg.cfg.Name, // 道具名字
                quality: msg.generalData.Quality, // 道具质量
                animId: +this.getGeneralResByData(msg), // 动画id
                animType: ANIM_TYPE.PET,
                animScale: 0.85,
                animPosY: 0,
                animPosX: 0,
                generalRarity: msg.cfg.Rarity,
            };
            const index = this._addList.findIndex((v) => v.animId === data.animId && v.quality === data.quality);
            if (index < 0) {
                this._addList.push(data);
            }

            this._timeout = setTimeout(() => {
                for (let i = 0; i < this._addList.length; i++) {
                    WinMgr.I.open(ViewConst.GradeGetAwardsWin, this._addList[i]);
                }
                this._addList = [];
                if (this._timeout) {
                    clearTimeout(this._timeout);
                    this._timeout = null;
                }
            }, 100);
        }
    }

    /** 删一个武将 */
    public delGeneralData(d: string[]): void {
        if (d) {
            for (let i = 0; i < d.length; i++) {
                this._generalData.delete(d[i]);
            }
            EventClient.I.emit(E.General.Del);
        }
    }

    /** 修改锁定状态 */
    public changeLock(d: S2CGeneralLock): void {
        const data = this._generalData.get(d.OnlyId);
        if (data) {
            data.generalData.Lock = d.Lock;
            EventClient.I.emit(E.General.Lock);
        }
    }

    /** 升级 */
    public levelUp(d: S2CGeneralLevelUp): void {
        const data = this._generalData.get(d.OnlyId);
        if (data) {
            data.generalData.Exp = d.Exp;
            data.generalData.Level = d.Level;

            EventClient.I.emit(E.General.LevelUp);
        }
    }

    /** 升品后的更新 */
    public qualityUp(d: GeneralData): void {
        if (d) {
            const msg = this._generalData.get(d.OnlyId);
            if (msg) {
                msg.generalData = d;
                EventClient.I.emit(E.General.QualityUp, true);
                WinMgr.I.open(ViewConst.QualityUpSucess, 1, d);
            }
        }
    }

    /** 一键升品后的更新 */
    public qualityUpOnekey(list: GeneralData[]): void {
        for (let i = 0; i < list.length; i++) {
            const msg = this._generalData.get(list[i].OnlyId);
            if (msg) msg.generalData = list[i];
        }
        EventClient.I.emit(E.General.QualityUp, true);
    }

    /** 更新属性 */
    public refreshAttr(d: S2CGeneralUpdateAttr): void {
        if (d) {
            const msg = this._generalData.get(d.OnlyId);
            if (msg) {
                msg.generalData.Atk = d.Atk;
                msg.generalData.Def = d.Def;
                msg.generalData.Fv = d.Fv;
                msg.generalData.Hp = d.Hp;

                EventClient.I.emit(E.General.UptAttr);
            }
        }
    }

    /** 觉醒更新 */
    public refreshAwaken(d: S2CGeneralAwaken): void {
        if (d) {
            const msg = this._generalData.get(d.General.OnlyId);
            if (msg) {
                const preMsg = {
                    AtkTalent: msg.generalData.AtkTalent,
                    DefTalent: msg.generalData.DefTalent,
                    HpTalent: msg.generalData.HpTalent,
                    MaxAtkTalent: msg.generalData.MaxAtkTalent,
                    MaxDefTalent: msg.generalData.MaxDefTalent,
                    MaxHpTalent: msg.generalData.MaxHpTalent,
                    Grow: msg.generalData.Grow,
                    MaxGrow: msg.generalData.MaxGrow,
                    Title: msg.generalData.Title,
                };
                msg.generalData = d.General;

                EventClient.I.emit(E.General.UptAwaken, preMsg);

                if (preMsg.Title !== msg.generalData.Title) {
                    EventClient.I.emit(E.General.UptTitle, d.General);
                    WinMgr.I.open(ViewConst.QualityUpSucess, 2, d.General, preMsg);
                }
            }
        }
    }

    /** 升阶更新 */
    public refreshGradeUp(d: S2CGeneralGradeUp): void {
        if (d) {
            const msg = this._generalData.get(d.OnlyId);
            if (msg) {
                msg.generalData.Grade = d.GradeLv;
                if (d.Skill) {
                    const index = msg.generalData.Skills.findIndex((v) => v.SkillId === d.Skill.SkillId);
                    if (index >= 0) {
                        msg.generalData.Skills[index] = d.Skill;
                    }
                }
                EventClient.I.emit(E.General.UptGradeUp);
            }
        }
    }

    /** 皮肤升星数据更新 */
    public refreshSkin(d: S2CGeneralSkinUpdate): void {
        if (d) {
            const msg = this._generalSkinData.get(d.SkinId);
            if (msg) {
                msg.SkinLv = d.SkinLv;
            } else {
                this._generalSkinData.set(d.SkinId, d);

                const indexer: ConfigGeneralSkinIndexer = Config.Get(Config.Type.Cfg_GeneralSkin);
                const skinCfg = indexer.getSkinData(d.SkinId);
                // 皮肤表里有数据
                if (skinCfg) {
                    const gData: Cfg_General = this.cfgGeneral.getValueByKey(skinCfg.GeneralId);

                    const data: IGetAwardsInfo = {
                        type: 0, // 0默认模板，展示获得物品。 1 三倍领取 2 限时三倍领取
                        showName: skinCfg.Name, // 道具名字
                        quality: gData.Quality, // 道具质量
                        animId: skinCfg.AnimId, // 动画id
                        animType: ANIM_TYPE.PET,
                        animScale: 0.85,
                        animPosY: 0,
                        generalRarity: gData.Rarity,
                    };
                    WinMgr.I.open(ViewConst.GradeGetAwardsWin, data);
                }
            }
            EventClient.I.emit(E.General.UptGskin);
        }
    }

    /** 武将皮肤穿戴 */
    public refreshWearSkin(d: S2CGeneralWearSkin): void {
        if (d) {
            const msg = this._generalData.get(d.OnlyId);
            if (msg) {
                msg.generalData.SkinId = d.SkinId;
                EventClient.I.emit(E.General.GskinWear);
            }
        }
    }

    /** 升阶-最大阶数 */
    public getMaxGradeUp(rarity: number): number {
        let grade: number = 1;

        const indexer = Config.Get(Config.Type.Cfg_GeneralGradeUp);
        let cfg: Cfg_GeneralGradeUp = indexer.getValueByKey(rarity, grade);
        while (cfg) {
            grade++;
            cfg = indexer.getValueByKey(rarity, grade);
        }
        return grade - 1;
    }

    /** 获取下个天赋技能等级数据 */
    public getNextTalentSkill(msg: GeneralMsg): { isFull: boolean, cfg: Cfg_GeneralGradeUp } {
        if (!msg) return null;
        if (!msg.cfg) {
            msg.cfg = Config.Get(Config.Type.Cfg_General).getValueByKey(msg.generalData.IId);
        }
        const indexer = Config.Get(Config.Type.Cfg_GeneralGradeUp);
        const curGrade: number = msg.generalData.Grade || 1;
        const cfgCur: Cfg_GeneralGradeUp = indexer.getValueByKey(msg.cfg.Rarity, curGrade);
        const curSkillLv = cfgCur.TallentSkillLv;
        let nextSkillLv = curSkillLv;
        let grade: number = cfgCur.Grade;
        let cfgNext: Cfg_GeneralGradeUp = indexer.getValueByKey(msg.cfg.Rarity, curGrade + 1);
        while (cfgNext) {
            grade++;
            cfgNext = indexer.getValueByKey(msg.cfg.Rarity, grade);
            if (!cfgNext) {
                break;
            }
            if (cfgNext && cfgNext.TallentSkillLv > curSkillLv) {
                nextSkillLv = cfgNext.TallentSkillLv;
                break;
            }
        }
        return { isFull: nextSkillLv === curSkillLv, cfg: cfgNext };
    }

    /** 升阶-是否已满 */
    public isGradeUpMax(rarity: number, grade: number): boolean {
        const indexer = Config.Get(Config.Type.Cfg_GeneralGradeUp);
        const cfgNext: Cfg_GeneralGradeUp = indexer.getValueByKey(rarity, grade + 1);
        return !cfgNext;
        // return grade >= this.getMaxGradeUp(rarity);
    }

    /** 升阶红点判断 */
    public checkGradeUpRed(): boolean {
        let isRed: boolean = false;

        // 出战的武将未满级且有丹药
        const lineup: LineupUnit[] = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.General);
        if (lineup && lineup.length > 0) {
            for (let i = 0; i < lineup.length; i++) {
                const canUp = this.canGradeUp(lineup[i].OnlyId);
                if (canUp) {
                    isRed = true;
                    break;
                }
            }
        }

        RedDotMgr.I.updateRedDot(RID.General.Main.GradeUp, isRed);

        return isRed;
    }

    public checkCurGradeUpRed(msg: GeneralMsg): boolean {
        if (!msg) return false;
        const isRed: boolean = this.canGradeUp(msg.generalData.OnlyId);
        RedDotMgr.I.updateRedDot(RID.General.Cur.CurGradeUp, isRed);
        return isRed;
    }

    /** 是否能升阶 */
    public canGradeUp(onlyId: string, showTips: boolean = false, getSource: boolean = false): boolean {
        const msg: GeneralMsg = this._generalData.get(onlyId);
        if (!msg) return false;
        if (!msg.cfg) {
            msg.cfg = this.cfgGeneral.getValueByKey(msg.generalData.IId);
        }
        if (!msg.cfg) return false;
        const indexer = Config.Get(Config.Type.Cfg_GeneralGradeUp);
        const cfg: Cfg_GeneralGradeUp = indexer.getValueByKey(msg.cfg.Rarity, msg.generalData.Grade);
        // 判断是否已满阶
        const cfgNext: Cfg_GeneralGradeUp = indexer.getValueByKey(msg.cfg.Rarity, msg.generalData.Grade + 1);
        if (!cfgNext) {
            return false;
        }
        let canUp: boolean = false;
        if (cfg) {
            // 1. 消耗材料足够
            let itemRed: boolean = true;
            if (cfg.ItemCost) {
                const itemCost = cfg.ItemCost.split('|');
                for (let j = 0; j < itemCost.length; j++) {
                    const item = itemCost[j].split(':');
                    const id = +item[0];
                    const need = +item[1];
                    const have = BagMgr.I.getItemNum(id);
                    if (have < need) {
                        itemRed = false;
                        if (getSource) {
                            WinMgr.I.open(ViewConst.ItemSourceWin, id);
                        }
                        break;
                    }
                }
            }
            // 2.消耗的副武将是否足够
            if (itemRed) {
                const costNum: number = cfg.CostNum;
                const gList: GeneralMsg[] = this.getGeneralListbyIId(msg.generalData.IId, msg.generalData.OnlyId);
                canUp = gList.length >= costNum;
                if (showTips && !canUp) {
                    //
                }
            }
        }
        return canUp;
    }

    /** 觉醒红点判断 */
    public checkAwakenRed(): boolean {
        let isRed: boolean = false;

        // 出战的武将里有可觉醒的
        const lineup: LineupUnit[] = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.General);
        if (lineup && lineup.length > 0) {
            for (let i = 0; i < lineup.length; i++) {
                const canUp = this.canAwaken(lineup[i].OnlyId);
                if (canUp) {
                    isRed = true;
                    break;
                }
            }
        }

        RedDotMgr.I.updateRedDot(RID.General.Main.Awaken, isRed);

        return isRed;
    }

    /** 当前武将觉醒红点判断 */
    public checkCurAwakenRed(msg: GeneralMsg): boolean {
        if (!msg) return false;
        const isRed: boolean = this.canAwaken(msg.generalData.OnlyId);
        RedDotMgr.I.updateRedDot(RID.General.Cur.CurAwaken, isRed);
        return isRed;
    }

    /** 觉醒是否已满 */
    public isAwakenMax(msg: GeneralMsg): boolean {
        if (!msg) return false;
        return msg.generalData.AtkTalent >= msg.generalData.MaxAtkTalent
            && msg.generalData.DefTalent >= msg.generalData.MaxDefTalent
            && msg.generalData.HpTalent >= msg.generalData.MaxHpTalent
            && msg.generalData.Grow >= msg.generalData.MaxGrow
            && (msg.generalData.Title === GeneralTitle.Title3 || msg.generalData.Title === GeneralTitle.Title6 || msg.generalData.Title === GeneralTitle.Title9);
    }

    /** 是否能觉醒 */
    public canAwaken(onlyId: string): boolean {
        const msg: GeneralMsg = this._generalData.get(onlyId);
        if (!msg) return false;
        if (!msg.cfg) {
            msg.cfg = this.cfgGeneral.getValueByKey(msg.generalData.IId);
        }
        if (!msg.cfg) return false;
        if (this.isAwakenMax(msg)) return false;
        const cfg: Cfg_GeneralRarity = Config.Get(Config.Type.Cfg_GeneralRarity).getValueByKey(msg.cfg.Rarity);
        if (cfg) {
            if (cfg.AwakenCost) {
                const cost = cfg.AwakenCost.split(':');
                const need: number = +cost[1];
                const have: number = BagMgr.I.getItemNum(+cost[0]);
                if (have >= need) {
                    return true;
                }
            }
            const superCost: string = cfg.AwakenSuperCost;
            if (superCost) {
                const scost = superCost.split(':');
                const need: number = +scost[1];
                const have: number = BagMgr.I.getItemNum(+scost[0]);
                if (have >= need) {
                    return true;
                }
            }
        }
        return false;
    }

    /** 皮肤红点判断 */
    public checkSkinRed(): boolean {
        let isRed: boolean = false;

        // 所有武将列表里有一个武将有皮肤红点，其父级就会有红点了（infoPanel里的generalHead也会有）
        for (const v of this._generalData.values()) {
            if (this.isCurSkinRed(v)) {
                isRed = true;
                break;
            }
        }

        RedDotMgr.I.updateRedDot(RID.General.Main.Gskin, isRed);

        return isRed;
    }

    /** 只检查当前选中的武将的皮肤红点 */
    public checkCurSkinRed(msg: GeneralMsg): boolean {
        if (!msg) return false;
        const isRed: boolean = this.isCurSkinRed(msg);
        RedDotMgr.I.updateRedDot(RID.General.Cur.CurSkin, isRed);
        return isRed;
    }

    public isCurSkinRed(msg: GeneralMsg): boolean {
        if (!msg) return false;
        let isRed: boolean = false;
        const indexer: ConfigGeneralSkinIndexer = Config.Get(Config.Type.Cfg_GeneralSkin);
        const data: number[] = indexer.getGeneralSkinIds(msg.generalData.IId);
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const state: GSkinState = this.getSkinState(msg.generalData.OnlyId, data[i]);
                if (state === GSkinState.CanActive || state === GSkinState.CanUpStar) {
                    isRed = true;
                    break;
                }
            }
        }

        return isRed;
    }

    /** 该皮肤是否已激活:若是觉醒皮肤（无双皮肤）即不会在_generalSkinData里，只需要判断该皮肤id在皮肤表里并且其武将的头衔是6 */
    public isSkinActive(onlyId: string, skinId: number): boolean {
        const indexer: ConfigGeneralSkinIndexer = Config.Get(Config.Type.Cfg_GeneralSkin);
        const skinCfg = indexer.getSkinData(skinId);
        // 皮肤表里有数据
        if (skinCfg) {
            if (skinCfg.IsTitle) {
                const gData = this._generalData.get(onlyId);
                if (gData && gData.generalData && gData.generalData.Title === GeneralTitle.Title6) {
                    return true;
                }
            } else {
                const msg = this._generalSkinData.get(skinId);
                return !!msg;
            }
        }
        return false;
    }

    /** 武将皮肤星级 */
    public getSkinStar(skinId: number): number {
        const msg = this._generalSkinData.get(skinId);
        if (msg) {
            return msg.SkinLv;
        }
        return 0;
    }

    /** 是否已穿戴 */
    public isWear(onlyId: string, skinId: number): boolean {
        const msg: GeneralMsg = this._generalData.get(onlyId);
        if (msg) {
            return msg.generalData.SkinId === skinId;
        }
        return false;
    }

    public getSkinState(onlyId: string, skinId: number): GSkinState {
        // 是否已激活
        const indexer: ConfigGeneralSkinIndexer = Config.Get(Config.Type.Cfg_GeneralSkin);
        const skinCfg = indexer.getSkinData(skinId);
        const isActive = this.isSkinActive(onlyId, skinId);
        if (!isActive) {
            // 未激活又分为是否可激活
            if (BagMgr.I.getItemNum(skinCfg.NeedItem) > 0) {
                return GSkinState.CanActive;
            }
            return GSkinState.UnActive;
        }
        // 觉醒皮肤是否已满
        if (skinCfg.IsTitle && isActive) {
            return GSkinState.MaxStar;
        }
        // 其它皮肤是否已满
        const star = this.getSkinStar(skinId);
        const d: Cfg_GeneralSkinStar = Config.Get(Config.Type.Cfg_GeneralSkinStar).getIntervalData(star + 1);
        if (!d) {
            return GSkinState.MaxStar;
        }

        // const cur: Cfg_GeneralSkinStar = Config.Get(Config.Type.Cfg_GeneralSkinStar).getIntervalData(star);
        // if (cur) {
        if (BagMgr.I.getItemNum(skinCfg.NeedItem) >= d.LevelUpItem) {
            return GSkinState.CanUpStar;
        }
        // }
        return GSkinState.CannotUpStar;
    }
    /** --------------------------武将装备----------------------- */
    public refreshEquipWear(d: S2CGeneralEquipWear): void {
        if (d) {
            const msg = this._generalData.get(d.OnlyId);
            if (msg) {
                msg.generalData.EquipData = d.EquipData;
                EventClient.I.emit(E.General.GEquipWear);
            }
        }
    }
    public refreshEquipStarUp(d: S2CGeneralEquipStarUp): void {
        if (d) {
            const msg = this._generalData.get(d.OnlyId);
            if (msg) {
                msg.generalData.EquipData = d.EquipData;
                msg.generalData.MaxGrow = d.MaxGrow;
                msg.generalData.Grow = d.Grow;
                EventClient.I.emit(E.General.GEquipStarUp);
            }
        }
    }
    /** 获取某部位的装备 */
    public getEquipCfgByPos(msg: GeneralMsg, part: number): GEquipMsg {
        if (msg) {
            const ids: number[] = msg.generalData.EquipData.WearEquips;
            const indexer: ConfigGeneralEquipIndexer = Config.Get(Config.Type.Cfg_Genera_Equip);
            for (let i = 0; i < ids.length; i++) {
                const data: Cfg_Genera_Equip = indexer.getEquipData(ids[i], msg.generalData.EquipData.Level, msg.generalData.EquipData.Star); // indexer.getValueByKey(ids[i]);
                if (data && data.Part === part) {
                    return { isEquiped: true, cfg: data, onlyId: msg.generalData.OnlyId };
                }
            }
            // 身上没有该位置的装备,取 Part_Level_Star 的一个数据
            const cfg = indexer.getEquipData(part, msg.generalData.EquipData.Level || 1, msg.generalData.EquipData.Star || 1);
            return { isEquiped: false, cfg, onlyId: msg.generalData.OnlyId };
        }

        return null;
    }
    /** 根据ID 获取武将信息 */
    public getGeneralCfgById(gid: number): Cfg_General {
        const cfg: Cfg_General = Config.Get(Config.Type.Cfg_General).getValueByKey(gid);
        return cfg;
    }

    /** 下一个阶和星级 */
    public getNextLvStar(level: number, star: number): { level: number, star: number } {
        if (star < 5) {
            return { level, star: star + 1 };
        }
        return { level: level + 1, star: 1 };
    }

    /** 武将装备是否穿了4件 */
    public isWearAll(msg: GeneralMsg): boolean {
        if (msg) {
            return msg.generalData.EquipData.WearEquips.length >= 4;
        }
        return false;
    }

    /** 是否可装备 */
    public canWearEquip(msg: GeneralMsg, part: number): boolean {
        if (!msg) return false;
        let isRed: boolean = false;
        const data: GEquipMsg = this.getEquipCfgByPos(msg, part);
        if (!data.isEquiped) {
            const cost = data.cfg.Cost.split(':');
            const id: number = +cost[0];
            const need: number = +cost[1];
            const have: number = BagMgr.I.getItemNum(id);
            isRed = have >= need;
        }
        return isRed;
    }

    /**
     * 一键装备，有一个能装备的就返回;若都没有就返回消耗的对象列表
     */
    public canOnekeyWear(msg: GeneralMsg): { canUp: boolean, cost: { id: number, need: number }[] } {
        const costList: { id: number, need: number }[] = [];
        for (let i = 0; i < 4; i++) {
            const data: GEquipMsg = this.getEquipCfgByPos(msg, i + 1);
            if (!data.isEquiped) {
                const cost = data.cfg.Cost.split(':');
                const id: number = +cost[0];
                const need: number = +cost[1];
                const have: number = BagMgr.I.getItemNum(id);
                if (have >= need) {
                    return { canUp: true, cost: [] };
                } else {
                    const index = costList.findIndex((v) => v.id === id);
                    if (index >= 0) {
                        costList[index].need += need;
                    } else {
                        costList.push({ id, need });
                    }
                }
            }
        }
        return { canUp: false, cost: costList };
    }

    /** 是否能穿 */
    public canWear(msg: GeneralMsg): boolean {
        for (let i = 0; i < 4; i++) {
            if (this.canWearEquip(msg, i + 1)) {
                return true;
            }
        }
        return false;
    }

    /** 当前选中的武将四个位置是否有可装备 */
    public checkCurEquipWearRed(msg: GeneralMsg): boolean {
        let isRed: boolean = false;
        for (let i = 0; i < 4; i++) {
            if (this.canWearEquip(msg, i + 1)) {
                isRed = true;
                break;
            }
        }
        RedDotMgr.I.updateRedDot(RID.General.Cur.CurEquip.CurWear, isRed);
        return isRed;
    }

    /** 当前选中的武将是否可升星 */
    public checkCurEquipStarUpRed(msg: GeneralMsg): { isRed: boolean, condition: string } {
        const d = this.canEquipStarUp(msg);
        RedDotMgr.I.updateRedDot(RID.General.Cur.CurEquip.CurStarUp, d.isRed);
        return d;
    }

    /** 装备升星的限制条件 */
    public conditionInfo(conf: Cfg_Genera_EquipStarUp): { state: boolean, info: Cfg_LimitCondition, desc: string } {
        if (conf && conf.LimitId) {
            const indexer: ConfigLimitConditionIndexer = Config.Get(ConfigConst.Cfg_LimitCondition);
            return indexer.getCondition(conf.LimitId);
        }
        return { state: true, info: null, desc: '' };
    }

    /** 装备红点判断 */
    public checkEquipRed(): boolean {
        let isRed: boolean = false;

        // 出战的武将里有可装备 或 可升星
        const lineup: LineupUnit[] = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.General);
        if (lineup && lineup.length > 0) {
            for (let i = 0; i < lineup.length; i++) {
                const msg: GeneralMsg = this._generalData.get(lineup[i].OnlyId);

                // 先判断是否有可升星
                if (this.canEquipStarUp(msg).isRed) {
                    isRed = true;
                    break;
                }
                // 没有再判断是否有可装备的
                if (!isRed) {
                    for (let i = 0; i < 4; i++) {
                        if (this.canWearEquip(msg, i + 1)) {
                            isRed = true;
                            break;
                        }
                    }
                }

                if (isRed) {
                    break;
                }
            }
        }

        RedDotMgr.I.updateRedDot(RID.General.Main.Equip, isRed);

        return isRed;
    }

    /**
     * 当前选中的武将是否可升星
     * @param msg GeneralMsg
     * @param showTips 是否飘字
     * @param getSource 是否显示获取途径
     */
    public canEquipStarUp(msg: GeneralMsg, showTips: boolean = false, getSource: boolean = false): { isRed: boolean, condition: string } {
        let isRed: boolean = false;
        // 1. 是否都已装备
        if (msg && msg.generalData && msg.generalData.EquipData.WearEquips.length >= 4) {
            const cfg: ConfigIndexer = Config.Get(Config.Type.Cfg_Genera_EquipStarUp);
            const curLv = msg.generalData.EquipData.Level;
            const curStar = msg.generalData.EquipData.Star;
            const curCfg: Cfg_Genera_EquipStarUp = cfg.getValueByKey(curLv, curStar);

            // 2. 判断限制条件
            const condition = this.conditionInfo(curCfg);
            if (!condition.state) {
                if (showTips) {
                    MsgToastMgr.Show(condition.desc);
                }
                return { isRed, condition: condition.desc };
            }

            // 3. 判断消耗是否满足
            // 3-1. 消耗材料足够
            let itemRed: boolean = true;
            if (curCfg.Cost) {
                const itemCost = curCfg.Cost.split('|');
                for (let j = 0; j < itemCost.length; j++) {
                    const item = itemCost[j].split(':');
                    const id = +item[0];
                    const need = +item[1];
                    const have = BagMgr.I.getItemNum(id);
                    if (have < need) {
                        itemRed = false;
                        if (getSource) {
                            WinMgr.I.open(ViewConst.ItemSourceWin, id);
                        }
                        break;
                    }
                }
            } else {
                itemRed = false;
            }

            // 3-2.消耗的副武将是否足够
            if (itemRed) {
                const costNum: number = curCfg.CostMyself;
                const gList: GeneralMsg[] = this.getGeneralListbyIId(msg.generalData.IId, msg.generalData.OnlyId);
                if (gList.length < costNum && showTips) {
                    MsgToastMgr.Show(i18n.tt(Lang.general_equip_noself));
                }
                isRed = gList.length >= costNum;
            }
        } else if (showTips) {
            MsgToastMgr.Show(i18n.tt(Lang.general_equip_up));
        }
        return { isRed, condition: '' };
    }

    /** 技能学习 */
    public refreshSkillStudy(d: S2CGeneralStudySkill): void {
        if (d) {
            const msg = this._generalData.get(d.OnlyId);
            if (msg) {
                msg.generalData.Skills = d.Skills;
                EventClient.I.emit(E.General.GSkillStudy, d.SkillId);
            }
        }
    }

    /** 激活了觉醒技能 */
    public refreshSkillAwaken(d: S2CGeneralAwakenSkill): void {
        if (d) {
            const msg = this._generalData.get(d.OnlyId);
            if (msg) {
                msg.generalData.Skills = d.Skills;

                const awakeSkill = this.getSkillByType(d.Skills, EGeneralSkillType.SkillAwaken);
                if (awakeSkill && awakeSkill[0]) {
                    WinMgr.I.open(ViewConst.ActiveSkillTip, awakeSkill[0].SkillId);
                }

                EventClient.I.emit(E.General.GSkillAwaken);
            }
        }
    }

    /** 技能锁定 */
    public refreshSkillLock(d: S2CGeneralSkillLock): void {
        if (d) {
            const msg = this._generalData.get(d.OnlyId);
            if (msg) {
                const index = msg.generalData.Skills.findIndex((v) => v.SkillId === d.Skill.SkillId);
                if (index >= 0) {
                    msg.generalData.Skills[index] = d.Skill;
                }
                EventClient.I.emit(E.General.GSkillLock, d.Skill);
            }
        }
    }
    /** 根据类型获取武将身上的技能 */
    public getSkillByType(skills: GeneralSkill[], type: EGeneralSkillType): GeneralSkill[] {
        const skill: GeneralSkill[] = [];
        if (skills) {
            for (let i = 0; i < skills.length; i++) {
                if (skills[i].SkillType === type) {
                    skill.push(skills[i]);
                }
            }
        }
        return skill;
    }
    /** 获取武将身上的技能 */
    public getSkillById(skills: GeneralSkill[], skillId: number): GeneralSkill {
        if (skills) {
            for (let i = 0; i < skills.length; i++) {
                if (skills[i].SkillId === skillId) {
                    return skills[i];
                }
            }
        }
        return null;
    }
    /**
     * 觉醒技能的状态
     * @param msg
     * @param skillId 需是觉醒技能，这里不做检测
     * @returns
     */
    public getAwakenSkillState(msg: GeneralMsg, skillId: number): ESkillState {
        let skillState: ESkillState = ESkillState.UnActive;
        if (msg) {
            const skillData: GeneralSkill = this.getSkillById(msg.generalData.Skills, skillId);
            if (skillData) {
                skillState = ESkillState.Actived;
            } else {
                // 该武将头衔是否已达到无双
                skillState = msg.generalData.Title === GeneralTitle.Title6 ? ESkillState.CanActive : ESkillState.UnActive;
            }
        }

        return skillState;
    }
    /** 获取技能类型名称 */
    public getSkillTypeName(type: EGeneralSkillType): string {
        const cfg: Cfg_Config_General = this.cfgConfigGeneral.getValueByKey('GeneralSkillTypeName');
        const names: string[] = cfg.CfgValue.split(':');
        return names[type - 1] || i18n.tt(Lang[`general_skill_${type}`]);
    }

    /** 获取技能类型名称 */
    public openSource(): void {
        const cfg: Cfg_Config_General = this.cfgConfigGeneral.getValueByKey('GeneralSkillGetWay');
        WinMgr.I.open(ViewConst.ItemSourceWin, +cfg.CfgValue);
    }

    /** 武将重生消耗 */
    public getRebornCost(): { id: number, need: number } {
        const cfg: Cfg_Config_General = this.cfgConfigGeneral.getValueByKey('RebirthDeplete');
        const cost: string[] = cfg.CfgValue.split(':');
        return { id: +cost[0], need: +cost[1] };
    }

    /** 武将遣散消耗 */
    public getDisbandCost(): { id: number, need: number } {
        const cfg: Cfg_Config_General = this.cfgConfigGeneral.getValueByKey('DismissDeplete');
        const cost: string[] = cfg.CfgValue.split(':');
        return { id: +cost[0], need: +cost[1] };
    }

    /** 当前武将技能是否有红点 */
    public canSkillUp(msg: GeneralMsg): boolean {
        if (!msg) return false;
        if (!msg.cfg) {
            msg.cfg = this.cfgGeneral.getValueByKey(msg.generalData.IId);
        }
        const awakenSkill: number = +msg.cfg.AwakenSkillID;
        if (awakenSkill) {
            const state = this.getAwakenSkillState(msg, awakenSkill);
            if (state === ESkillState.CanActive) {
                return true;
            }
        }
        return false;
    }

    /** 技能红点判断：武将列表里只要有任何一个武将 1.有觉醒技能 2.武将头衔达到无双 3.该觉醒技能还没激活 */
    public checkSkillRed(): boolean {
        let isRed: boolean = false;
        if (this._generalData) {
            for (const v of this._generalData.values()) {
                if (this.canSkillUp(v)) {
                    isRed = true;
                    break;
                }
            }
        }
        RedDotMgr.I.updateRedDot(RID.General.Main.Skill, isRed);
        return isRed;
    }

    /** 重生后的更新 */
    public uptReborn(d: GeneralData): void {
        if (d) {
            const msg = this._generalData.get(d.OnlyId);
            if (msg) {
                msg.generalData = d;
                EventClient.I.emit(E.General.GReborn);
            }
        }
    }

    /** 合成的红点 */
    public checkComposeRed(): boolean {
        let isRed: boolean = false;
        const rList = [4, 3, 2, 1];
        for (let i = 0; i < rList.length; i++) {
            if (this.checkComposeTagRed(rList[i])) {
                isRed = true;
                break;
            }
        }
        RedDotMgr.I.updateRedDot(RID.General.Main.Compose, isRed);
        return isRed;
    }

    /** 某个稀有度页签下是否有可合成的武将 */
    public checkComposeTagRed(rarity: GeneralRarity): boolean {
        let isRed: boolean = false;
        const books = UtilGeneral.GetCompose(0, rarity);
        for (let i = 0; i < books.length; i++) {
            const cost = books[i].cfg.StickCost.split(':');
            const id = +cost[0];
            const need = +cost[1];
            const have = BagMgr.I.getItemNum(id);
            if (have >= need) {
                isRed = true;
                break;
            }
        }
        return isRed;
    }
}
