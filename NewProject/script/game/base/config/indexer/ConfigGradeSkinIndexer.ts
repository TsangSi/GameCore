/*
 * @Author: hwx
 * @Date: 2022-07-19 23:55:07
 * @FilePath: \SanGuo2.4-main\assets\script\game\base\config\indexer\ConfigGradeSkinIndexer.ts
 * @Description: 进阶皮肤索引器
 */

import { FuncId } from '../../../const/FuncConst';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;

@ccclass('ConfigGradeSkinIndexer')
export class ConfigGradeSkinIndexer extends ConfigIndexer {
    private static _i: ConfigGradeSkinIndexer;
    public static get I(): ConfigGradeSkinIndexer {
        if (!this._i) {
            this._i = new ConfigGradeSkinIndexer(ConfigConst.Cfg_GradeSkin);
        }
        return this._i;
    }

    /** 存储的索引列表 */
    private indexsFuncIdMap: Map<number, number[]> = new Map();
    private indexsTabMap: Map<number, Map<number, number[]>> = new Map();
    private horseOffY: Map<number, { x: number, y: number }> = new Map();

    protected walk(data: Cfg_GradeSkin, index: number): void {
        // Tab页下标
        if (data.TapId) {
            let map = this.indexsTabMap.get(data.FuncId);
            if (!map) {
                map = new Map();
                this.indexsTabMap.set(data.FuncId, map);
            }
            let indexs = map.get(data.TapId);
            if (!indexs) {
                indexs = [];
                map.set(data.TapId, indexs);
            }
            indexs.push(index);
        }

        // 功能全部皮肤
        let indexs = this.indexsFuncIdMap.get(data.FuncId);
        if (!indexs) {
            indexs = [];
            this.indexsFuncIdMap.set(data.FuncId, indexs);
        }
        indexs.push(index);

        // 坐骑偏移
        if (data.FuncId === FuncId.Horse) {
            const animMap = this.horseOffY.get(data.AnimId);
            if (!animMap && data.XY) {
                const off = data.XY.split(',');
                if (off) {
                    this.horseOffY.set(data.AnimId, { x: +off[0], y: +off[1] || 0 });
                }
            }
        }
    }

    public getHorseOffset(AnimId: number): { y: number, x: number } {
        this._walks();
        const off = this.horseOffY.get(AnimId);
        if (off) {
            return off;
        }
        return { y: 0, x: 0 };
    }

    /**
     * 获取索引Map
     * @param subType 功能类型
     * @returns Map<tabId: number, 索引列表: number[]>
     */
    public getIndexsTabMapByGradeId(gradeId: number): Map<number, number[]> {
        this._walks();
        return this.indexsTabMap.get(gradeId);
    }

    /**
     * 获取索引列表
     * @param tabId 功能类型
     * @returns number[] 索引列表
     */
    public getIndexsByTabId(gradeId: number, tabId: number): number[] {
        this._walks();
        const map = this.indexsTabMap.get(gradeId);
        if (map) {
            return map.get(tabId);
        }
        return [];
    }

    /**
     * 获取索引列表
     * @param subType 功能类型
     * @returns
     */
    public getIndexsByFuncId(gradeId: number): number[] {
        this._walks();
        return this.indexsFuncIdMap.get(gradeId) || [];
    }
}
