/*
 * @Author: kexd
 * @Date: 2022-07-08 15:18:45
 * @FilePath: \SanGuo\assets\script\game\base\config\indexer\ConfigTitleLevelUpIndexer.ts
 * @Description:
 *
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;

@ccclass('ConfigTitleLevelUpIndexer')
export class ConfigTitleLevelUpIndexer extends ConfigIndexer {
    private static _i: ConfigTitleLevelUpIndexer;
    public static get I(): ConfigTitleLevelUpIndexer {
        if (!this._i) {
            this._i = new ConfigTitleLevelUpIndexer(ConfigConst.Cfg_TitleLevelUp);
        }
        return this._i;
    }

    protected walk(data: Cfg_TitleLevelUp, index: number): void {
        // console.log(data);
    }

    private getIndexByStar(star: number): [number, boolean] {
        this._walks();
        const cfg = this.CfgmI.getDatas(this.TableName) as Cfg_TitleLevelUp[];
        if (!cfg || cfg.length < 1) return [0, false];
        let curIndex: number = 0;
        for (let i = 0, len = cfg.length; i < len; i++) {
            const tup: Cfg_TitleLevelUp = cfg[i];
            curIndex = i;
            if (star >= tup.MinLevel && star <= tup.MaxLevel) {
                curIndex = i;
                break;
            }
        }
        if (curIndex <= 0) {
            curIndex = 0;
        } else if (curIndex >= cfg.length) {
            curIndex = cfg.length - 1;
        }

        return [curIndex, star >= cfg[cfg.length - 1].MaxLevel];
    }

    /**
     * 由当前星级获取当前属性加成万分比
     * @param star 当前星级
     * @returns
     */
    public getTitleAttrRatio(star: number): number {
        if (star <= 0) return 1;
        const cfg = this.CfgmI.getDatas(this.TableName) as Cfg_TitleLevelUp[];
        const curIndex = this.getIndexByStar(star)[0];
        // if (curIndex === 0) {
        //     return star * cfg[curIndex].AttrRatio / 10000;
        // }
        // return ((star - cfg[curIndex - 1].MaxLevel) * cfg[curIndex].AttrRatio + cfg[curIndex - 1].TotalRatio) / 10000;
        // 公式变更为下面的：
        if (curIndex >= 0 && curIndex < cfg.length) {
            return (cfg[curIndex].TotalRatio - (cfg[curIndex].MaxLevel - star) * cfg[curIndex].AttrRatio) / 10000;
        }
        return 1;
    }

    public getLevelUpItemNum(star: number): [number, boolean] {
        if (star <= 0) return [1, false];
        const cfg = this.CfgmI.getDatas(this.TableName) as Cfg_TitleLevelUp[];
        if (!cfg || cfg.length <= 0) {
            return [0, false];
        }
        const curIndex = this.getIndexByStar(star);
        return [cfg[curIndex[0]].LevelUpItem, curIndex[1]];
    }

    /** 获取最大星级 */
    public getMaxLevel(): number {
        const cfg = this.CfgmI.getDatas(this.TableName) as Cfg_TitleLevelUp[];
        return cfg[cfg.length - 1].MaxLevel;
    }
}
