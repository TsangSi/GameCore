/*
 * @Author: hwx
 * @Date: 2022-07-06 14:43:41
 * @FilePath: \SanGuo\assets\script\game\module\grade\GradeController.ts
 * @Description:  进阶控制器
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import NetMgr from '../../manager/NetMgr';
import { GradeTabIndex, GradeType } from './GradeConst';
import { GradeMgr } from './GradeMgr';

const { ccclass } = cc._decorator;
@ccclass('GradeController')
export default class GradeController extends BaseController {
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CGradeListPush_ID, this.onS2CGradeListPush, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CGradeListPush_ID, this.onS2CGradeListPush, this);
    }
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
     * 进阶玩法数据推送
     * @param data
     */
    private onS2CGradeListPush(data: S2CGradeListPush): void {
        if (!data.Tag) {
            const changeGradeIds: number[] = [];
            // 进阶玩法列表
            data.GradeList.forEach((data) => {
                changeGradeIds.push(data.GradeId);
                GradeMgr.I.updateGradeData(data.GradeId, data);
            });

            // 抛出进阶信息更新事件
            EventClient.I.emit(E.Grade.UpdateInfo, changeGradeIds);

            // 检查红点
            GradeMgr.I.checkRed();
        }
    }

    /**
     * 进阶玩法升级
     * @param gradeId 进阶玩法id
     * @param oneKey 是否一键升级
     * @param autoBuy 是否自动购买
     */
    public reqC2SGradeLevelUp(gradeId: number, oneKey: boolean, autoBuy: boolean): void {
        const data = new C2SGradeLevelUp();
        data.GradeId = gradeId;
        data.OneKey = Number(oneKey);
        data.AutoBuy = Number(autoBuy);
        NetMgr.I.sendMessage(ProtoId.C2SGradeLevelUp_ID, data);
    }

    /**
     * 进阶玩法突破
     * @param gradeId 进阶玩法id
     */
    public reqC2SGradeLevelBreak(gradeId: number): void {
        const data = new C2SGradeLevelBreak();
        data.GradeId = gradeId;
        NetMgr.I.sendMessage(ProtoId.C2SGradeLevelBreak_ID, data);
    }

    /**
     * 进阶豪礼领取
     * @param gradeId 进阶玩法id
     * @param bigLv 阶数
     */
    public reqC2SGradeGetUpGift(gradeId: number, bigLv: number): void {
        const data = new C2SGradeGetUpGift();
        data.GradeId = gradeId;
        data.BigLv = bigLv;
        NetMgr.I.sendMessage(ProtoId.C2SGradeGetUpGift_ID, data);
    }

    /**
     * 进阶三倍奖励领取
     * @param gradeId 进阶玩法id
     * @param bigLv 阶数
     * @param IsThree 阶数
     */
    public reqC2SGradeGetThreeGift(gradeId: number, bigLv: number, isThree: boolean): void {
        const data = new C2SGradeGetThreeGift();
        data.GradeId = gradeId;
        data.BigLv = bigLv;
        data.IsThree = Number(isThree);
        NetMgr.I.sendMessage(ProtoId.C2SGradeGetThreeGift_ID, data);
    }

    /**
     * 进阶技能升级
     * @param gradeId 进阶玩法id
     * @param part //技能位置
     */
    public reqC2SGradeSkillLevelUp(gradeId: number, part: number): void {
        const data = new C2SGradeSkillLevelUp();
        data.GradeId = gradeId;
        data.Part = part;
        NetMgr.I.sendMessage(ProtoId.C2SGradeSkillLevelUp_ID, data);
    }

    /**
     * 进阶装备一键穿戴
     * @param gradeId 进阶玩法id
     */
    public reqC2SGradeEquipAutoWear(gradeId: number): void {
        const data = new C2SGradeEquipAutoWear();
        data.GradeId = gradeId;
        NetMgr.I.sendMessage(ProtoId.C2SGradeEquipAutoWear_ID, data);
    }

    /**
     * 进阶装备部位升级
     * @param gradeId 进阶玩法id
     */
    public reqC2SGradeEquipPosLevelUp(gradeId: number, partList: number[]): void {
        const data = new C2SGradeEquipPosLevelUp();
        data.GradeId = gradeId;
        data.PartList = partList;
        NetMgr.I.sendMessage(ProtoId.C2SGradeEquipPosLevelUp_ID, data);
    }

    /**
     * 进阶装备打造
     * @param gradeId 进阶玩法id
     * @param part 装备部位
     * @param bigLv 装备阶数
     */
    public reqC2SGradeEquipMake(gradeId: number, part: number, bigLv: number): void {
        const data = new C2SGradeEquipMake();
        data.GradeId = gradeId;
        data.Part = part;
        data.BigLv = bigLv;
        NetMgr.I.sendMessage(ProtoId.C2SGradeEquipMake_ID, data);
    }

    /**
     * 进阶装备化金升级
     * @param gradeId 进阶玩法id
     * @param items
     */
    public reqC2SGradeEquipSmelting(items: string[]): void {
        const data = new C2SGradeEquipSmelting();
        data.Items = items;
        NetMgr.I.sendMessage(ProtoId.C2SGradeEquipSmelting_ID, data);
    }

    /**
     * 进阶装备化金升级
     * @param gradeId 进阶玩法id
     */
    public reqC2SGradeBeGoldLevelUp(gradeId: number, part: number): void {
        const data = new C2SGradeBeGoldLevelUp();
        data.GradeId = gradeId;
        data.Part = part;
        NetMgr.I.sendMessage(ProtoId.C2SGradeBeGoldLevelUp_ID, data);
    }

    /**
     * 进阶注灵
     * @param gradeId 进阶玩法id
     */
    public reqC2SGradeSoul(gradeId: number): void {
        const data = new C2SGradeSoul();
        data.GradeId = gradeId;
        NetMgr.I.sendMessage(ProtoId.C2SGradeSoul_ID, data);
    }

    /**
     * 进阶炼神
     * @param gradeId 进阶玩法id
     */
    public reqC2SGradeGod(gradeId: number): void {
        const data = new C2SGradeGod();
        data.GradeId = gradeId;
        NetMgr.I.sendMessage(ProtoId.C2SGradeGod_ID, data);
    }

    /**
     * 进阶皮肤激活
     * @param gradeId 进阶玩法id
     * @param skinId 进阶皮肤id
     */
    public reqC2SGradeSkinActive(gradeId: number, skinId: number): void {
        const data = new C2SGradeSkinActive();
        data.GradeId = gradeId;
        data.SkinId = skinId;
        NetMgr.I.sendMessage(ProtoId.C2SGradeSkinActive_ID, data);
    }

    /**
     * 进阶皮肤升星
     * @param gradeId 进阶玩法id
     * @param skinId 进阶皮肤id
     */
    public reqC2SGradeSkinLevelUp(gradeId: number, skinId: number): void {
        const data = new C2SGradeSkinLevelUp();
        data.GradeId = gradeId;
        data.SkinId = skinId;
        NetMgr.I.sendMessage(ProtoId.C2SGradeSkinLevelUp_ID, data);
    }

    /**
     * 进阶皮肤幻化
     * @param gradeId 进阶玩法id
     * @param skinId 进阶皮肤id
     */
    public reqC2SGradeSkinUse(gradeId: number, skinId: number): void {
        const data = new C2SGradeSkinUse();
        data.GradeId = gradeId;
        data.SkinId = skinId;
        NetMgr.I.sendMessage(ProtoId.C2SGradeSkinUse_ID, data);
    }

    /**
     * 进阶皮肤脱下
     * @param gradeId 进阶玩法id
     */
    public reqC2SGradeSkinOff(gradeId: number): void {
        const data = new C2SGradeSkinOff();
        data.GradeId = gradeId;
        NetMgr.I.sendMessage(ProtoId.C2SGradeSkinOff_ID, data);
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        let funcId = GradeType.HORSE;
        if (tab) {
            switch (tab) {
                case GradeTabIndex.HORSE:
                    funcId = GradeType.HORSE;
                    break;
                case GradeTabIndex.WING:
                    funcId = GradeType.WING;
                    break;
                case GradeTabIndex.WEAPON:
                    funcId = GradeType.WEAPON;
                    break;
                case GradeTabIndex.PET:
                    funcId = GradeType.PET;
                    break;
                default:
                    break;
            }
        }
        WinMgr.I.open(ViewConst.GradeWin, funcId, params ? ++params[0] : 1);
        return true;
    }
}
