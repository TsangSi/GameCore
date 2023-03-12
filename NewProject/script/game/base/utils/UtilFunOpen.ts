/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/*
 * @Author: kexd
 * @Date: 2022-06-28 10:29:48
 * @FilePath: \SanGuo2.4\assets\script\game\base\utils\UtilFunOpen.ts
 * @Description: 功能是否开放 (有些数据还没有，需加上)
 */

import { Config } from '../config/Config';
import { RoleMgr } from '../../module/role/RoleMgr';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import MsgToastMgr from '../msgtoast/MsgToastMgr';
import { FuncId } from '../../const/FuncConst';
import { i18n, Lang } from '../../../i18n/i18n';
import ModelMgr from '../../manager/ModelMgr';
import { UtilString } from '../../../app/base/utils/UtilString';
import { ConfigIndexer } from '../config/indexer/ConfigIndexer';
import { ViewConst } from '../../const/ViewConst';
import { RID } from '../../module/reddot/RedDotConst';
import { RedDotMgr } from '../../module/reddot/RedDotMgr';
import { EventClient } from '../../../app/base/event/EventClient';
import { E } from '../../const/EventName';
import WinMgr from '../../../app/core/mvc/WinMgr';
import MapCfg from '../../map/MapCfg';
import GameApp from '../GameApp';

export default class UtilFunOpen {
    /** 开服天数 */
    public static serverDays: number = 0;

    /** 服务端已开放的功能id */
    private static _serverOpen: number[] = [];

    /** 新开放的功能id（需要是在功能预告里有才加到这里。用于显示标签‘新’） */
    private static _newFuncIds: number[] = [];

    /** 新开放的功能id（用于打开新功能开放界面） */
    private static _newFuncOpens: number[] = [];

    /** 服务端已经开放但未使用的功能 */
    private static _funcRedList: number[] = [];

    public static getServerOpen(): number[] {
        return UtilFunOpen._serverOpen;
    }

    /** 登录后端就推送下来的已开放的功能id列表 */
    public static SetServerOpen(data: number[]): void {
        UtilFunOpen._serverOpen = data;
        // console.log('已开放的功能id：', data);
        EventClient.I.emit(E.FuncPreview.FuncOpenInit);
    }

    /**
     * 更新功能开启。非战斗&&在野外&&没有打开结算就直接弹
     * @param data
     */
    public static UptServerOpen(data: number[]): void {
        // console.log('更新功能开启: ', data);
        if (data && data.length > 0) {
            const newOpen: number[] = [];
            for (let i = 0; i < data.length; i++) {
                const index = UtilFunOpen._serverOpen.indexOf(data[i]);
                if (index < 0) {
                    UtilFunOpen._serverOpen.push(data[i]);
                    if (ModelMgr.I.FuncPreviewModel.isFuncPreview(data[i])) {
                        newOpen.push(data[i]);
                    }
                }
            }
            if (newOpen.length > 0) {
                this.SetNewFuncIds(newOpen);
                EventClient.I.emit(E.FuncPreview.FuncOpenUpt, newOpen);

                // console.log('-----------------新功能开启: ', newOpen, GameApp.I.IsBattleIng, MapCfg.I.isYeWai, WinMgr.I.checkIsOpen(ViewConst.BattleSettleWin));

                this.SetNewFuncOpens(newOpen);
                // 非战斗&&在野外&&没有打开结算就直接弹
                if (!GameApp.I.IsBattleIng && MapCfg.I.isYeWai && !WinMgr.I.checkIsOpen(ViewConst.BattleSettleWin)) {
                    // console.log('-----------------可直接弹窗: ', newOpen);
                    this.checkOpenFuncPreview();
                }
            }
        }
    }

    /** 新功能开放的列表-用于打开新功能界面 */
    public static SetNewFuncOpens(funcIds: number[]): void {
        for (let i = 0; i < funcIds.length; i++) {
            if (this._newFuncOpens.indexOf(funcIds[i]) < 0) {
                this._newFuncOpens.push(funcIds[i]);
            }
        }
    }

    public static ClearNewFuncOpen(): void {
        this._newFuncOpens = [];
    }

    /** 读取新功能开放未打开的功能id-用于打开新功能界面 */
    public static GetNewFuncOpens(): number[] {
        return this._newFuncOpens;
    }

    public static HasNewFuncOpens(): boolean {
        return this._newFuncOpens.length > 0;
    }

