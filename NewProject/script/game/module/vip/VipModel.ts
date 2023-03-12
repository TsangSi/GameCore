/*
 * @Author: zs
 * @Date: 2022-06-06 21:54:31
 * @FilePath: \SanGuo-2.4-new\assets\script\game\module\vip\VipModel.ts
 * @Description:
 *
 */
import { UtilString } from '../../../app/base/utils/UtilString';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { ViewConst } from '../../const/ViewConst';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import { RID, IListenInfo, REDDOT_ADD_LISTEN_INFO } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { RoleAN } from '../role/RoleAN';
import { RoleMgr } from '../role/RoleMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import {
    EVipFuncType,
    FuncAddState, Max_SVip_Level, Max_Vip_Level, VIpResType,
} from './VipConst';
import ModelMgr from '../../manager/ModelMgr';

type TopBannerNodeConfig = { scale: number, path: string }
const { ccclass } = cc._decorator;
@ccclass('VipModel')
export class VipModel extends BaseModel {
    /** vip最大等级 */
    private maxVip: number = 0;

    /** 最大vip等级 */
    private maxVipLv: number = Max_Vip_Level;
    /** 最大SVip等级 */
    private maxSVipLv: number = Max_SVip_Level;
    /** 获取vip最大等级 */
    public getMaxVip(): number {
        if (!this.maxVip) {
            this.maxVip = this.vipConfig.keysLength;
        }
        return this.maxVip;
    }

    /**
     * 获取该等级所需经验值
     * @param lv 等级
     * @returns
     */
    public getNeedExp(lv: number): number {
        lv = Math.min(lv, this.getMaxVip());
        return this.vipConfig.getValueByKey(lv, 'Exp') || 0;
    }

    public getVipName(lv: number): string {
        if (lv > Max_SVip_Level) {
            lv = Max_SVip_Level;
        }
        const cfg: Cfg_VIP = this.vipCfg(lv);
        return cfg.VIPName.slice(0, ModelMgr.I.SettingModel.getSpecialPower() ? 4 : 2);
        // return cfg.VIPName;
    }
    /** 获取vip全称 不受设置页面的影响 */
    public getVipFullName(lv: number): string {
        if (lv > Max_SVip_Level) {
            lv = Max_SVip_Level;
        }
        const cfg: Cfg_VIP = this.vipCfg(lv);
        return cfg.VIPName;
    }

    public getSilkRoadCount(lv: number): number {
        if (lv > Max_SVip_Level) {
            lv = Max_SVip_Level;
        }
        const cfg: Cfg_VIP = this.vipConfig.getValueByKey(lv);
        console.log(cfg);

        return Number(cfg.SilkRoadCount.split(':')[1]);
    }

    /** 判断用户 vip 还是svip */
    public isSVip(): { isSvip: boolean, lev: number } {
        if (RoleMgr.I.d.VipLevel > Max_Vip_Level) {
            return { isSvip: true, lev: RoleMgr.I.d.VipLevel - Max_Vip_Level };
        } else {
            return { isSvip: false, lev: RoleMgr.I.d.VipLevel };
        }
    }

    public clearAll(): void {
        //
    }

    /** 当前vip进度 每升级一级vip进度都是从0开始 */
    public vipProgress(): { exp: number, need: number } {
        // vip经验是当前的累计的经验数
        const vipExp: number = RoleMgr.I.d.VipExp;
        const vipLv: number = RoleMgr.I.d.VipLevel <= 1 ? 1 : RoleMgr.I.d.VipLevel;
        const currVipConfig: Cfg_VIP = this.vipCfg(vipLv);

        let hisExp = 0;
        for (let i = 1; i < vipLv; i++) {
            const conf: Cfg_VIP = this.vipCfg(i);
            const exp = conf.Exp;
            hisExp += exp;
        }
        const currentExp = vipExp - hisExp;
        return { exp: currentExp, need: currVipConfig.Exp };
    }

