import { UtilArray } from '../../../../app/base/utils/UtilArray';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;
export interface EquipObj {
    lv: number,
    tableIdx: number
}

@ccclass('ConfigEquipIndexer')
export class ConfigEquipIndexer extends ConfigIndexer {
    private static _i: ConfigEquipIndexer;
    public static get I(): ConfigEquipIndexer {
        if (!this._i) {
            this._i = new ConfigEquipIndexer(ConfigConst.Cfg_EquipStrengthA);
        }
        return this._i;
    }

    /** 根据objtype存储的索引列表 */
    private _equipStMap: Map<number, EquipObj[]> = new Map<number, EquipObj[]>();
    /**
     * 根据map 做优化 拆分表格
     * @param data
     * @param index
     */

    protected walk(data: Cfg_EquipStrengthA, index: number): void {
        const arr: EquipObj[] = this._equipStMap.get(data.Pos);
        if (arr?.length) {
            arr.push({ lv: data.LevelMax, tableIdx: index });
        } else {
            this._equipStMap.set(data.Pos, [{ lv: data.LevelMax, tableIdx: index }]);
        }
    }

    /**
     * 根据等级获取当前等级位置对应的配置
     * @param equipPart 装备部位
     * @param equipStLv 装备强化等级
     * @returns 一条配置
     */
    public getCfgByLv(equipPart: number, equipStLv: number): Cfg_EquipStrengthA {
        this._walks();
        const arrLvMax: any[] = this._equipStMap.get(equipPart);
        /** 返回的是当前这个传入的数组的索引 */
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        let arrIdx: number = UtilArray.LowerBound(arrLvMax, { lv: equipStLv }, (obj) => obj.lv);
        if (arrIdx > arrLvMax.length) {
            arrIdx -= 1;
        }
        /** 数组索引获取表格索引 */
        // eslint-disable-next-line
        const tableIdx = arrLvMax[arrIdx].tableIdx;
        const cfg = this.CfgmI.getDatas(this.TableName);
        // eslint-disable-next-line
        return cfg[tableIdx] as Cfg_EquipStrengthA;
    }
}
