/*
 * @Author: hwx
 * @Date: 2022-07-20 17:14:52
 * @FilePath: \SanGuo\assets\script\game\base\config\indexer\ConfigGradeSkinSkillIndexer.ts
 * @Description: 进阶皮肤技能索引器
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;

@ccclass('ConfigGradeSkinSkillIndexer')
export class ConfigGradeSkinSkillIndexer extends ConfigIndexer {
    private static _i: ConfigGradeSkinSkillIndexer;
    public static get I(): ConfigGradeSkinSkillIndexer {
        if (!this._i) {
            this._i = new ConfigGradeSkinSkillIndexer(ConfigConst.Cfg_GradeSkinSkill);
        }
        return this._i;
    }

    /** 存储的索引列表 */
    private indexsMap: Map<string, number[]> = new Map();

    protected walk(data: Cfg_GradeSkinSkill, index: number): void {
        // 背包类型
        const key = `${data.Quality}_${data.Part}`;
        let indexs = this.indexsMap.get(key);
        if (!indexs) {
            indexs = [];
            this.indexsMap.set(key, indexs);
        }
        indexs.push(index);
    }

    /**
     * 获取索引列表
     * @param subType 功能类型
     * @returns
     */
    public getIndexsByQualityPart(quality: number, part: number): number[] {
        this._walks();
        const key = `${quality}_${part}`;
        return this.indexsMap.get(key);
    }
}
