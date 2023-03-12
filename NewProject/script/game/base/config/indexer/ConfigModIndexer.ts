/*
 * @Author: hrd
 * @Date: 2022-09-07 21:12:49
 * @Description:
 *
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

/** 模型挂载点  */
export interface MountPoints {
    posList: cc.Vec2[];
}

const { ccclass } = cc._decorator;
@ccclass('ConfigModIndexer')
export class ConfigModIndexer extends ConfigIndexer {
    private static _i: ConfigModIndexer;
    public static get I(): ConfigModIndexer {
        if (!this._i) {
            this._i = new ConfigModIndexer(ConfigConst.Cfg_Mod);
            this._i._walks();
        }
        return this._i;
    }

    private _mountPointMap: { [ID: number]: cc.Vec2[] } = cc.js.createMap(true);
    protected walk(data: Cfg_Mod, index: number): void {
        const strArr = data.ModNodeDev.split('|');
        const posArr: cc.Vec2[] = [];
        for (let i = 0; i < strArr.length; i++) {
            const str = strArr[i];
            const pos = str.split(',');
            posArr.push(cc.v2(Number(pos[0]), Number(pos[1])));
        }
        this._mountPointMap[data.ID] = posArr;
    }

    /** 根据类型获取该类型所有任务的索引列表 */
    public getMountPoint(ID: number): cc.Vec2[] {
        this._walks();
        return this._mountPointMap[ID] || [];
    }
}
