/*
 * @Author: kexd
 * @Date: 2022-11-02 15:17:46
 * @FilePath: \SanGuo2.4\assets\script\game\base\config\indexer\ConfigBeaconWarIndexer.ts
 * @Description:
 *
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;

@ccclass('ConfigBeaconWarIndexer')
export class ConfigBeaconWarIndexer extends ConfigIndexer {
    private static _i: ConfigBeaconWarIndexer;
    public static get I(): ConfigBeaconWarIndexer {
        if (!this._i) {
            this._i = new ConfigBeaconWarIndexer(ConfigConst.Cfg_BeaconWar);
        }
        return this._i;
    }

    /**
     * 列表数据
     * @returns Cfg_BeaconWar[]
     */
    public getBeaconWarDatas(): Cfg_BeaconWar[] {
        this._walks();
        return this.CfgmI.getDatas(this.TableName) as Cfg_BeaconWar[];
    }
}
