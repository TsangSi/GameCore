/*
 * @Author: myl
 * @Date: 2022-11-16 14:20:15
 * @Description:
 */

import { HeadPhotoType } from '../../../module/head/HeadConst';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass, property } = cc._decorator;

@ccclass('ConfigPhotoIndexer')
export default class ConfigPhotoIndexer extends ConfigIndexer {
    private static _i: ConfigPhotoIndexer;
    public static get I(): ConfigPhotoIndexer {
        if (!this._i) {
            this._i = new ConfigPhotoIndexer(ConfigConst.Cfg_PhotoStar, ConfigConst.Cfg_Photo);
        }
        return this._i;
    }

    /** 头像 */
    private headConfigs: Map<number, Cfg_Photo> = new Map();
    /** 头像框 */
    private headFrameConfigs: Map<number, Cfg_Photo> = new Map();
    /** 头像头像框升星 */
    private starConfigs: Map<number, Cfg_PhotoStar[]> = new Map();

    protected walks(tableName: string, data: unknown, index: number): void {
        if (tableName === ConfigConst.Cfg_Photo.name) {
            const dta = data as Cfg_Photo;
            if (dta.Type === 1) {
                this.headConfigs.set(dta.Id, dta);
            } else {
                this.headFrameConfigs.set(dta.Id, dta);
            }
        } else {
            const dta = data as Cfg_PhotoStar;
            let cfg = this.starConfigs.get(dta.FuncId);
            if (cfg == null) {
                cfg = [dta];
            } else {
                cfg.push(dta);
            }
            this.starConfigs.set(dta.FuncId, cfg);
        }
    }

    public getStarConfig(funcId: number, lv: number): Cfg_PhotoStar {
        this._walks();
        return this.getIntervalDataByTableName(ConfigConst.Cfg_PhotoStar.name, funcId, lv);
    }

    public getPhotoConfig(type: HeadPhotoType, id: number): Cfg_Photo {
        this._walks();
        return type === HeadPhotoType.Head ? this.headConfigs.get(id) : this.headFrameConfigs.get(id);
    }

    public getPhotoList(type: HeadPhotoType): Map<number, Cfg_Photo> {
        this._walks();
        if (type === HeadPhotoType.Head) return this.headConfigs;
        const result: Map<number, Cfg_Photo> = new Map();
        this.headFrameConfigs.forEach((value: Cfg_Photo, key: number) => {
            if (value.Type === type) { result.set(key, value); }
        });
        console.log(result);
        return result;
    }
}