    public vipName(lv: number): string {
        const config: Cfg_VIP = this.vipCfg(lv);
        if (!config) {
            return `${i18n.tt(Lang.open_vip)}0`;
        } else {
            return config.VIPName;
        }
    }

    /** vip 的每日奖励 */
    public vipDayReward(lv: number): string {
        const conf: Cfg_VIP = this.vipCfg(lv);
        return conf.DayPrize;
    }

    /** vip 等级奖励 */
    public vipReward(lv: number): string {
        const conf: Cfg_VIP = this.vipCfg(lv);
        return conf.Prize;
    }
    /** vip 等级奖励 */
    public vipTrialCount(lv: number): string {
        const conf: Cfg_VIP = this.vipCfg(lv);
        return conf.TrialCopyCount;
    }

    public vipCfg(vipLv: number): Cfg_VIP {
        return this.vipConfig.getValueByKey(vipLv);
    }

    /** 获取vip配置表 */
    private get vipConfig(): ConfigIndexer {
        return Config.Get(Config.Type.Cfg_VIP);
    }

    public getVipConfig(): Cfg_VIP[] {
        const vips: Cfg_VIP[] = [];
        for (let i = 1; i <= this.maxVipLv; i++) {
            const config: Cfg_VIP = this.vipCfg(i);
            vips.push(config);
        }
        return vips;
    }

    public getSVipConfig(): Cfg_VIP[] {
        const vips: Cfg_VIP[] = [];
        for (let i = this.maxVipLv + 1; i <= this.maxSVipLv; i++) {
            const config: Cfg_VIP = this.vipCfg(i);
            vips.push(config);
        }
        return vips;
    }

