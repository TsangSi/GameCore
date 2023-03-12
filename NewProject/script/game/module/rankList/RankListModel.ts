/*
 * @Author: wangxin
 * @Date: 2022-10-11 10:44:24
 * @FilePath: \SanGuo2.4\assets\script\game\module\rankList\RankListModel.ts
 */

import { data } from '../../../../resources/i18n/en-US';
import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { E } from '../../const/EventName';
import ControllerMgr from '../../manager/ControllerMgr';
import { ERankParam, ERankType } from './RankListConst';

const { ccclass } = cc._decorator;

@ccclass('RankListModel')
export class RankListModel extends BaseModel {
    // eslint-disable-next-line max-len
    private RankNameId: number[] = [ERankParam.BattleValue, ERankParam.Equip, ERankParam.Level, ERankParam.General, ERankParam.Office, ERankParam.Army, ERankParam.Horse, ERankParam.Waepon, ERankParam.Wing];
    /** 本服榜数据Map */
    private RankDataListLocal: Map<number, S2CGetRankData> = new Map();
    /** 跨服榜数据Map */
    private RankDataListMore: Map<number, S2CGetRankData> = new Map();
    public clearAll(): void {
        //
    }

    protected start(): void {
        // start
        console.log('排行榜model start');
    }

    // 清理数据
    public cleanData(): void {
        this.RankDataListMore.clear();
        this.RankDataListLocal.clear();
    }

    /** 获取排行榜常量 */
    public getNormalRankCfg(CfgKey: string): Cfg_NormalRank_Config {
        // const index = Config.Get(ConfigConst.c)
        const indexer = Config.Get(Config.Type.Cfg_NormalRankConfig);
        const NormalRankData: Cfg_NormalRank_Config = indexer.getValueByKey(CfgKey);
        return NormalRankData;
    }

    /** 排行榜类型和名称映射 */
    public getRankListIdOfName(rankType: number): { Param: number[], Name: string[], Desc: string[] } {
        const indexer = Config.Get(Config.Type.Cfg_NormalRankType);
        const NameArry: { Param: number[], Name: string[], Desc: string[] } = { Param: [], Name: [], Desc: [] };
        indexer.forEach((v: Cfg_NormalRankType) => {
            // 判断功能是否开启
            if (UtilFunOpen.isOpen(v.FuncId)) {
                if (v.RankType === rankType) {
                    NameArry.Param.push(v.Param);
                    NameArry.Name.push(v.Name);
                    NameArry.Desc.push(v.Desc1);
                }
            }
            return true;
        });
        return NameArry;
    }

    /** 获取常驻排行榜 */
    public getNormalRank(): Cfg_NormalRank[] {
        // const index = Config.Get(ConfigConst.c)
        const indexer = Config.Get(Config.Type.Cfg_NormalRank);
        const NormalRankData: Cfg_NormalRank[] = [];
        indexer.forEach((v: Cfg_NormalRank) => {
            NormalRankData.push(v);
            return true;
        });
        return NormalRankData;
    }

    /** 设置排行榜Map数据 */
    public setRankDataMap(data: S2CGetRankData): void {
        if (data.RankType === ERankType.Local) {
            this.RankDataListLocal.set(data.Param, data);
        }
        if (data.RankType === ERankType.More) {
            this.RankDataListMore.set(data.Param, data);
        }
    }

    /** 根据排行榜id获取数据 */
    public getRankListOfParam(rankParam: number, RankType: ERankType): S2CGetRankData {
        if (RankType === ERankType.Local) {
            // if (!this.RankDataListLocal.get(rankParam)) {
            //     ControllerMgr.I.RankListController.getRankData(ERankType.Local, rankParam);
            // }
            return this.RankDataListLocal.get(rankParam);
        } else {
            return this.RankDataListMore.get(rankParam);
        }
    }
}
