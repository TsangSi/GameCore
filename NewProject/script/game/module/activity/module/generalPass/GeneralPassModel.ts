/*
 * @Author: myl
 * @Date: 2022-12-07 10:19:12
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import BaseModel from '../../../../../app/core/mvc/model/BaseModel';
import { Config } from '../../../../base/config/Config';
import { ConfigConst } from '../../../../base/config/ConfigConst';
import ConfigGeneralPassIndexer from '../../../../base/config/indexer/ConfigGeneralPassIndexer';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { E } from '../../../../const/EventName';
import { EActiveStatus } from '../../../../const/GameConst';
import { EActivityGeneralPassRedId, EActivityRedId } from '../../../reddot/RedDotConst';
import { RedDotMgr } from '../../../reddot/RedDotMgr';
import { RoleMgr } from '../../../role/RoleMgr';
import { EGeneralPassType, EWelfareState } from './GeneralPassConst';

const { ccclass, property } = cc._decorator;
export type GeneralPassData = { data: GeneralPassClientData, funcID: number, cycNo: number }
export type GeneralPassItemData = {
    // 配置表数据
    cfg: Cfg_Server_GeneralPassRd,
    // 通行证配置
    passCfg: Cfg_Server_GeneralPass,
    // 免费购买信息状态
    freeState: boolean,
    // 付费购买信息状态
    payState: boolean,
    // 是否购买将军令
    isPay: boolean
    // 是否达到要求
    isRecive: boolean
}

export type WelfareItemData = { cfg: Cfg_Server_Welfare, state: EWelfareState }
@ccclass
export default class GeneralPassModel extends BaseModel {
    public clearAll(): void {
        //
    }

    private _generalPassData: GeneralPassData[] = [];

    // 用户购买的通行证id列表
    public _IsCharge: number[] = [];
    public setActData(data: S2CPlayerActModelData): void {
        // 替换
        let isHave = false;
        for (let i = 0; i < this._generalPassData.length; i++) {
            const item = this._generalPassData[i];
            if (item.funcID === data.FuncId && item.cycNo === data.CycNo) {
                item.data = data.GeneralPassClientData;
                isHave = true;
            } else {
                // 不做替换处理
            }
        }
        if (!isHave) {
            this._generalPassData.push({ data: data.GeneralPassClientData, cycNo: data.CycNo, funcID: data.FuncId });
        }

        EventClient.I.emit(E.GeneralPass.Data, data);
    }

    /** 根据活动id 和期号获取用户数据 */
    public getUserData(fundId: number, cycNo: number): GeneralPassData {
        for (let i = 0; i < this._generalPassData.length; i++) {
            const item = this._generalPassData[i];
            if (item.funcID === fundId && item.cycNo === cycNo) {
                return item;
            }
        }
        return null;
    }

    /** 获取不同类型下的通行证ids */
    public getPasses(groupId: string): Cfg_Server_GeneralPass[] {
        const indexer: ConfigGeneralPassIndexer = Config.Get(ConfigConst.Cfg_Server_GeneralPass);
        return indexer.getPasses(groupId);
    }

    /** 获取通行证配置数据 */
    public getPassConfig(id: number): Cfg_Server_GeneralPass {
        const indexer: ConfigGeneralPassIndexer = Config.Get(ConfigConst.Cfg_Server_GeneralPass);
        return indexer.getPassByKey(id);
    }

    /** 获取通行证对应的奖励 */
    public getRewardInPass(groupId: string, passId: number): Cfg_Server_GeneralPassRd[] {
        const indexer: ConfigGeneralPassIndexer = Config.Get(ConfigConst.Cfg_Server_GeneralPass);
        return indexer.getRewardsInPass(groupId, passId);
    }

    /** 获取全民奖励数据 */
    public getWelfareCfg(groupId: string): Cfg_Server_Welfare[] {
        const indexer: ConfigGeneralPassIndexer = Config.Get(ConfigConst.Cfg_Server_GeneralPass);
        return indexer.getWelfareByActId(groupId);
    }

    public getWelfareListData(cycNo: number, funcID: number, groupId: string): WelfareItemData[] {
        const listData = this.getWelfareCfg(groupId);
        const data = this.getUserData(funcID, cycNo);
        const arr: WelfareItemData[] = [];
        for (let i = 0; i < listData.length; i++) {
            const cfg = listData[i];
            let state: EWelfareState = EWelfareState.UnActive;

            switch (cfg.ConditionType) {
                case EGeneralPassType.FightValue: {
                    const userValue = data.data.ChargeNum;
                    const st1 = userValue >= cfg.Value;
                    const st2 = data.data.WelfareRewardIds.indexOf(cfg.Id) > -1;
                    if (!st1) state = EWelfareState.UnActive;
                    if (st1 && !st2) state = EWelfareState.CanActive;
                    if (st1 && st2) state = EWelfareState.Active;
                }
                    break;
                case EGeneralPassType.Level: {
                    const userValue = data.data.ChargeNum;
                    const st1 = userValue >= cfg.Value;
                    const st2 = data.data.WelfareRewardIds.indexOf(cfg.Id) > -1;
                    if (!st1) state = EWelfareState.UnActive;
                    if (st1 && !st2) state = EWelfareState.CanActive;
                    if (st1 && st2) state = EWelfareState.Active;
                }
                    break;
                case EGeneralPassType.LoginDay: {
                    const userValue = data.data.ChargeNum;
                    const st1 = userValue >= cfg.Value;
                    const st2 = data.data.WelfareRewardIds.indexOf(cfg.Id) > -1;
                    if (!st1) state = EWelfareState.UnActive;
                    if (st1 && !st2) state = EWelfareState.CanActive;
                    if (st1 && st2) state = EWelfareState.Active;
                }
                    break;

                default:
                    break;
            }
            arr.push({ state, cfg });
        }
        arr.sort((a, b) => a.cfg.Id - b.cfg.Id);
        arr.sort((m, n) => m.state - n.state);
        return arr;
    }

    public getListData(funcID: number, cycNo: number, passId: number, groupId: string): { list: GeneralPassItemData[], index: number } {
        // RewardIds: 通行证奖励
        // ChargeRewardIds: 通信证充值奖励
        // WelfareRewardIds: 全名奖励
        let index = -1;
        const passCfg = this.getPassConfig(passId);
        const passRewards = this.getRewardInPass(groupId, passCfg.PassId);
        const data = this.getUserData(funcID, cycNo);
        passRewards.sort((a, b) => a.Id - b.Id);
        const listData: GeneralPassItemData[] = [];
        for (let q = 0; q < passRewards.length; q++) {
            const cfg = passRewards[q];

            const freeData = data.data.RewardIds;
            const userPass = data.data.ChargeList;
            const payData = data.data.ChargeRewardIds;

            const freeState = freeData.indexOf(cfg.Id) > -1;
            const isPay = userPass.indexOf(passCfg.GoodsId) > -1;
            const payState = isPay && payData.indexOf(cfg.Id) > -1;
            let isRecive = false;
            switch (cfg.ConditionType) {
                case EGeneralPassType.FightValue: {
                    const userValue = RoleMgr.I.d.FightValueMax;
                    isRecive = userValue >= cfg.Value;
                }
                    break;
                case EGeneralPassType.Level: {
                    const userValue = RoleMgr.I.d.Level;
                    isRecive = userValue >= cfg.Value;
                }
                    break;
                case EGeneralPassType.LoginDay: {
                    const userValue = RoleMgr.I.d.LoginDay;
                    isRecive = userValue >= cfg.Value;
                }
                    break;

                default:
                    break;
            }

            if (isRecive) {
                index = q;
            }
            const result: GeneralPassItemData = {
                cfg, freeState, isPay, payState, isRecive, passCfg,
            };
            listData.push(result);
        }
        return { list: listData, index };
    }

    /** 更新用户的通行证数据 */
    public updateUserPassData(data: S2CGetGeneralPassReward): void {
        for (let i = 0; i < this._generalPassData.length; i++) {
            const ele = this._generalPassData[i];
            if (ele.cycNo === data.CycNo && ele.funcID === data.FuncId) {
                ele.data.RewardIds = data.RewardIds;
                ele.data.ChargeRewardIds = data.ChargeRewardIds;
            }
        }
        EventClient.I.emit(E.GeneralPass.UpdateData, data);
    }

    /** 获取通行证是否购买 */
    public getIsBuyPass(funcID: number, cycNo: number, passId: number): boolean {
        const passCfg = this.getPassConfig(passId);
        const data = this.getUserData(funcID, cycNo);
        return data.data.ChargeList.indexOf(passCfg.GoodsId) > -1;
    }

    public updateWelfare(data: S2CGetAllServerReward): void {
        for (let i = 0; i < this._generalPassData.length; i++) {
            const ele = this._generalPassData[i];
            if (ele.cycNo === data.CycNo && ele.funcID === data.FuncId) {
                ele.data.WelfareRewardIds = data.Rewards;
            }
        }
        EventClient.I.emit(E.GeneralPass.WelfareData, data);
    }

    /** 通行证红点 */
    public passRed(passId: number, groupId: string, fundId: number, cycNo: number): boolean {
        const list = this.getListData(fundId, cycNo, passId, groupId).list;
        for (let i = 0; i < list.length; i++) {
            const data = list[i];
            if (data.isRecive && !data.freeState || data.isRecive && data.isPay && !data.payState) {
                return RedDotMgr.I.updateRedDot(EActivityGeneralPassRedId + passId, true);
            } else {
                RedDotMgr.I.updateRedDot(EActivityGeneralPassRedId + passId, false);
            }
        }
        return false;
    }

    /** 全民奖励红点 */
    public welfareRed(groupId: string, fundId: number, cycNo: number): boolean {
        const list = this.getWelfareListData(cycNo, fundId, groupId);
        for (let i = 0; i < list.length; i++) {
            const ele = list[i];
            if (ele.state === EActiveStatus.CanActive) {
                return true;
            }
        }
        return false;
    }

    /** 获取当前购买的奖励数据
     * t: 总和
     * c: 当前奖励拼接
     * tc:总奖励拼接
    */
    public getPayReward(list: GeneralPassItemData[], index: number): { c: string, t: string, tc: string } {
        let t = '';
        let c = '';
        let tc = '';
        for (let i = 0; i < list.length; i++) {
            const ele = list[i];
            const cfg = ele.cfg;
            const Prize2 = cfg.Prize2;
            tc += `${Prize2}|`;
            if (i <= index) {
                c += `${Prize2}|`;
            }
        }

        const arr = c.split('|').slice(0, -1);
        const map: Map<string, number> = new Map();
        for (let j = 0; j < arr.length; j++) {
            const str = arr[j];
            const p = str.split(':');
            const num = map.get(p[0]) || 0;
            const nNum = Number(p[1]) + num;
            map.set(p[0], nNum);
        }
        map.forEach((v, k) => {
            if (Number(k) < 10) {
                t += `${k}:${v}|`;
            }
        });
        if (index < 0) {
            t = '';
            c = '';
        }
        return { t, c, tc };
    }
}