    /** 升级vip解锁的新功能
     * isAllShow 是否显示所有的属性
    */
    public addFunc(lv: number, isAllShow: boolean = false): { funcState: FuncAddState, desc: string }[] {
        const funcs: { funcState: FuncAddState, desc: string }[] = [];
        const oldLv = lv - 1;
        const oldConf: Cfg_VIP = this.vipCfg(oldLv);
        const currConf: Cfg_VIP = this.vipCfg(lv);
        // 1. 材料副本购买次数 2，竞技场购买次数 3，多人boss购买次数 4 悬赏boss购买次数
        // 5经验试炼 6金币试炼 7快速挂机 8组队副本 9降妖除魔 10凶灵岛 11凶煞岛 12凶冥岛 13仙林狩猎
        const v1 = this.value2IdNum(currConf.ArenaTimes);
        const v2 = this.value2IdNum(currConf.MITime);
        const v3 = this.value2IdNum(currConf.Family1);
        const v4 = this.value2IdNum(currConf.Family2);
        const v5 = this.value2IdNum(currConf.CashCow1);
        const v6 = this.value2IdNum(currConf.CashCow2);
        const v7 = this.value2IdNum(currConf.CashCow3);
        const v8 = this.value2IdNum(currConf.TrialCopyCount);
        // const v9 = this.value2IdNum(currConf.XYCMTime);
        // const v10 = this.value2IdNum(currConf.XSTime);
        // const v11 = this.value2IdNum(currConf.XSTime2);
        // const v12 = this.value2IdNum(currConf.XSTime3);
        // const v13 = this.value2IdNum(currConf.XLSLTime);
        const v14 = this.value2IdNum(currConf.AFKTimes);

        if (oldConf) {
            const oldUnlockFunc = oldConf.UnlockFunc.split('|');
            const newUnlockFunc = currConf.UnlockFunc.split('|');
            for (let j = 0; j < newUnlockFunc.length; j++) {
                const fid = newUnlockFunc[j];
                if (oldUnlockFunc.indexOf(fid) === -1) {
                    const desc = this.funcDesc(parseInt(fid));
                    funcs.push({ funcState: FuncAddState.New, desc });
                } else if (isAllShow && fid !== '') {
                    const desc = this.funcDesc(parseInt(fid));
                    funcs.push({ funcState: FuncAddState.Old, desc });
                }
            }
            const ov1 = this.value2IdNum(oldConf.ArenaTimes);
            const ov2 = this.value2IdNum(oldConf.MITime);
            const ov3 = this.value2IdNum(oldConf.Family1);
            const ov4 = this.value2IdNum(oldConf.Family2);
            const ov5 = this.value2IdNum(oldConf.CashCow1);
            const ov6 = this.value2IdNum(oldConf.CashCow2);
            const ov7 = this.value2IdNum(oldConf.CashCow3);
            const ov8 = this.value2IdNum(oldConf.TrialCopyCount);
            // const ov9 = this.value2IdNum(oldConf.XYCMTime);
            // const ov10 = this.value2IdNum(oldConf.XSTime);
            // const ov11 = this.value2IdNum(oldConf.XSTime2);
            // const ov12 = this.value2IdNum(oldConf.XSTime3);
            // const ov13 = this.value2IdNum(oldConf.XLSLTime);
            const ov14 = this.value2IdNum(oldConf.AFKTimes);

            this.pushItemWithHistory(funcs, v1, ov1, isAllShow);
            this.pushItemWithHistory(funcs, v2, ov2, isAllShow);
            this.pushItemWithHistory(funcs, v3, ov3, isAllShow);
            this.pushItemWithHistory(funcs, v4, ov4, isAllShow);
            this.pushItemWithHistory(funcs, v5, ov5, isAllShow);
            this.pushItemWithHistory(funcs, v6, ov6, isAllShow);
            this.pushItemWithHistory(funcs, v7, ov7, isAllShow);
            this.pushItemWithHistory(funcs, v8, ov8, isAllShow);
            // this.pushItemWithHistory(funcs, v9, ov9, isAllShow);
            // this.pushItemWithHistory(funcs, v10, ov10, isAllShow);
            // this.pushItemWithHistory(funcs, v11, ov11, isAllShow);
            // this.pushItemWithHistory(funcs, v12, ov12, isAllShow);
            // this.pushItemWithHistory(funcs, v13, ov13, isAllShow);
            this.pushItemWithHistory(funcs, v14, ov14, isAllShow);
        } else {
            // 获取解锁功能
            const currUnlockFuncs = currConf.UnlockFunc.split('|');
            for (let i = 0; i < currUnlockFuncs.length; i++) {
                if (currUnlockFuncs[i] === null || currUnlockFuncs[i] === '') continue;
                const fid = parseInt(currUnlockFuncs[i]);
                const desc = this.funcDesc(fid);
                funcs.push({ funcState: FuncAddState.New, desc });
            }
            // 获取功能次数
            this.pushItem(funcs, v1);
            this.pushItem(funcs, v2);
            this.pushItem(funcs, v3);
            this.pushItem(funcs, v4);
            this.pushItem(funcs, v5);
            this.pushItem(funcs, v6);
            this.pushItem(funcs, v7);
            this.pushItem(funcs, v8);
            // this.pushItem(funcs, v9);
            // this.pushItem(funcs, v10);
            // this.pushItem(funcs, v11);
            // this.pushItem(funcs, v12);
            // this.pushItem(funcs, v13);
            this.pushItem(funcs, v14);
        }
        return funcs;
    }

    private pushItem(source: { funcState: FuncAddState, desc: string }[], v: { id: number, num: number }) {
        if (v.num > 0) {
            source.push({ funcState: FuncAddState.New, desc: this.funcDesc(v.id, v.num) });
        }
    }

    private pushItemWithHistory(
        source: { funcState: FuncAddState, desc: string }[],
        v: { id: number, num: number },
        ov: { id: number, num: number },
        isAllShow: boolean = false,
    ) {
        if (ov.num <= 0 && v.num > 0) {
            source.push({ funcState: FuncAddState.New, desc: this.funcDesc(v.id, v.num) });
        } else if (ov.num > 0 && v.num > ov.num) {
            source.push({ funcState: FuncAddState.Change, desc: this.funcDesc(v.id, v.num) });
        } else if (isAllShow && v.num > 0) {
            source.push({ funcState: FuncAddState.Old, desc: this.funcDesc(v.id, v.num) });
        }
    }

