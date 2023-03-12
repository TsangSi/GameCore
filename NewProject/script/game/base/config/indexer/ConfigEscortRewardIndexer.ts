/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Author: kexd
 * @Date: 2023-01-17 14:52:48
 * @FilePath: \SanGuo2.4\assets\script\game\base\config\indexer\ConfigEscortRewardIndexer.ts
 * @Description:
 *
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass, property } = cc._decorator;

@ccclass('ConfigEscortRewardIndexer')
export class ConfigEscortRewardIndexer extends ConfigIndexer {
    private static _i: ConfigEscortRewardIndexer = null;
    public static get I(): ConfigEscortRewardIndexer {
        if (!this._i) {
            this._i = new ConfigEscortRewardIndexer(ConfigConst.Cfg_EscortReward);
        }
        return this._i;
    }

    /** 缓存品质列表 */
    private _qualityData: Map<number, { id: number, min: number, max: number }[]> = cc.js.createMap(true);
    protected walks(tableName: string, data: Cfg_EscortReward, index: number): void {
        if (!this._qualityData[data.Quality]) {
            this._qualityData[data.Quality] = [];
        }
        this._qualityData[data.Quality].push({ id: data.Id, min: data.LevelMin, max: data.LevelMax });
    }

    /** 获取数据 */
    public getDataByQualityAndLv(quality: number, level: number): Cfg_EscortReward {
        this._walks();
        const ids: { id: number, min: number, max: number }[] = this._qualityData[quality];
        if (ids && ids.length > 0) {
            for (let i = 0; i < ids.length; i++) {
                if (level >= ids[i].min && level <= ids[i].max) {
                    return this.getValueByKey(ids[i].id);
                }
            }
        }
        return null;
    }
}
