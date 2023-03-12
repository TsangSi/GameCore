/*
 * @Author: kexd
 * @Date: 2022-09-23 14:32:05
 * @FilePath: \SanGuo2.4\assets\script\game\base\config\indexer\ConfigGeneralSkinIndexer.ts
 * @Description:
 *
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;

@ccclass('ConfigGeneralSkinIndexer')
export class ConfigGeneralSkinIndexer extends ConfigIndexer {
    private static _i: ConfigGeneralSkinIndexer;
    public static get I(): ConfigGeneralSkinIndexer {
        if (!this._i) {
            this._i = new ConfigGeneralSkinIndexer(ConfigConst.Cfg_GeneralSkin);
        }
        return this._i;
    }

    private _generalSkinIds: Map<number, number[]> = new Map();
    protected walks(tableName: string, data: Cfg_GeneralSkin, index: number): void {
        const msg = this._generalSkinIds.get(data.GeneralId);
        if (!msg) {
            this._generalSkinIds.set(data.GeneralId, [data.Key]);
        } else {
            msg.push(data.Key);
        }
    }

    /** 获取武将皮肤数据 */
    public getSkinData(skinId: number): Cfg_GeneralSkin {
        this._walks();
        const data: Cfg_GeneralSkin = this.getValueByKey(skinId);
        return data;
    }

    /**
     * 获取武将的皮肤列表
     * @param generalId 武将id
     */
    public getGeneralSkinIds(generalId: number): number[] {
        this._walks();
        return this._generalSkinIds.get(generalId);
    }

    /**
     * 获取武将的皮肤列表
     * @param generalId 武将id
     */
    public getGeneralSkins(generalId: number): Cfg_GeneralSkin[] {
        this._walks();
        const msg = this._generalSkinIds.get(generalId);
        const list: Cfg_GeneralSkin[] = [];
        for (let i = 0; i < msg.length; i++) {
            const data: Cfg_GeneralSkin = this.getValueByKey(msg[i]);
            list.push(data);
        }
        return list;
    }
}