    /** 打开功能开启界面 */
    public static checkOpenFuncPreview() {
        const newFuncOpens: number[] = UtilFunOpen.GetNewFuncOpens();
        if (!newFuncOpens || !newFuncOpens.length) return;
        // 修改触发条件（原来在UptServerOpen）
        EventClient.I.emit(E.FuncPreview.FuncOpenNew, this._newFuncIds);

        console.log('回到野外并且没有打开任何界面，检查有要打开的新功能界面', newFuncOpens);

        for (let i = 0; i < newFuncOpens.length; i++) {
            WinMgr.I.open(ViewConst.FuncOpenWin, newFuncOpens[i]);
        }
        UtilFunOpen.ClearNewFuncOpen();
    }

    /** 新功能开放的列表-用于‘新’标签 */
    public static SetNewFuncIds(funcIds: number[]): void {
        for (let i = 0; i < funcIds.length; i++) {
            if (this._newFuncIds.indexOf(funcIds[i]) < 0) {
                this._newFuncIds.push(funcIds[i]);
            }
        }
    }

    /** 读取新功能开放的列表-用于‘新’标签 */
    public static GetNewFuncIds(): number[] {
        return this._newFuncIds;
    }

    public static IsNewMark(funcId: number): boolean {
        return this._newFuncIds.indexOf(funcId) >= 0;
    }

    /** 不管是一级页签还是二级页签还是普通按钮，点击了就去检测是否是新开功能id */
    public static CheckClick(funcId: number): void {
        if (!funcId) return;
        if (!this._newFuncIds || this._newFuncIds.length === 0) return;
        //
        const index: number = this._newFuncIds.indexOf(funcId);
        if (index < 0) return;
        this._newFuncIds.splice(index, 1);
        // 触发再次检测‘新’标签
        EventClient.I.emit(E.FuncPreview.FuncOpenDel, funcId);
    }

    public static SetFuncRedList(data: number[]): void {
        UtilFunOpen._funcRedList = data;

        this._serverOpen.forEach((e) => {
            if (data.indexOf(e) > -1) {
                // 已经使用过功能
            } else {
                UtilFunOpen.updateFuncRed(e, true);
            }
        });
    }

    public static UpdFuncRedList(): void {
        const data = UtilFunOpen._funcRedList;
        this._serverOpen.forEach((e) => {
            if (data.indexOf(e) > -1) {
                // 已经使用过功能
            } else {
                UtilFunOpen.updateFuncRed(e, true);
            }
        });
    }

    /**
     * 功能开启红点
     */
    private static updateFuncRed(funcId: number, state: boolean): void {
        switch (funcId) {
            case FuncId.Friend:
                RedDotMgr.I.updateRedDot(RID.More.Friend.Func, state);
                break;

            default:
                break;
        }
    }

    public static addFuncRed(funcId: number): void {
        this._funcRedList.push(funcId);
        this.updateFuncRed(funcId, false);
    }

    /**
     * 是否已经使用过
     * @param funcId 功能id
     * @returns true : 使用过 false：未使用过
     */
    public static GetFuncUsed(funcId: number): boolean {
        return this._funcRedList.indexOf(funcId) > -1;
    }

    private static _CfgClientFunc: ConfigIndexer;
    private static get CfgClientFunc(): ConfigIndexer {
        if (!this._CfgClientFunc) {
            this._CfgClientFunc = Config.Get(Config.Type.Cfg_Client_Func);
        }
        return this._CfgClientFunc;
    }

    /** 获取功能表配置 */
    public static getFuncCfg(funcId: number): Cfg_Client_Func {
        if (!funcId) return null;
        const ccf: Cfg_Client_Func = UtilFunOpen.CfgClientFunc.getValueByKey(funcId);
        if (!ccf) {
            console.log('UtilFunOpen, funcId, null', funcId);
            return null;
        }
        return ccf;
    }

    /**
     * 功能入口显示与否一般用这个(因为入口的显示有个特别的需求是，功能还没开放，但是想提前开放入口)
     * @param funcId
     * @returns
     */
    public static canShow(funcId: number): boolean {
        if (!funcId) return true;
        const ccf: Cfg_Client_Func = UtilFunOpen.getFuncCfg(funcId);
        if (!ccf) {
            return false;
        }
        // 填成 - 1时，该功能入口就根据功能开启的条件来同步显示功能入口
        if (ccf.ShowLv === -1) {
            return this.isOpen(funcId);
        }
        // 否则根据等级和通关来决定
        return RoleMgr.I.getLevel() >= ccf.ShowLv && RoleMgr.I.d.Stage >= ccf.ShowStage;
    }

