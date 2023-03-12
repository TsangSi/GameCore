/*
 * @Author: myl
 * @Date: 2022-09-15 16:51:10
 * @Description:
 */
import { UtilArray } from '../../../../app/base/utils/UtilArray';
import { RoleMgr } from '../../../module/role/RoleMgr';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass, property } = cc._decorator;

@ccclass('ConfigPassLevelIndexer')
export class ConfigPassLevelIndexer extends ConfigIndexer {
    private static _i: ConfigPassLevelIndexer = null;
    public static get I(): ConfigPassLevelIndexer {
        if (!this._i) {
            this._i = new ConfigPassLevelIndexer(ConfigConst.Cfg_Stage_PassLevel);
        }
        return this._i;
    }

    /** 包含所有的关卡数据 */
    private bigPrizeStages: number[] = [];
    private bigPrizeIndexs: number[] = [];
    protected walk(data: Cfg_Stage_PassLevel, index: number): void {
        if (data.ShowBigPrize) {
            const pos = UtilArray.Insert(this.bigPrizeStages, data.MaxStageNum) as number;
            this.bigPrizeIndexs[pos] = index;
        }
    }

    /**
     * 根据关卡获取当前阶段大奖索引
     * @param stage 关卡
     * @returns
     */
    public getPassBigPrizeIndexByStage(stage: number): number {
        this._walks();
        let pos = UtilArray.LowerBound(this.bigPrizeStages, stage);
        if (pos < 0) {
            pos = 0;
        }
        const length = this.bigPrizeStages.length - 1;
        if (pos > length) {
            pos = length;
        }
        return this.bigPrizeIndexs[pos];
    }
}
