/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { AttrInfo } from '../../base/attribute/AttrInfo';
import { AttrModel } from '../../base/attribute/AttrModel';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigAttributeIndexer } from '../../base/config/indexer/ConfigAttributeIndexer';
import { ConfigLimitConditionIndexer } from '../../base/config/indexer/ConfigLimitConditionIndexer';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { UtilAttr } from '../../base/utils/UtilAttr';
import UtilItem from '../../base/utils/UtilItem';
import { ViewConst } from '../../const/ViewConst';
import { BagMgr } from '../bag/BagMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleExerciseModel extends BaseModel {
    private levels: Map<number, number> = new Map();

    public clearAll(): void {
        //
    }

    public setLevelData(ExerciseList: Array<Exercise>): void {
        ExerciseList.forEach((v) => {
            this.levels.set(v.Id, v.Level);
        });
    }

    /** 获取属性数量 */
    public getPropertyNum(): number {
        const config = Config.Get(Config.Type.Cfg_ExerciseAttr);
        const set: Set<number> = new Set();
        config.forEach((cfg: Cfg_ExerciseAttr) => {
            set.add(cfg.Type);
            return true;
        });
        return set.size;
    }

    /** 获取制定类型炼体属性
     * @param  type 类型
     */
    public getAllExercises(type: number): Cfg_ExerciseAttr[] {
        const indexer = Config.Get(Config.Type.Cfg_ExerciseAttr);
        const ary: number[] = indexer.getValueByKey(type);
        const result: Cfg_ExerciseAttr[] = [];
        ary.forEach((v) => {
            result.push(indexer.getValueByIndex(v));
        });
        return result;
    }

    /** 计算炼体属性战力 */
    public calcAllProperty(): AttrInfo {
        const info = new AttrInfo();
        const indexer = Config.Get(Config.Type.Cfg_ExerciseAttr);
        indexer.forEach((v: Cfg_ExerciseAttr, index: number) => {
            if (this.levels.has(v.Id)) {
                const lev = this.levels.get(v.Id);
                // const ary = configAttr.getAttrsById(v.Attr);
                // const attr = new AttrInfo(ary);
                const attr = AttrModel.MakeAttrInfo(v.Attr);
                info.add(attr.mul(lev));
            }
            return true;
        });
        return info;
    }

    /** 获取炼体属性描述 */
    public getExerciseDesc(v: Cfg_ExerciseAttr): string {
        let result = '';
        let lev = 0;
        if (this.levels.has(v.Id)) lev = this.levels.get(v.Id);
        const attr = AttrModel.MakeAttrInfo(v.Attr);
        const itemAttr = attr.mul(lev);
        if (itemAttr) {
            itemAttr.attrs.forEach((v) => {
                const name = v.name;
                const value = v.value;
                if (result.length) result += '\n';
                result += `<color=#f7efca>${name}</c><color=#7beaa0>+${value}</color>`;
            });
        }
        return `<outline color=#000000 width=1>${result}</outline>`;
    }

    /** 获取炼体最大等级 */
    public getExerciseMaxLv(v: Cfg_ExerciseAttr): number {
        const indexer = Config.Get(Config.Type.Cfg_ExerciseLv);
        const indexer2: ConfigLimitConditionIndexer = Config.Get(ConfigConst.Cfg_LimitCondition);
        const ary: number[] = indexer.getValueByKey(v.Type);
        let max = 0;
        ary.forEach((v) => {
            const item: Cfg_ExerciseLv = indexer.getValueByIndex(v);
            if (item.Max >= max) {
                if (item.Limit) {
                    const condition = indexer2.getCondition(item.Limit);
                    if (condition.state === false) return true;
                }
                max = item.Max;
            }
            return true;
        });
        return max;
    }

    /** 获取炼体当前等级 */
    public getExerciseLv(v: Cfg_ExerciseAttr): number {
        if (this.levels.has(v.Id)) return this.levels.get(v.Id);
        return 0;
    }

    /** 检测是否可以炼体 */
    public checkCanExercise(type: number, warn: boolean = false): boolean {
        const ary = this.getAllExercises(type);
        let cost = null;
        for (let i = 0; i < ary.length; ++i) {
            const v = ary[i];
            const min = this.getExerciseLv(v);
            const max = this.getExerciseMaxLv(v);
            if (cost == null) cost = v.Cost;
            if (min < max) {
                if (BagMgr.I.getItemNum(v.Cost) > 0) {
                    return true;
                }
            }
        }
        if (warn) {
            const name = UtilItem.NewItemModel(cost).cfg.Name;
            MsgToastMgr.Show(name + i18n.tt(Lang.com_buzu));
            WinMgr.I.open(ViewConst.ItemSourceWin, cost);
            return false;
        }

        return false;
    }
}
