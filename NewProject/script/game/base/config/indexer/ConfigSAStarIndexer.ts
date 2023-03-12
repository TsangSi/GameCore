/*
 * @Author: myl
 * @Date: 2022-10-17 21:10:21
 * @Description:
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass, property } = cc._decorator;

@ccclass('ConfigSAStarIndexer')
export class ConfigSAStarIndexer extends ConfigIndexer {
    private static _i: ConfigSAStarIndexer;
    public static get I(): ConfigSAStarIndexer {
        if (!this._i) {
            this._i = new ConfigSAStarIndexer(ConfigConst.Cfg_SAStar);
        }
        return this._i;
    }

    /** 官印相关配置 */
    private sealConfig: Map<string, Cfg_SAStar> = new Map();
    /** 虎符相关配置 */
    private amuletConfig: Map<string, Cfg_SAStar> = new Map();

    protected walks(tableName: string, data: Cfg_SAStar, index: number): void {
        if (data.Tpye === 1) {
            this.sealConfig.set(`${data.Star}_${data.Activation}`, data);
        } else {
            this.amuletConfig.set(`${data.Star}_${data.Activation}`, data);
        }
    }

    /**
     *  根据星级和孔位 获取配置数据
     * @param star 星级
     * @param actovation  孔位
     */
    public getSealAmuletStarBy(type: number, star: number, activation: number): Cfg_SAStar {
        this._walks();
        if (type === 1) {
            return this.sealConfig.get(`${star}_${activation}`);
        }
        return this.amuletConfig.get(`${star}_${activation}`);
    }
}
