/*
 * @Author: kexd
 * @Date: 2022-11-16 21:23:23
 * @FilePath: \SanGuo2.4\assets\script\game\base\config\indexer\ConfigGeneralEquipIndexer.ts
 * @Description:
 *
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;

@ccclass('ConfigGeneralEquipIndexer')
export class ConfigGeneralEquipIndexer extends ConfigIndexer {
    private static _i: ConfigGeneralEquipIndexer;
    public static get I(): ConfigGeneralEquipIndexer {
        if (!this._i) {
            this._i = new ConfigGeneralEquipIndexer(ConfigConst.Cfg_Genera_Equip);
        }
        return this._i;
    }

    /** 把一条数据里的 Part_Level_Star 作为key，存该数据的Id作为其值 */
    private _keyData: Map<string, number> = new Map();
    protected walks(tableName: string, data: Cfg_Genera_Equip, index: number): void {
        const key: string = `${data.Part}_${data.Level}_${data.Star}`;
        this._keyData.set(key, data.Id);
    }

    /** 获取武将装备数据 */
    public getEquipData(Part: number, Level: number, Star: number): Cfg_Genera_Equip {
        this._walks();
        const key: string = `${Part}_${Level}_${Star}`;
        const id: number = this._keyData.get(key);
        return this.getValueByKey(id);
    }
}
