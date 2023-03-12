import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigDropRewardIndexer } from '../../base/config/indexer/ConfigDropRewardIndexer';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import UtilItem from '../../base/utils/UtilItem';
import ItemModel from '../../com/item/ItemModel';
import { RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { RoleMgr } from '../role/RoleMgr';
import { ArenaConstEnum, ArenaResultTypeEnum } from './ArenaConst';
import { FuncId } from '../../const/FuncConst';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import ModelMgr from '../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

interface IArenaResultParma {
    /** 变化之前的排名 */
    rankS?: number,
    /** 变化之后的排名 */
    rankE?: number,
    /** 记录的历史最高排名 */
    historyHeighRank?: number,
    /** 变化之后的最高历史排名 */
    newHeighRank?: number,
    // /** 扫荡次数 */
    // sweepTimes?:number
}

@ccclass('ArenaModel')
export class ArenaModel extends BaseModel {
    public clearAll(): void {
        //
    }

    public updateRed(): void {
        RedDotMgr.I.updateRedDot(RID.Arena.Arena, this.roleChallengeTimes() > 0 && UtilFunOpen.isOpen(FuncId.Arena));
    }

    public roleVipLevel(): string {
        return ModelMgr.I.VipModel.getVipName(RoleMgr.I.d.VipLevel);
    }

    /** 用户剩余挑战次数 */
    public roleChallengeTimes(): number {
        return RoleMgr.I.d.ArenaTimes;
    }

    /** 记录用户已经购买的挑战次数 */
    public roleHaveBuyTimes(): number {
        return RoleMgr.I.d.ArenaBuyTimes;
    }

    /** 刷新点击cd */
    public getRefreshCd(): number {
        return 5;
    }

    /** 竞技场恢复次数cd时间 */
    public getCdCfg(): number {
        const cd = this.getChallengeConstCfg(ArenaConstEnum.Cd).CfgValue;
        return Number(cd);
    }

    /** 最大回合数 */
    public getMaxRoundCfg(): number {
        const maxRound = this.getChallengeConstCfg(ArenaConstEnum.MaxRound).CfgValue;
        return Number(maxRound);
    }

    /** 竞技场次数常量 */
    public getChallengeTimesCfg(): number {
        const times: Cfg_Config_Arena = this.getChallengeConstCfg(ArenaConstEnum.Times);
        return Number(times.CfgValue);
    }

    /** 获取竞技场常量 */
    private getChallengeConstCfg(key: string): Cfg_Config_Arena {
        const configIndexer: ConfigIndexer = Config.Get(Config.Type.Cfg_Config_Arena);
        const config: Cfg_Config_Arena = configIndexer.getValueByKey(key);
        return config;
    }

    /** 获取购买次数消耗配置 */
    public getBuyTimesConfig(times: number): { type: number, num: number } {
        const configIndexer: ConfigIndexer = Config.Get(Config.Type.Cfg_ArenaCoin);
        let config: Cfg_ArenaCoin = configIndexer.getValueByKey(times);
        if (!config) {
            // 最大次数之后 该数据将不会增加
            config = configIndexer.getValueByKey(times - 1);
        }
        const _tp = config.Coin.split(':');
        return { type: Number(_tp[0]), num: Number(_tp[1]) };
    }

    /** 获取vip表中可购买次数（竞技场） */
    public configBuyTimes(): number {
        // vip等级从1开始
        const vip = RoleMgr.I.d.VipLevel < 1 ? 1 : RoleMgr.I.d.VipLevel;
        const config: Cfg_VIP = Config.Get(Config.Type.Cfg_VIP).getValueByKey(vip);
        const jccTime = config.ArenaTimes.split(':')[1];
        const num = Number(jccTime);
        return num;
    }

    public roleNextAddTime(): number {
        return 1570;
    }

    /** 获取战斗奖励配置 */
    public getRewardConfig(groupId: number): Cfg_DropReward {
        // 获取开服天数
        const configIndexer: ConfigDropRewardIndexer = Config.Get(Config.Type.Cfg_DropReward);
        const dropReward: Cfg_DropReward = configIndexer.getValueByDay(groupId);
        return dropReward;
    }

    /** 获取常量失败功勋 */
    private getFailCoin(): ItemModel {
        const cfg = this.getChallengeConstCfg(ArenaConstEnum.LoseRewards).CfgValue;
        const itemCfg = cfg.split(':');
        const itemId = Number(itemCfg[0]);
        const itemNum = Number(itemCfg[1]);
        return UtilItem.NewItemModel(itemId, itemNum);
    }

    /** 获取常量胜利功勋 */
    private getVictoryCoin(times: number = 1) {
        times = times || 1;
        const cfg = this.getChallengeConstCfg(ArenaConstEnum.WinRewards).CfgValue;
        const itemCfg = cfg.split(':');
        const itemId = Number(itemCfg[0]);
        const itemNum = Number(itemCfg[1]);
        return UtilItem.NewItemModel(itemId, itemNum * times); // 胜利情况需要计算排名变化差值
    }

    /** 获取金币 */
    private getSilver(range: number) {
        const cfg = this.getChallengeConstCfg(ArenaConstEnum.RankReward).CfgValue;
        const itemCfg = cfg.split(':');
        const itemId = Number(itemCfg[0]);
        const itemNum = Number(itemCfg[1]);
        return UtilItem.NewItemModel(itemId, itemNum * range);
    }
    /**
    * 战斗胜利  1，排名未变化 奖励为功勋（在常量表中读取）
    *          2，排名变化
    *           2.1 最高排名未变化 奖励为功勋（在常量表中读取）+ 变化差值* 银两（在常量表中读取）
    *           2.2 最高排名变化 奖励为功勋（在常量表中读取）+ 最高排名变化奖励+ 变化差值* 银两（在常量表中读取）
    * 战斗失败 1，奖励为功勋（在常量表中读取）
    * 扫荡 ：次数 * 功勋（在常量表中读取）
    */
    /**
    *
    * @param result 结果类型 1 胜利 ， 0失败
    * @param param  排名信息
    * @returns 奖励内容
    */
    public arenaResult(result: ArenaResultTypeEnum, param: IArenaResultParma): ItemModel[] {
        switch (result) {
            case 1:
                if (param.rankS === param.rankE) {
                    const item = this.getVictoryCoin();
                    return [item];
                } else if (param.historyHeighRank === param.newHeighRank) {
                    const item0 = this.getSilver(param.rankS - param.rankE);
                    const item = this.getVictoryCoin();
                    return [item0, item];
                } else {
                    const item0 = this.getSilver(param.rankS - param.rankE);
                    const item = this.getVictoryCoin();
                    const rewards = [item0, item];
                    const rewardMap = this.historyHighestRank(param.newHeighRank, param.historyHeighRank);
                    // map遍历
                    for (const iterator of rewardMap) {
                        const item1 = UtilItem.NewItemModel(iterator[0], iterator[1]);
                        rewards.push(item1);
                    }
                    return rewards;
                }
            case -1:
            case 0: // 失败
                return [this.getFailCoin()];
            case 2: // 扫荡
                /** 扫荡直接消耗掉所有的剩余次数 */
                return [this.getVictoryCoin(this.roleChallengeTimes())];

            default:
                return [];
        }
    }

    public historyHighestRank(minRank: number, maxRank: number): Map<number, number> {
        const configIndexer: ConfigIndexer = Config.Get(Config.Type.Cfg_ArenaCoinRewards);
        const configLength = configIndexer.keysLength;
        // 根据跨度来求和计算
        let minR = 0; // index值
        let maxR = 0; // index值
        const reward: Map<number, number> = new Map();
        for (let i = 0; i < configLength; i++) {
            const cfg: Cfg_ArenaCoinRewards = configIndexer.getValueByIndex(i);
            const max = cfg.RankMax;
            const min = cfg.RankMin;
            if (minRank <= max && minRank >= min) {
                // 找到起始点
                minR = i;
            }
            if (maxRank <= max && maxRank >= min) {
                // 找到结束点
                maxR = i;
            }
        }

        if (minR === maxR) {
            const cfg: Cfg_ArenaCoinRewards = configIndexer.getValueByIndex(minR);
            const coinCfg = cfg.Rewards.split(':');
            const coinNum = Number(coinCfg[1]);
            const coinType = Number(coinCfg[0]);
            reward.set(coinType, (maxRank - minRank) * coinNum);
        } else {
            for (let j = minR; j <= maxR; j++) {
                const cfg: Cfg_ArenaCoinRewards = configIndexer.getValueByIndex(j);
                const max = cfg.RankMax;
                const min = cfg.RankMin;
                const coinCfg = cfg.Rewards.split(':');
                const coinNum = Number(coinCfg[1]);
                const coinType = Number(coinCfg[0]);
                if (j === minR) {
                    let v = reward.get(coinType) || 0;
                    v += (max - minRank) * coinNum;
                    reward.set(coinType, v);
                }
                if (j === maxR) {
                    let v = reward.get(coinType) || 0;
                    v += (maxRank - min) * coinNum;
                    reward.set(coinType, v);
                }
                if (j > minR && j < maxR) {
                    let v = reward.get(coinType) || 0;
                    v += (max - min) * coinNum;
                    reward.set(coinType, v);
                }
            }
        }
        return reward;
    }

    /** ************排行榜************ */
    private _rankListData: ArenaRankData[] = [];
    private _myRank: number = 20000;

    public set myRank(v: number) {
        this._myRank = v;
    }

    public get myRank(): number {
        return this._myRank;
    }

    public set rankListData(data: ArenaRankData[]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const nData = data.sort((a, b) => Number(a.Rank) - Number(b.Rank));
        this._rankListData = nData;
    }

    public get rankListData(): ArenaRankData[] {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._rankListData;
    }

    /** ********************接口数据相关********************** */
    private _rankList: any[] = [];
    public set rankList(data: any[]) {
        this._rankList = data;
    }

    public get rankList(): any[] {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._rankList;
    }

    private _challengeData: ArenaRole[] = [];
    public set challengeData(v: ArenaRole[]) {
        this._challengeData = v;
    }

    public get challengeData(): ArenaRole[] {
        return this._challengeData;
    }

    private _refreshTime = 5;
    public set refreshTime(v: number) {
        this._refreshTime = v;
    }

    public get refreshTime(): number {
        return this._refreshTime;
    }
}