    /**
     * 判断功能是否开放，若没开放，可弹出提示
     * @param funcId 功能id
     * @param showMsg 是否弹提示
     * @returns
     */
    public static isOpen(funcId: FuncId, showMsg: boolean = false): boolean {
        // 添加是活动的识别
        if (funcId >= ViewConst.ActivityWin) {
            return ModelMgr.I.ActivityModel.isOpen(funcId, showMsg);
        }
        const msg = UtilFunOpen.getLimitMsg(funcId, showMsg);
        if (!!msg && showMsg) {
            MsgToastMgr.Show(msg);
        }
        const res = !msg;
        // console.log('开启信息', funcId, res);

        return res;
    }

    /**
     * 获取功能是否开启的提示（因有些地方只需要获取功能开放的提示语，这里独立接口）
     * @param funcId 功能id
     */
    public static getLimitMsg(funcId: number, showMsg: boolean = false): string {
        const ccf: Cfg_Client_Func = UtilFunOpen.getFuncCfg(funcId);
        if (!ccf) {
            return '';
        }

        let canOpen = true;
        let msg = '';

        // 如果服务端告知已经开启，就直接返回 true
        if (UtilFunOpen._serverOpen.indexOf(funcId) >= 0) {
            // console.log('服务端告知已经开启:', funcId);
            return '';
        }

        // 合服天数还没有
        // if (Game.I.MergeServerOpenAge < ccf.MergeDay) {
        //     canOpen = false;
        //     if (showMsg) msg += `合服${ccf.LimitDay}天`;
        // }

        // 开服天数（合服天数、连区时间天数）
        const dayLimit = UtilFunOpen.serDayLimit(funcId);
        if (dayLimit) {
            canOpen = false;
            if (showMsg) msg += UtilString.FormatArray(i18n.tt(Lang.open_server), [ccf.LimitDay]);
        }

        // 人物的属性：等级、军衔阶、军衔级 条件
        const roleLv = RoleMgr.I.getLevel();
        const armyLv = RoleMgr.I.getArmyLevel();
        const armyStar = RoleMgr.I.getArmyStar();
        const lvLimit = armyLv < ccf.ArmyLevel || (armyLv === ccf.ArmyLevel && armyStar < ccf.ArmyStar) || roleLv < ccf.LimitLv;

        if (dayLimit && lvLimit && showMsg) {
            msg += i18n.tt(Lang.open_and);
        }
        if (lvLimit) {
            canOpen = false;
            if (showMsg) {
                let flag: boolean = false;
                if (armyLv < ccf.ArmyLevel || (armyLv === ccf.ArmyLevel && armyStar < ccf.ArmyStar)) {
                    const armyCfg: Cfg_ArmyName = Config.Get(Config.Type.Cfg_ArmyName).getValueByKey(ccf.ArmyLevel);
                    msg += UtilString.FormatArray(i18n.tt(Lang.open_junxian), [`${i18n.tt(Lang.com_brack_l)}${armyCfg.ArmyName}${i18n.tt(Lang.com_brack_r)}`, ccf.ArmyStar]);
                    flag = true;
                }
                if (roleLv < ccf.LimitLv) {
                    if (flag) {
                        msg += i18n.tt(Lang.open_and);
                    }
                    msg += UtilString.FormatArray(i18n.tt(Lang.open_lv), [ccf.LimitLv]);
                }
            }
        }

        // 通关多少关的条件
        if (canOpen && ccf.LimitStage) {
            if (RoleMgr.I.d.Stage - 1 < ccf.LimitStage) {
                canOpen = false;
                const info = ModelMgr.I.GameLevelModel.getChapterMsg(ccf.LimitStage);
                if (showMsg) msg += `${i18n.tt(Lang.open_guanka)}${info.chapter}-${info.level}`;
            }
        }

        // vip条件
        if (canOpen && ccf.LimitVIP && ccf.LimitVIP > RoleMgr.I.d.VipLevel) {
            canOpen = false;
            if (showMsg) {
                if (ccf.LimitVIP > 10) {
                    msg += `${i18n.tt(Lang.open_svip)}${ccf.LimitVIP - 10}`;
                } else {
                    msg += `${i18n.tt(Lang.open_vip)}${ccf.LimitVIP}`;
                }
            }
        }

        // 完成主线任务
        // if (canOpen && ccf.LimitTask && RoleMgr.I.d.HistoryTaskId <= ccf.LimitTask) {
        //     canOpen = false;
        //     if (showMsg) msg += `完成${ccf.LimitTask}个主线任务`;
        // }

        // 月卡条件：是否过期
        if (canOpen && ccf.MontyCard && UtilTime.NowSec() > RoleMgr.I.d.MonthCard) {
            canOpen = false;
            if (showMsg) msg += i18n.tt(Lang.open_MonthCard);
        }

        // 终身卡条件：人物是否有终身卡
        // if (canOpen && ccf.LifeCard && !RoleMgr.I.d.LifeCard) {
        //     canOpen = false;
        //     if (showMsg) msg += '激活至尊卡';
        // }

        // 官职达到xx
        if (canOpen && ccf.OfficialLv && RoleMgr.I.d.OfficeLevel < ccf.OfficialLv) {
            canOpen = false;
            const inf = ModelMgr.I.RoleOfficeModel.getOfficialInfo(ccf.OfficialLv);
            if (showMsg) msg += UtilString.FormatArray(i18n.tt(Lang.open_official), [`${inf.name1}•${inf.name2}`]);
        }

        // 充值满xx元
        if (canOpen && ccf.LimitMoney && RoleMgr.I.d.Recharge < ccf.LimitMoney) {
            canOpen = false;
            if (showMsg) msg += UtilString.FormatArray(i18n.tt(Lang.open_recharge), [ccf.LimitMoney]);
        }

        // 飞升条件 待添加
        // toadd

        if (showMsg) msg += i18n.tt(Lang.open_open);
        if (!canOpen) {
            return showMsg ? msg : i18n.tt(Lang.open_unopen);
        }
        return '';
    }

