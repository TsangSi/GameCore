/*
 * @Author: kexd
 * @Date: 2022-08-29 10:08:44
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\ActivityConst.ts
 * @Description:
 */

import { UI_PATH_ENUM } from '../../const/UIPath';

export class ActData {
    /** 活动的功能id */
    public FuncId: number;
    /** 期号 */
    public CycNo: number;
    public State: number;
    public ReadyTime: number;
    public StartTime: number;
    public EndTime: number;
    public CloseTime: number;
    public EndDate: number;
    public Session: number;
    public RewardSession: number;
    public Red: number;
    /** 活动配置数据 */
    public Config: Cfg_Server_Activity;

    public constructor(info?: PlayerActData) {
        if (info) {
            this.FuncId = info.FuncId;
            this.CycNo = info.CycNo;
            this.State = info.State;
            this.ReadyTime = info.ReadyTime;
            this.StartTime = info.StartTime;
            this.EndTime = info.EndTime;
            this.CloseTime = info.CloseTime;
            this.EndDate = info.EndDate;
            this.Session = info.Session;
            this.RewardSession = info.RewardSession;
            this.Red = info.Red;

            this.Config = JSON.parse(info.Config) as Cfg_Server_Activity;
            this.CycNo = this.Config.CycNo;
        }
    }
}

export const enum EActivityCfgState {
    /** 不是在请求中 */
    None = 0,
    /** 请求中 */
    Reqing = 1,
}

/** 活动表里的ActType对应的界面类 */
export const ActivityClassName: { [key: number]: string; } = {
    /** 每日签到 */
    101: 'DaySignPage',
    /** 摇钱树 */
    102: 'CashCowPage',
    /** 王者宝藏 */
    304: 'GamePassWin',
    /** 武将招募 */
    1001: 'GeneralRecruitPage',
    // /** 酒馆仓库 */
    201: 'GeneralStorePage',
    /** 在线奖励 */
    301: 'OnlineRewardPage',
    /** 等级、战力等奖励 */
    302: 'StageRewardPage',
    /** 等级战力通行证 */
    303: 'GeneralPassPage',
    /** 激活码 */
    1002: 'CdKeyPage',
    /** 往下补充 */
};

/** 活动表里的ActType对应的预制 */
export const ActivityPrefab: { [key: number]: string; } = {
    /** 每日签到 */
    101: UI_PATH_ENUM.DaySigPage,
    /** 摇钱树 */
    102: UI_PATH_ENUM.CashCowPage,
    /** 王者宝藏 */
    304: UI_PATH_ENUM.GamePassWin,
    /** 武将招募 */
    1001: UI_PATH_ENUM.GeneralRecruitPage,
    /** 酒馆仓库 */
    201: UI_PATH_ENUM.GeneralStorePage,
    /** 在线奖励 */
    301: UI_PATH_ENUM.OnlineRewardPage,
    /** 等级、战力等奖励 */
    302: UI_PATH_ENUM.StageRewardPage,
    /** 等级战力通行证 */
    303: UI_PATH_ENUM.GeneralPassPage,
    /** 激活码 */
    1002: UI_PATH_ENUM.CdKeyPage,
    /** 往下补充 */
};
