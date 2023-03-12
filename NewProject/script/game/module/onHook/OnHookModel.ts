/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-06-13 10:48:45
 * @FilePath: \SanGuo2.4\assets\script\game\module\onHook\OnHookModel.ts
 * @Description:
 *
 */

import { E } from '../../const/EventName';
import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import ControllerMgr from '../../manager/ControllerMgr';
import { i18n, Lang } from '../../../i18n/i18n';

// 挂机收益详情枚举，要跟后端对应
export enum onHookRwAddType {
    /** 官职 */
    RoleOfficial = 1,
    /** 世家 */
    Family = 2
}

const { ccclass } = cc._decorator;
@ccclass('OnHookModel')
export class OnHookModel extends BaseModel {
    /** 已挂机时长 */
    private _AFKTime: number = 0;
    /** 挂机收益（道具收益） */
    private _AFKRewards: ItemInfo[] = [];
    /** 下一关的挂机收益 */
    private _NextAFKEta: ItemInfo[] = [];
    /** 挂机效率（货币收益） */
    private _AFKEta: ItemInfo[] = [];
    /** 挂机增加效果 */
    // private _AFKRewardAdd: RewardAdd[] = [];
    /** 进入剩余挂机次数 */
    private _RemainQuickTimes: number = 0;
    /** 当前快速挂机消耗玉璧数量,为0表示免费 */
    private _MoneyCost: number = 0;

    public set AFKTime(AFKTime: number) {
        this._AFKTime = AFKTime;
    }
    public get AFKTime(): number {
        return this._AFKTime;
    }
    public get AFKRewards(): ItemInfo[] {
        return this._AFKRewards;
    }
    public get AFKEta(): ItemInfo[] {
        return this._AFKEta;
    }
    public get RemainQuickTimes(): number {
        return this._RemainQuickTimes;
    }
    public get MoneyCost(): number {
        return this._MoneyCost;
    }

    public get NextAFKEta(): ItemInfo[] {
        return this._NextAFKEta;
    }
    // public get AFKRewardAdd(): RewardAdd[] {
    //     return this._AFKRewardAdd;
    // }
    // public set AFKRewardAdd(val: RewardAdd[]) {
    //     this._AFKRewardAdd = val;
    // }

    public clearAll(): void {
        //
    }

    /** 挂机信息 */
    public uptAFKInfo(d: S2CAFKInfo): void {
        // console.log('当前的挂机时间是', this._AFKTime, '返回的挂机时间是', d.AFKTime);
        if (d.AFKTime < this._AFKTime) {
            // console.error('服务器返回的挂机时间比当前的挂机时间小');
        }
        this._AFKTime = d.AFKTime;
        this._AFKRewards = d.Items;
        this._AFKEta = d.AFKEta;
        this._NextAFKEta = d.NextAFKEta;
        this._RemainQuickTimes = d.RemainQuickTimes;
        this._MoneyCost = d.MoneyCost;
        // console.log(d);

        EventClient.I.emit(E.OnHook.AFKInfo);
    }

    /** 挂机效果 */
    // public uptAFKRewardAdd(d: RewardAdd[]): void {
    //     this.AFKRewardAdd = d;
    //     EventClient.I.emit(E.OnHook.RewardAdd);
    // }

    // /** 获得奖励加成情况
    //  * @param _type 获取单个模块的加成详情
    //  */
    // public getAFKReAdds(typeId: number, _type?: onHookRwAddType): number {
    //     let add = 0;
    //     for (let i = 0; i < this.AFKRewardAdd.length; i++) {
    //         const rwAdd = this.AFKRewardAdd[i];
    //         if (rwAdd) {
    //             const isType = _type && _type === rwAdd.Type;
    //             const addV = isType ? 0 : add;
    //             const dem = rwAdd.IntAttrList.filter((item) => item.K === typeId)[0];
    //             if (dem) {
    //                 add = addV + rwAdd.IntAttrList.filter((item) => item.K === typeId)[0].V;
    //                 if (isType) {
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    //     const mathC = parseFloat((add / 10000 * 100).toFixed(2)) || 0;
    //     return mathC;
    // }

    /** 根据类型获取对应的加成标题 */
    public getRewardAddName(_type: onHookRwAddType): string {
        let name = '';
        switch (_type) {
            case onHookRwAddType.RoleOfficial:
                name = i18n.tt(Lang.onhook_official_add);
                break;
            case onHookRwAddType.Family:
                name = i18n.tt(Lang.onhook_family_add);
                break;
            default:
                break;
        }
        return name;
    }

    public getNextAFKEtaDiff(itemD: ItemInfo): number {
        let nextVal = 0;
        for (let i = 0; i < this.NextAFKEta.length; i++) {
            const item = this.NextAFKEta[i];
            if (item.ItemId === itemD.ItemId) {
                nextVal = Math.ceil(item.ItemNum - itemD.ItemNum);
                break;
            }
        }
        return nextVal;
    }

    public uptGetReward(): void {
        this._AFKTime = 0;
        this._AFKRewards = [];
        this._AFKEta = [];
        // this._AFKRewardAdd = [];
        EventClient.I.emit(E.OnHook.GetAward);
        // 重新再去请求
        ControllerMgr.I.OnHookController.reqAFKInfo();
        // ControllerMgr.I.OnHookController.reqRewardAdd();
    }

    /** 快速挂机 */
    public uptQuickAFK(d: S2CQuickAFK): void {
        this._RemainQuickTimes = d.RemainQuickTimes;
        this._MoneyCost = d.MoneyCost;

        EventClient.I.emit(E.OnHook.QuickAFK);
    }
}