    private funcDesc(fid: number, count: number = 0): string {
        const descConf: Cfg_VIP_Desc = Config.Get(Config.Type.Cfg_VIP_Desc).getValueByKey(fid);

        const str = UtilString.FormatArray(descConf.Desc, [count]);
        console.log(descConf);

        console.log(str);

        return str;
    }

    private value2IdNum(v: string): { id: number, num: number } {
        if (v === null || v.length <= 0) {
            return { id: 0, num: 0 };
        }
        const vs = v.split(':');
        if (vs.length < 2) {
            return { id: 0, num: 0 };
        }
        return { id: parseInt(vs[0]), num: parseInt(vs[1]) };
    }

    /** 红点 礼包领取情况 */
    public rewardCollectStatus(data: S2CVipInfo): void {
        this._dailyReward = data.DailyReward > 0;
        this._rankGift = data.LevelReward;
    }

    public updateLevelReward(lv: number): void {
        if (lv < 0 || lv > Max_SVip_Level) return;
        if (this._rankGift.indexOf(lv) === -1) {
            this._rankGift.push(lv);
        }
    }

    public get dailyReward(): boolean {
        return this._dailyReward;
    }

    private _rankGift: number[] = [];
    private _dailyReward = true;
    /** 更新每日礼包领取 */
    public updateDailyRewardState(): void {
        this._dailyReward = true;
        RedDotMgr.I.updateRedDot(RID.Vip.Vip.Svip.Daily, false);
    }