    /**
     * 功能开启描述条件
     * @param funcId 功能id
     * @param condition 条件
     * @param cfg 表
     * @param isCut 是否精简文字
     * @returns
     */
    public static getConditionDesc(funcId: number, condition: string, isCut?: boolean): string {
        if (!funcId) return '';
        const ccf: Cfg_Client_Func = Config.Get(Config.Type.Cfg_Client_Func).getValueByKey(funcId);
        if (!ccf) return '';

        let desc: string = '';
        switch (condition) {
            case 'LimitDay': // 开服天数
                {
                    const dayLimit = UtilFunOpen.serDayLimit(funcId);
                    if (dayLimit) {
                        desc = UtilString.FormatArray(i18n.tt(Lang.open_server), [ccf.LimitDay]);
                    }
                }
                break;
            case 'LimitLv': // 等级
                {
                    const roleLv = RoleMgr.I.getLevel();
                    if (roleLv < ccf.LimitLv) {
                        desc = UtilString.FormatArray(i18n.tt(Lang.func_open_lv), [ccf.LimitLv]);
                    }
                }
                break;
            case 'Army':
            case 'ArmyLevel':
            case 'ArmyStar': // 军衔
                {
                    const armyLv = RoleMgr.I.getArmyLevel();
                    const armyStar = RoleMgr.I.getArmyStar();
                    if (armyLv < ccf.ArmyLevel || (armyLv === ccf.ArmyLevel && armyStar < ccf.ArmyStar)) {
                        const armyCfg: Cfg_ArmyName = Config.Get(Config.Type.Cfg_ArmyName).getValueByKey(ccf.ArmyLevel);
                        if (isCut) {
                            desc = `${armyCfg.ArmyName}${ccf.ArmyStar}${i18n.lv}`;
                        } else {
                            desc = UtilString.FormatArray(i18n.tt(Lang.func_open_junxian), [armyCfg.ArmyName, ccf.ArmyStar]);
                        }
                    }
                }
                break;
            case 'LimitStage': // 关卡
                if (ccf.LimitStage) {
                    if (RoleMgr.I.d.Stage - 1 < ccf.LimitStage) {
                        const info = ModelMgr.I.GameLevelModel.getChapterMsg(ccf.LimitStage);
                        desc = `${i18n.tt(Lang.open_guanka)}${info.chapter}-${info.level}`;
                    }
                }
                break;
            case 'LimitVIP': // Vip
                if (ccf.LimitVIP && ccf.LimitVIP > RoleMgr.I.d.VipLevel) {
                    if (ccf.LimitVIP > 10) {
                        desc = `${i18n.tt(Lang.open_svip)}${ccf.LimitVIP - 10}`;
                    } else {
                        desc = `${i18n.tt(Lang.open_vip)}${ccf.LimitVIP}`;
                    }
                }
                break;
            case 'MontyCard': // 月卡
                if (ccf.MontyCard && UtilTime.NowSec() > RoleMgr.I.d.MonthCard) {
                    desc = i18n.tt(Lang.open_MonthCard);
                }
                break;
            case 'LifeCard': // 终身卡 还没有
                break;
            case 'OfficialLv': // 官职
                if (ccf.OfficialLv && RoleMgr.I.d.OfficeLevel < ccf.OfficialLv) {
                    const inf = ModelMgr.I.RoleOfficeModel.getOfficialInfo(ccf.OfficialLv);
                    if (isCut) {
                        desc = `${inf.name1}•${inf.name2}`;
                    } else {
                        desc = UtilString.FormatArray(i18n.tt(Lang.func_open_official), [`${inf.name1}•${inf.name2}`]);
                    }
                }
                break;
            case 'LimitMoney': // 充值
                if (ccf.LimitMoney && RoleMgr.I.d.Recharge < ccf.LimitMoney) {
                    desc = UtilString.FormatArray(i18n.tt(Lang.func_open_recharge), [ccf.LimitMoney]);
                }
                break;
            default:
                break;
        }
        return desc;
    }

