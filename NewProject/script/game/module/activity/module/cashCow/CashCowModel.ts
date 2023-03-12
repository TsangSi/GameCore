/*
 * @Author: myl
 * @Date: 2022-12-21 11:23:45
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import BaseModel from '../../../../../app/core/mvc/model/BaseModel';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { Config } from '../../../../base/config/Config';
import { ConfigConst } from '../../../../base/config/ConfigConst';
import { ConfigIndexer } from '../../../../base/config/indexer/ConfigIndexer';
import { E } from '../../../../const/EventName';
import { RoleMgr } from '../../../role/RoleMgr';
import { CashCowConst, CashCowShakeType } from './CashCowConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CashCowModel extends BaseModel {
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }

    private _userData: CashCowClientData = null;

    /** 获取摇钱树的常量配置 */
    public getCashCowConst(k: string): Cfg_Server_CashCowNormal {
        const indexer = Config.Get(ConfigConst.Cfg_Server_CashCowNormal);
        return indexer.getValueByKey(k);
    }

    public set userData(d: CashCowClientData) {
        this._userData = d;
        EventClient.I.emit(E.CashCow.Data);
    }

    public get userData(): CashCowClientData {
        return this._userData;
    }

    /** 用户剩余的免费次数
     * return n总次数 n1剩余次数
     */
    public userTimes(type: CashCowShakeType = CashCowShakeType.Free): { n: number, n1: number } {
        let cfgTimes = 0;
        let vipTimes = 0;
        let uTimes = 0;
        const { c1, c2, c3 } = this.getVipTimes();
        switch (type) {
            case CashCowShakeType.Coin:
                cfgTimes = Number(this.getCashCowConst(CashCowConst.Num2).CfgValue);
                vipTimes = c2;
                uTimes = this._userData.Coin3Num || 0;
                break;
            case CashCowShakeType.Coin1:
                cfgTimes = Number(this.getCashCowConst(CashCowConst.Num3).CfgValue);
                vipTimes = c3;
                uTimes = this._userData.Coin2Num || 0;
                break;
            default:
                cfgTimes = Number(this.getCashCowConst(CashCowConst.Num1).CfgValue);
                vipTimes = c1;
                uTimes = this._userData.FreeNum || 0;
                break;
        }
        return { n: cfgTimes + vipTimes, n1: cfgTimes + vipTimes - uTimes };
    }

    /** 获取提示文字
     * return s:剩余次数提示 s1:vip次数提示
    */
    public getTimesTip(type: CashCowShakeType = CashCowShakeType.Free): { s: string, s1: string } {
        const st = type === CashCowShakeType.Free ? i18n.tt(Lang.cashCow_tip_free) : i18n.tt(Lang.cashCow_tip_buy);
        const st1 = i18n.tt(Lang.cashCow_tip_vip);
        const { n, n1 } = this.userTimes(type);

        const txtColor = n1 <= 0 ? UtilColor.RedV : UtilColor.GreenV;
        const outLineColor = '#000000';

        const contentArr = [outLineColor, txtColor, n1];
        const s = UtilString.FormatArray(st, contentArr);

        const { name, times } = this.vipTimesTip(type);
        let s1 = UtilString.FormatArray(st1, ['#ff552d', name, times]);
        if (name === '') {
            s1 = '';
        }
        return { s, s1 };
    }

    /** vip增量提示文字
     * vipAddLv VIP等级的增量值
    */
    public vipTimesTip(type: CashCowShakeType = CashCowShakeType.Free, vipAddLv: number = 1): { name: string, times: number } {
        const lv = RoleMgr.I.d.VipLevel + vipAddLv;
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_VIP);
        const vipCfg: Cfg_VIP = indexer.getValueByKey(lv);
        const lastVipCfg: Cfg_VIP = indexer.getValueByKey(lv - 1 > 0 ? lv - 1 : 1);
        if (!vipCfg) {
            return { name: '', times: 0 };
        }
        let times = 0;
        let lastTimes = 0;
        switch (type) {
            case CashCowShakeType.Coin:
                times = Number(vipCfg.CashCow2.split(':')[1]);
                lastTimes = Number(lastVipCfg.CashCow2.split(':')[1]) || 0;
                break;
            case CashCowShakeType.Coin1:
                times = Number(vipCfg.CashCow3.split(':')[1]);
                lastTimes = Number(lastVipCfg.CashCow3.split(':')[1]) || 0;
                break;
            default:
                times = Number(vipCfg.CashCow1.split(':')[1]);
                lastTimes = Number(lastVipCfg.CashCow1.split(':')[1]) || 0;
                break;
        }
        if (times - lastTimes > 0) {
            return { name: vipCfg.VIPName, times: times - lastTimes };
        } else {
            return this.vipTimesTip(type, vipAddLv + 1);
        }
    }

    /** 获取当前vip等级下的免费次数,金币购买次数，玉璧可购买次数 */
    public getVipTimes(): { c1: number, c2: number, c3: number } {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_VIP);
        const cfg: Cfg_VIP = indexer.getValueByKey(RoleMgr.I.d.VipLevel);
        if (!cfg) {
            return { c1: 0, c2: 0, c3: 0 };
        }
        return {
            c1: Number(cfg.CashCow1.split(':')[1] || 0),
            c2: Number(cfg.CashCow2.split(':')[1] || 0),
            c3: Number(cfg.CashCow3.split(':')[1] || 0),
        };
    }

    /** 获取当前的摇钱树经验调数据
     * t0 当前数据
     * t1 经验调总数据
     */
    public getExpCfg(lv: number, exp: number): { t0: number, t1: number } {
        let t0 = 0;
        let t1 = 0;
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_Server_CashCow);
        const cfg: Cfg_Server_CashCow = indexer.getValueByKey(lv);
        t0 = exp;
        if (cfg) {
            t1 = cfg.Exp;
        }
        // if (!cfg) {
        //     const lastCfg: Cfg_Server_CashCow = indexer.getValueByKey(lv - 1);
        //     t1 = 0;
        //     t0 = exp - lastCfg.Exp;
        // } else if (lv === 1) {
        //     t0 = exp;
        //     t1 = cfg.Exp;
        // } else {
        //     const lastCfg: Cfg_Server_CashCow = indexer.getValueByKey(lv - 1);
        //     t0 = exp - lastCfg.Exp;
        //     t1 = cfg.Exp - lastCfg.Exp;
        // }

        return { t0, t1 };
    }

    /** 根据摇钱树等级 获取基础奖励数值 */
    public getBaseCashRowReward(lv: number = 1): number {
        const indexer = Config.Get(ConfigConst.Cfg_Server_CashCow);
        const cfg: Cfg_Server_CashCow = indexer.getValueByKey(lv);
        if (!cfg) return 0;
        return Number(cfg.Reward.split(':')[1]);
    }

    public getCashCowCfg(lv: number): Cfg_Server_CashCow {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_Server_CashCow);
        const cfg: Cfg_Server_CashCow = indexer.getValueByKey(lv);
        return cfg;
    }
}
