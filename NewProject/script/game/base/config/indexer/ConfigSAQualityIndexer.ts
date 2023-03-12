/*
 * @Author: myl
 * @Date: 2022-10-17 21:29:23
 * @Description:
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass, property } = cc._decorator;

@ccclass('ConfigSAQualityIndexer')
export class ConfigSAQualityIndexer extends ConfigIndexer {
    private static _i: ConfigSAQualityIndexer;
    public static get I(): ConfigSAQualityIndexer {
        if (!this._i) {
            this._i = new ConfigSAQualityIndexer(ConfigConst.Cfg_SAQuality);
        }
        return this._i;
    }

    /** 官印相关配置 */
    private sealConfig: Map<number, Map<number, Cfg_SAQuality>> = new Map();
    /** 虎符相关配置 */
    private amuletConfig: Map<number, Map<number, Cfg_SAQuality>> = new Map();

    protected walks(tableName: string, data: Cfg_SAQuality, index: number): void {
        if (data.Tpye === 1) {
            const k1 = data.Stage;
            let v = this.sealConfig.get(k1);
            if (v) {
                v.set(data.Activation, data);
            } else {
                v = new Map();
                v.set(data.Activation, data);
                this.sealConfig.set(k1, v);
            }
            // this.sealConfig.set(`${data.Star}_${data.Activation}`, data);
        } else {
            const k1 = data.Stage;
            let v = this.amuletConfig.get(k1);
            if (v) {
                v.set(data.Activation, data);
            } else {
                v = new Map();
                v.set(data.Activation, data);
                this.amuletConfig.set(k1, v);
            }
            // this.amuletConfig.set(`${data.Star}_${data.Activation}`, data);
        }
    }

    /**
     *  根据星级和孔位 获取配置数据
     * @param star 星级
     * @param actovation  孔位(横向排版)
     */
    public getSealAmuletQualityBy(type: number, stage: number, activation: number): Cfg_SAQuality {
        this._walks();
        if (type === 1) {
            const v = this.sealConfig.get(stage);
            if (v) {
                return v.get(activation);
            }
            return null;
        }
        const v1 = this.amuletConfig.get(stage);
        if (v1) {
            return v1.get(activation);
        }
        return null;
    }

    // 获取当前等级有多少个 孔
    public getSealAmuletQualityLength(type: number, stage: number): number {
        this._walks();
        if (type === 1) {
            const v = this.sealConfig.get(stage);
            if (v) {
                return v.size;
            }
            return 0;
        }
        const v1 = this.amuletConfig.get(stage);
        if (v1) {
            return v1.size;
        }
        return 0;
    }
}
