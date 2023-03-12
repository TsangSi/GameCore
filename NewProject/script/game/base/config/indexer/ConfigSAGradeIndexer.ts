/*
 * @Author: myl
 * @Date: 2022-10-17 20:58:13
 * @Description:
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass, property } = cc._decorator;

@ccclass('ConfigSAGradeIndexer')
export class ConfigSAGradeIndexer extends ConfigIndexer {
    private static _i: ConfigSAGradeIndexer;
    public static get I(): ConfigSAGradeIndexer {
        if (!this._i) {
            this._i = new ConfigSAGradeIndexer(ConfigConst.Cfg_SAGrade);
        }
        return this._i;
    }

    /** 官印相关配置 */
    private sealConfig: Map<number, Cfg_SAGrade> = new Map();
    /** 虎符相关配置 */
    private amuletConfig: Map<number, Cfg_SAGrade> = new Map();

    protected walks(tableName: string, data: Cfg_SAGrade, index: number): void {
        if (data.Tpye === 1) {
            this.sealConfig.set(data.Level, data);
        } else {
            this.amuletConfig.set(data.Level, data);
        }
    }

    /** 根据等级获取官印虎符 */
    public getSealGradeAmuletByLv(type: number, lv: number): Cfg_SAGrade {
        this._walks();
        if (type === 1) {
            return this.sealConfig.get(lv);
        }
        return this.amuletConfig.get(lv);
    }
}