    // 红点
    public registerRedDotListen(): void {
        const info: IListenInfo = {
            ProtoId: [ProtoId.S2CVipInfo_ID, ProtoId.S2CVipDailyReward_ID, ProtoId.S2CVipLevelReward_ID],
            ProxyRid: [RID.Vip.Id],
            CheckVid: [ViewConst.VipWin],
            RoleAttr: [RoleAN.N.VipLevel, RoleAN.N.VipExp],
        };

        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            { rid: RID.Vip.Vip.Svip.Base, info },
        );
    }

    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.Vip.Id, this.funcRed, this);
        RedDotCheckMgr.I.on(RID.Vip.Vip.Svip.Base, this.funcAllRed, this);
    }

    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.Vip.Id, this.funcRed, this);
        RedDotCheckMgr.I.off(RID.Vip.Vip.Svip.Base, this.funcAllRed, this);
    }

    private funcRed(): boolean {
        if (RoleMgr.I.d.VipLevel > Max_Vip_Level) {
            const red1 = this.vipRed(RID.Vip.Vip.Vip);
            const red2 = this.svipRed(RID.Vip.Vip.Svip.Base);
            return red1 || red2;
        } else {
            return this.vipRed(RID.Vip.Vip.Vip);
        }
    }

    private funcAllRed(): void {
        if (RoleMgr.I.d.VipLevel > Max_Vip_Level) {
            this.vipRed(RID.Vip.Vip.Vip);
            this.svipRed(RID.Vip.Vip.Svip.Base);
        } else {
            this.vipRed(RID.Vip.Vip.Vip);
        }
    }

    public vipRed(id: number): boolean {
        for (let i = 1; i <= this.maxVipLv; i++) {
            if (this._rankGift.indexOf(i) === -1 && i <= RoleMgr.I.d.VipLevel) {
                return RedDotMgr.I.updateRedDot(id, true);
            }
        }
        return RedDotMgr.I.updateRedDot(id, false);
    }

    public svipRed(id: number): boolean {
        // 玩家不是svip则不处理 直接返回svip的红点为false
        if (RoleMgr.I.d.VipLevel <= Max_Vip_Level) {
            return false;
        }
        if (this.dailyRed()) {
            return RedDotMgr.I.updateRedDot(id, true);
        }
        for (let i = this.maxVipLv + 1; i <= this.maxSVipLv; i++) {
            if (this._rankGift.indexOf(i) === -1 && i <= RoleMgr.I.d.VipLevel) {
                return RedDotMgr.I.updateRedDot(id, true);
            }
        }
        return RedDotMgr.I.updateRedDot(id, false);
    }

    public dailyRed(): boolean {
        if (RoleMgr.I.d.VipLevel <= Max_Vip_Level) {
            // 未解锁svip 则每日奖励不存在
            return false;
        }
        return RedDotMgr.I.updateRedDot(RID.Vip.Vip.Svip.Daily, !this._dailyReward);
        // return !this._dailyReward;
    }

    /** 等级礼包是否有红点 */
    public itemHaveRed(lv: number): boolean {
        return this._rankGift.indexOf(lv) === -1 && lv <= RoleMgr.I.d.VipLevel;
    }

    /** 等级礼包是否领取 */
    public itemHaveGet(lv: number): boolean {
        return this._rankGift.indexOf(lv) > -1;
    }

    /** 默认选中项 */
    public defaultSelectIndex(isSvip: boolean = false): number {
        const lv = RoleMgr.I.d.VipLevel;
        const startIndex = isSvip ? Max_Vip_Level + 1 : 1;
        const endIndex = isSvip ? lv : lv > Max_Vip_Level ? Max_Vip_Level : lv;
        for (let i = startIndex; i <= endIndex; i++) {
            if (!this.itemHaveGet(i)) { // 有未领取的奖励
                if (isSvip) {
                    return i - 1 - Max_Vip_Level;
                } else {
                    return i - 1;
                }
            }
        }
        // 全部领取 则选中当前等级 + 1
        if (isSvip) {
            if (lv <= Max_Vip_Level) {
                return 0;
            } else if (lv >= Max_SVip_Level) {
                return Max_SVip_Level - Max_Vip_Level - 1;
            } else {
                return lv - Max_Vip_Level;
            }
        } else if (lv >= Max_Vip_Level) {
            return Max_Vip_Level - 1;
        } else {
            return lv;
        }
    }

    /** res路径处理 */
    public resTypePath(type: VIpResType): TopBannerNodeConfig {
        switch (type) {
            case VIpResType.Common:
                return { scale: 2, path: '' };
            case VIpResType.Skin:
                return { scale: 0.7, path: '' };
            case VIpResType.Horse:
            case VIpResType.Wing:
            case VIpResType.Weapon:
            case VIpResType.FaBao:
            case VIpResType.ZhanShen:
            case VIpResType.Avatar:
            case VIpResType.AvatarFrame:
            case VIpResType.ChatFrame:
            case VIpResType.FiendishPet:
                break;
            case VIpResType.Pet:
                return { scale: 0.7, path: '' };
            case VIpResType.Title: {
                return { scale: 0.7, path: '' };
            }
            default:
                break;
        }

        return { scale: 1, path: '' };
    }

    /**
     * 获取当前vip等级 各个模块的次数
     * 如果当前等级的为0 则顺序向下查找直到部位0
     */
    public getMinTimesCfg(type: EVipFuncType, lv?: number): { tip: string, vipLv: number } {
        let vipLv = lv || RoleMgr.I.d.VipLevel;
        if (vipLv > this.maxSVipLv) {
            // 最大值容错
            return { tip: '', vipLv };
        }
        const cfg = this.vipCfg(vipLv);
        const cfgV = cfg[type];
        if (!cfgV || cfgV.length === 0) {
            return this.getMinTimesCfg(type, ++vipLv);
        } else {
            const cfgTimes = cfgV.split(':')[1];
            if (Number(cfgTimes) <= 0) {
                return this.getMinTimesCfg(type, ++vipLv);
            } else {
                const tip = UtilString.FormatArray(i18n.tt(Lang.vip_buyTimes_tip), [cfg.VIPName]);
                return { tip, vipLv };
            }
        }
    }
}