    /**
     * 功能开启 天数判断
     * 如果配置中LimitUnionDay==1则按照连服开发天数判断
     * 否则按照本服开发天数判断
     * @param funcId 功能id
     * @param cfg 若已知数据就传进来减少获取数据的消耗
     * @returns
     */
    public static serDayLimit(funcId: number, cfg?: Cfg_Client_Func): boolean {
        let limit = true;
        let ccf: Cfg_Client_Func;
        if (cfg) {
            ccf = cfg;
        } else {
            ccf = Config.Get(Config.Type.Cfg_Client_Func).getValueByKey(funcId);
        }

        if (ccf) {
            const openDay = UtilFunOpen.getSerOpenDay(funcId, ccf);
            limit = openDay < ccf.LimitDay;
        }

        return limit;
    }

    /**
     * 根据合服状态 获取开服天数
     * @param funcId 功能id
     * @param cfg 若已知数据就传进来减少获取数据的消耗
     * @returns
     */
    public static getSerOpenDay(funcId: number, cfg?: Cfg_Client_Func): number {
        const serverDay = UtilFunOpen.serverDays;// 本服开服天数
        const uSerDay = 0;// Game.I.UnionServerOpenAge;// 连区时间天数
        const mSerDay = 0;// Game.I.MergeServerOpenAge;// 合服开服天数
        let ccf: Cfg_Client_Func;
        if (cfg) {
            ccf = cfg;
        } else {
            ccf = Config.Get(Config.Type.Cfg_Client_Func).getValueByKey(funcId);
        }
        let openDay: number = 0;
        if (ccf && ccf.LimitUnionDay === 1) { // 合服后，开服天数是否以连服首区天数为准0或不填否   1是
            if (mSerDay > 0) {
                openDay = uSerDay;
            } else {
                openDay = serverDay;
            }
        } else {
            openDay = serverDay;
        }
        return openDay;
    }

    // 键 => { 超时时间， 值}
    // private static keyValue: { [key: string]: { outTime: number, value: any } } = {};
    // public static setSave(value: any, keepTime: number, ...param):void {
    //     const key = param.join('_');
    //     const now = new Date().getTime();
    //     this.keyValue[key] = { outTime: keepTime ? now + keepTime : 0, value };
    // }
    // public static getSave(...param):any {
    //     const key = param.join('_');
    //     const valueObj = this.keyValue[key];
    //     if (valueObj) {
    //         const now = new Date().getTime();
    //         if (valueObj.outTime === 0 || now < valueObj.outTime) { // 永久 || 未超时
    //             return valueObj.value;
    //         } else { // 超时 清理
    //             delete this.keyValue[key];
    //         }
    //     }
    //     return null;
    // }

    /** 获取功能名 */
    public static getDesc(funcId: number): string {
        const ccf: Cfg_Client_Func = UtilFunOpen.getFuncCfg(funcId);
        if (!ccf) {
            return '';
        }
        return ccf.Desc;
    }
}
