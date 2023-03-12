/*
 * @Author: myl
 * @Date: 2022-09-06 10:14:09
 * @Description: 刷新次数表
 */
import { i18n, Lang } from '../../../../i18n/i18n';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass, property } = cc._decorator;

/**
 * 表字段说明
 * cyc : 刷新周期  0:标识永久只购次数  其他：表示周期内的免费次数（过期重置次数）（数值单位为天： 一周为7 ，一月为30）
 * MaxTimes: 免费次数 （区分其他商城跟其他业务模块）
 */
@ccclass('ConfigCycleTimesIndexer')
export class ConfigCycleTimesIndexer extends ConfigIndexer {
    private static _i: ConfigCycleTimesIndexer = null;
    public static get I(): ConfigCycleTimesIndexer {
        if (!this._i) {
            this._i = new ConfigCycleTimesIndexer(ConfigConst.Cfg_CycleTimes);
            this._i._walks();
        }
        return this._i;
    }

    /** 获取限制描述和限制的次数 */
    public getTimes(id: number): { num: number, desc: string } {
        this._walks();
        const config: Cfg_CycleTimes = this.getValueByKey(id);
        if (!config) {
            return null;
        }
        if (config.Cyc === 0) {
            return { num: config.MaxTimes, desc: i18n.tt(Lang.shop_item_tip1) };
        } else if (config.Cyc === 1) {
            return { num: config.MaxTimes, desc: i18n.tt(Lang.shop_item_tip2) };
        } else if (config.Cyc === 7) {
            return { num: config.MaxTimes, desc: i18n.tt(Lang.shop_item_tip3) };
        } else {
            return { num: config.MaxTimes, desc: i18n.tt(Lang.shop_item_tip4) };
        }
    }
}
