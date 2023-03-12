/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-08-15 16:39:21
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\GeneralController.ts
 * @Description: 武将系统
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { generalTabDataArr } from './GeneralConst';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../i18n/i18n';

const { ccclass } = cc._decorator;
@ccclass('GeneralController')
export default class GeneralController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CAllGeneral_ID, this.onS2CAllGeneral, this);
        EventProto.I.on(ProtoId.S2CAddGeneral_ID, this.onS2CAddGeneral, this);
        EventProto.I.on(ProtoId.S2CDelGeneral_ID, this.onS2CDelGeneral, this);
        // 锁
        EventProto.I.on(ProtoId.S2CGeneralLock_ID, this.onS2CGeneralLock, this);
        // 升级
        EventProto.I.on(ProtoId.S2CGeneralLevelUp_ID, this.onS2CGeneralLevelUp, this);
        // 升品
        EventProto.I.on(ProtoId.S2CGeneralQualityUp_ID, this.onS2CGeneralQualityUp, this);
        EventProto.I.on(ProtoId.S2CGeneralOneKeyQualityUp_ID, this.onS2CGeneralOneKeyQualityUp, this);
        // 属性
        EventProto.I.on(ProtoId.S2CGeneralUpdateAttr_ID, this.onS2CGeneralUpdateAttr, this);
        EventProto.I.on(ProtoId.S2CGeneralListUpdateAttr_ID, this.onS2CGeneralListUpdateAttr, this);
        // 觉醒
        EventProto.I.on(ProtoId.S2CGeneralAwaken_ID, this.onS2CGeneralAwaken, this);
        // 升阶
        EventProto.I.on(ProtoId.S2CGeneralGradeUp_ID, this.onS2CGeneralGradeUp, this);
        // 幻化
        EventProto.I.on(ProtoId.S2CGeneralSkinLevelUp_ID, this.onS2CGeneralSkinLevelUp, this);
        EventProto.I.on(ProtoId.S2CGeneralSkinUpdate_ID, this.onS2CGeneralSkinUpdate, this);
        EventProto.I.on(ProtoId.S2CGeneralWearSkin_ID, this.onS2CGeneralWearSkin, this);
        // 装备
        EventProto.I.on(ProtoId.S2CGeneralEquipWear_ID, this.onS2CGeneralEquipWear, this);
        EventProto.I.on(ProtoId.S2CGeneralEquipOneKeyWear_ID, this.onS2CGeneralEquipOneKeyWear, this);
        EventProto.I.on(ProtoId.S2CGeneralEquipStarUp_ID, this.onS2CGeneralEquipStarUp, this);
        // 升技
        EventProto.I.on(ProtoId.S2CGeneralStudySkill_ID, this.onS2CGeneralStudySkill, this);
        EventProto.I.on(ProtoId.S2CGeneralAwakenSkill_ID, this.onS2CGeneralAwakenSkill, this);
        EventProto.I.on(ProtoId.S2CGeneralSkillLock_ID, this.onS2CGeneralSkillLock, this);
        EventProto.I.on(ProtoId.S2CGeneralSkillRecycle_ID, this.onS2CGeneralSkillRecycle, this);
        // 重生
        EventProto.I.on(ProtoId.S2CGeneralReturn_ID, this.onS2CGeneralReturn, this);
        EventProto.I.on(ProtoId.S2CGeneralReborn_ID, this.onS2CGeneralReborn, this);
        // 遣散
        EventProto.I.on(ProtoId.S2CGeneralRelease_ID, this.onS2CGeneralRelease, this);
        // 合成
        EventProto.I.on(ProtoId.S2CGeneralStick_ID, this.onS2CGeneralStick, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CAllGeneral_ID, this.onS2CAllGeneral, this);
        EventProto.I.off(ProtoId.S2CAddGeneral_ID, this.onS2CAddGeneral, this);
        EventProto.I.off(ProtoId.S2CDelGeneral_ID, this.onS2CDelGeneral, this);
        // 锁
        EventProto.I.off(ProtoId.S2CGeneralLock_ID, this.onS2CGeneralLock, this);
        // 升级
        EventProto.I.off(ProtoId.S2CGeneralLevelUp_ID, this.onS2CGeneralLevelUp, this);
        // 升品
        EventProto.I.off(ProtoId.S2CGeneralQualityUp_ID, this.onS2CGeneralQualityUp, this);
        EventProto.I.off(ProtoId.S2CGeneralOneKeyQualityUp_ID, this.onS2CGeneralOneKeyQualityUp, this);
        // 属性
        EventProto.I.off(ProtoId.S2CGeneralUpdateAttr_ID, this.onS2CGeneralUpdateAttr, this);
        EventProto.I.off(ProtoId.S2CGeneralListUpdateAttr_ID, this.onS2CGeneralListUpdateAttr, this);
        // 觉醒
        EventProto.I.off(ProtoId.S2CGeneralAwaken_ID, this.onS2CGeneralAwaken, this);
        // 升阶
        EventProto.I.off(ProtoId.S2CGeneralGradeUp_ID, this.onS2CGeneralGradeUp, this);
        // 幻化
        EventProto.I.off(ProtoId.S2CGeneralSkinLevelUp_ID, this.onS2CGeneralSkinLevelUp, this);
        EventProto.I.off(ProtoId.S2CGeneralSkinUpdate_ID, this.onS2CGeneralSkinUpdate, this);
        EventProto.I.off(ProtoId.S2CGeneralWearSkin_ID, this.onS2CGeneralWearSkin, this);
        // 装备
        EventProto.I.off(ProtoId.S2CGeneralEquipWear_ID, this.onS2CGeneralEquipWear, this);
        EventProto.I.on(ProtoId.S2CGeneralEquipOneKeyWear_ID, this.onS2CGeneralEquipOneKeyWear, this);
        EventProto.I.off(ProtoId.S2CGeneralEquipStarUp_ID, this.onS2CGeneralEquipStarUp, this);
        // 升技
        EventProto.I.off(ProtoId.S2CGeneralStudySkill_ID, this.onS2CGeneralStudySkill, this);
        EventProto.I.off(ProtoId.S2CGeneralAwakenSkill_ID, this.onS2CGeneralAwakenSkill, this);
        EventProto.I.off(ProtoId.S2CGeneralSkillLock_ID, this.onS2CGeneralSkillLock, this);
        EventProto.I.off(ProtoId.S2CGeneralSkillRecycle_ID, this.onS2CGeneralSkillRecycle, this);
        // 重生
        EventProto.I.off(ProtoId.S2CGeneralReturn_ID, this.onS2CGeneralReturn, this);
        EventProto.I.off(ProtoId.S2CGeneralReborn_ID, this.onS2CGeneralReborn, this);
        // 遣散
        EventProto.I.off(ProtoId.S2CGeneralRelease_ID, this.onS2CGeneralRelease, this);
        // 合成
        EventProto.I.off(ProtoId.S2CGeneralStick_ID, this.onS2CGeneralStick, this);
    }

    /** 事件监听 */
    public addClientEvent(): void {
        //
    }
    public delClientEvent(): void {
        //
    }
    public clearAll(): void {
        //
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab: number = 0, params: any[] = [0], ...args: any[]): boolean {
        let funcId: number = FuncId.General;
        if (tab) {
            const index = generalTabDataArr.findIndex((v) => v.TabId === tab);
            if (index >= 0) {
                funcId = generalTabDataArr[index].funcId;
            }
        }
        if (UtilFunOpen.isOpen(funcId, true)) {
            ModelMgr.I.GeneralModel.openGeneral(tab, params ? params[0] : 0);
        }

        return true;
    }

    /** 武将列表 */
    private onS2CAllGeneral(d: S2CAllGeneral) {
        // console.log('武将列表:', d);
        ModelMgr.I.GeneralModel.setAllGeneralData(d);
    }

    /** 新增武将 */
    private onS2CAddGeneral(d: S2CAddGeneral) {
        // console.log('增武将:', d);
        ModelMgr.I.GeneralModel.addGeneralData(d.General);
    }

    /** 删武将 */
    private onS2CDelGeneral(d: S2CDelGeneral) {
        // console.log('删武将:', d);
        ModelMgr.I.GeneralModel.delGeneralData(d.OnlyIds);
    }

    /**
     * ************************ 加锁 ************************
     */
    public reqLock(OnlyId: string, Lock: number): void {
        const d: C2SGeneralLock = {
            OnlyId,
            Lock,
        };
        // console.log('请求加锁:', d);
        NetMgr.I.sendMessage(ProtoId.C2SGeneralLock_ID, d);
    }

    /** 修改锁定状态 */
    private onS2CGeneralLock(d: S2CGeneralLock) {
        // console.log('加锁成功:', d);
        ModelMgr.I.GeneralModel.changeLock(d);
    }

    /**
     * ************************ 升级 ************************
     */
    public reqLevelUp(OnlyId: string, ItemId: number, ItemNum: number): void {
        const d: C2SGeneralLevelUp = {
            OnlyId,
            ItemId,
            ItemNum,
        };
        // console.log('请求升级:', d);
        NetMgr.I.sendMessage(ProtoId.C2SGeneralLevelUp_ID, d);
    }

    /** 升级成功 */
    private onS2CGeneralLevelUp(d: S2CGeneralLevelUp) {
        // console.log('升级成功:', d);
        if (d && !d.Tag) {
            ModelMgr.I.GeneralModel.levelUp(d);
        }
    }

    /**
     * ************************ 升品 ************************
     */
    public reqQualityUp(OnlyId: string, ItemId: number, CostList: string[]): void {
        const d: C2SGeneralQualityUp = {
            OnlyId,
            ItemId,
            CostList,
        };
        // console.log('请求升品:', d);
        NetMgr.I.sendMessage(ProtoId.C2SGeneralQualityUp_ID, d);
    }

    /** 一键升品 */
    public reqOnekeyQualityUp(list: GeneralQualityUpParam[]): void {
        const d: C2SGeneralOneKeyQualityUp = new C2SGeneralOneKeyQualityUp();
        d.Params = list;
        // console.log('请求一键升品:', d);
        NetMgr.I.sendMessage(ProtoId.C2SGeneralOneKeyQualityUp_ID, d);
    }

    /** 升品成功 */
    private onS2CGeneralQualityUp(d: S2CGeneralQualityUp) {
        // console.log('升品成功:', d);
        if (d && !d.Tag) {
            ModelMgr.I.GeneralModel.qualityUp(d.General);
        }
    }

    /** 一键升品成功 */
    private onS2CGeneralOneKeyQualityUp(d: S2CGeneralOneKeyQualityUp) {
        // console.log('一键升品成功:', d);
        if (d && !d.Tag) {
            ModelMgr.I.GeneralModel.qualityUpOnekey(d.Generals);
            //
            WinMgr.I.open(ViewConst.GeneralRewardWin, d.Generals);
        }
    }

    /** 属性更新 */
    private onS2CGeneralUpdateAttr(d: S2CGeneralUpdateAttr) {
        // console.log('属性更新:', d);
        ModelMgr.I.GeneralModel.refreshAttr(d);
    }

    /** 属性列表更新 */
    private onS2CGeneralListUpdateAttr(d: S2CGeneralListUpdateAttr) {
        // console.log('属性列表更新:', d);
        if (d) {
            for (let i = 0; i < d.List.length; i++) {
                ModelMgr.I.GeneralModel.refreshAttr(d.List[i]);
            }
        }
    }

    /**
     * ************************ 觉醒 ************************
     */
    public reqGeneralAwaken(OnlyId: string, Type: number, AutoBuy: number): void {
        const d: C2SGeneralAwaken = {
            OnlyId,
            Type,
            AutoBuy,
        };
        // console.log('请求觉醒:', d);
        NetMgr.I.sendMessage(ProtoId.C2SGeneralAwaken_ID, d);
    }
    private onS2CGeneralAwaken(d: S2CGeneralAwaken) {
        // console.log('返回觉醒:', d);
        if (d && !d.Tag) {
            ModelMgr.I.GeneralModel.refreshAwaken(d);
        }
    }

    /**
     * ************************ 升阶 ************************
     */
    public reqGeneralGradeUp(OnlyId: string, CostList: string[]): void {
        const d: C2SGeneralGradeUp = {
            OnlyId,
            CostList,
        };
        // console.log('请求升阶:', d);
        NetMgr.I.sendMessage(ProtoId.C2SGeneralGradeUp_ID, d);
    }
    private onS2CGeneralGradeUp(d: S2CGeneralGradeUp) {
        // console.log('返回升阶:', d);
        if (d && !d.Tag) {
            ModelMgr.I.GeneralModel.refreshGradeUp(d);
        }
    }

    /**
     * ************************ 幻化 ************************
     */
    public reqGeneralSkinLevelUp(SkinId: number): void {
        const d: C2SGeneralSkinLevelUp = {
            SkinId,
        };
        // console.log('请求幻化升星:', d);
        NetMgr.I.sendMessage(ProtoId.C2SGeneralSkinLevelUp_ID, d);
    }
    /** 幻化穿戴 */
    public reqGeneralWearSkin(OnlyId: string, SkinId: number): void {
        const d: C2SGeneralWearSkin = {
            OnlyId,
            SkinId,
        };
        // console.log('请求幻化穿戴:', d);
        NetMgr.I.sendMessage(ProtoId.C2SGeneralWearSkin_ID, d);
    }
    private onS2CGeneralSkinLevelUp(d: S2CGeneralSkinLevelUp) {
        // console.log('onS2CGeneralSkinLevelUp', d);
    }
    private onS2CGeneralSkinUpdate(d: S2CGeneralSkinUpdate) {
        // console.log('返回幻化升星:', d);
        ModelMgr.I.GeneralModel.refreshSkin(d);
    }
    private onS2CGeneralWearSkin(d: S2CGeneralWearSkin) {
        // console.log('返回幻化穿戴:', d);
        if (d && !d.Tag) {
            ModelMgr.I.GeneralModel.refreshWearSkin(d);
        }
    }

    /** 武将装备穿戴 */
    private onS2CGeneralEquipWear(d: S2CGeneralEquipWear) {
        // console.log('武将装备穿戴:', d);
        if (d && !d.Tag) {
            ModelMgr.I.GeneralModel.refreshEquipWear(d);
        }
    }
    /** 武将装备穿戴 */
    public reqGeneralEquipWear(OnlyId: string, Part: number): void {
        // console.log('请求装备穿戴:', OnlyId, Part);
        const d: C2SGeneralEquipWear = {
            OnlyId,
            Part,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGeneralEquipWear_ID, d);
    }
    private onS2CGeneralEquipOneKeyWear(d: S2CGeneralEquipOneKeyWear) {
        // console.log('武将装备一键穿戴:', d);
        if (d && !d.Tag) {
            ModelMgr.I.GeneralModel.refreshEquipWear(d);
        }
    }
    /** 武将装备一键穿戴 */
    public reqGeneralEquipOnekeyWear(OnlyId: string): void {
        // console.log('请求武将装备一键穿戴:', OnlyId);
        const d: C2SGeneralEquipOneKeyWear = {
            OnlyId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGeneralEquipOneKeyWear_ID, d);
    }

    /** 武将装备升星 */
    private onS2CGeneralEquipStarUp(d: S2CGeneralEquipStarUp) {
        // console.log('武将装备升星:', d);
        if (d && !d.Tag) {
            ModelMgr.I.GeneralModel.refreshEquipStarUp(d);
        }
    }
    /** 请求装备升星 */
    public reqGeneralEquipStarUp(OnlyId: string, CostList: string[]): void {
        // console.log('请求武将装备升星:', OnlyId, CostList);
        const d: C2SGeneralEquipStarUp = {
            OnlyId,
            CostList,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGeneralEquipStarUp_ID, d);
    }

    /** 武将技能学习 */
    private onS2CGeneralStudySkill(d: S2CGeneralStudySkill) {
        // console.log('武将技能学习:', d);
        if (d && !d.Tag) {
            ModelMgr.I.GeneralModel.refreshSkillStudy(d);
        }
    }
    public reqGeneralStudySkill(OnlyId: string, ItemId: number): void {
        // console.log('请求技能学习:', OnlyId, ItemId);
        const d: C2SGeneralStudySkill = {
            OnlyId,
            ItemId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGeneralStudySkill_ID, d);
    }

    /** 激活武将觉醒技能 */
    private onS2CGeneralAwakenSkill(d: S2CGeneralAwakenSkill) {
        // console.log('激活武将觉醒技能:', d);
        if (d && !d.Tag) {
            ModelMgr.I.GeneralModel.refreshSkillAwaken(d);
        }
    }
    /** 请求激活武将觉醒技能 */
    public reqGeneralAwakenSkill(OnlyId: string): void {
        // console.log('请求激活武将觉醒技能:', OnlyId);
        const d: C2SGeneralAwakenSkill = {
            OnlyId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGeneralAwakenSkill_ID, d);
    }

    /** 武将技能锁定 */
    private onS2CGeneralSkillLock(d: S2CGeneralSkillLock) {
        // console.log('武将技能锁定:', d);
        if (d && !d.Tag) {
            ModelMgr.I.GeneralModel.refreshSkillLock(d);
        }
    }
    public reqGeneralSkillLock(OnlyId: string, SkillId: number): void {
        // console.log('请求技能锁定:', OnlyId, SkillId);
        const d: C2SGeneralSkillLock = {
            OnlyId,
            SkillId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGeneralSkillLock_ID, d);
    }

    /** 武将技能回收 */
    private onS2CGeneralSkillRecycle(d: S2CGeneralSkillRecycle) {
        console.log('武将技能回收:', d);
        if (d && !d.Tag) {
            EventClient.I.emit(E.General.GRecycle, d.ItemIds);
        }
    }
    /** 技能回收 */
    public reqGeneralSkillRecycle(Items: ItemInfo[]): void {
        // console.log('请求技能回收:', Items);
        const d: C2SGeneralSkillRecycle = {
            Items,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGeneralSkillRecycle_ID, d);
    }

    /** 武将重生返还的奖励 */
    public reqGeneralReturn(OnlyId: string): void {
        // console.log('武将重生返还的奖励:', OnlyId);
        const d: C2SGeneralReturn = {
            OnlyId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGeneralReturn_ID, d);
    }
    private onS2CGeneralReturn(d: S2CGeneralReturn) {
        // console.log('武将重生返还的奖励:', d);
        if (d && !d.Tag) {
            EventClient.I.emit(E.General.GReturn, d.Items);
        }
    }

    /** 武将重生 */
    public reqGeneralReborn(OnlyId: string): void {
        // console.log('请求 武将重生:', OnlyId);
        const d: C2SGeneralReborn = {
            OnlyId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGeneralReborn_ID, d);
    }
    private onS2CGeneralReborn(d: S2CGeneralReborn) {
        // console.log('返回 武将重生:', d);
        if (d && !d.Tag) {
            ModelMgr.I.GeneralModel.uptReborn(d.General);
        }
    }

    /** 武将遣散 */
    public reqGeneralRelease(OnlyIds: string[]): void {
        // console.log('请求 武将遣散:', OnlyIds);
        const d: C2SGeneralRelease = {
            OnlyIds,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGeneralRelease_ID, d);
    }
    private onS2CGeneralRelease(d: S2CGeneralRelease) {
        // console.log('返回 武将遣散:', d);
        if (d && !d.Tag) {
            if (d.Items.length === 0) {
                MsgToastMgr.Show(i18n.tt(Lang.general_disband_noskill));
            }
        }
    }

    /** 合成 */
    public reqGeneralCompose(id: number, num: number): void {
        // console.log('请求 武将合成:', id, num);
        const d: C2SGeneralStick = {
            ItemId: id,
            ItemNum: num,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGeneralStick_ID, d);
    }
    private onS2CGeneralStick(d: S2CGeneralStick) {
        // console.log('返回 武将合成:', d);
        if (d && !d.Tag) {
            EventClient.I.emit(E.General.GCompose);
        }
    }
}
