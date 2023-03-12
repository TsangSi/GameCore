/* eslint-disable camelcase */
/*
 * @Author: zs
 * @Date: 2022-05-09 14:26:08
 * @LastEditors: zs
 * @LastEditTime: 2022-05-23 16:18:30
 * @FilePath: \SanGuo\assets\script\game\base\config\indexer\ConfigStickIndexer.ts
 * @Description:
 *
 */
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;

@ccclass('ConfigStickIndexer')
export class ConfigStickIndexer extends ConfigIndexer {
    private static _i: ConfigStickIndexer;
    public static get I(): ConfigStickIndexer {
        if (!this._i) {
            this._i = new ConfigStickIndexer(ConfigConst.Cfg_Stick);
            this._i._walks();
        }
        return this._i;
    }

    private itemids: number[] = [];
    protected walk(data: Cfg_Stick, index: number): void {
        this.itemids[index] = data.ItemId;
    }

    public getValueByItemid(itemid: number): Cfg_Stick;
    public getValueByItemid<T>(itemid: number, name: string): T;
    public getValueByItemid<T extends object>(itemid: number, outObject: T): T;
    public getValueByItemid(itemid: number, outObject?: string | object): object {
        const index = this.itemids.indexOf(itemid);
        if (typeof outObject === 'string') {
            return this.getValueByIndex(index, outObject);
        } else {
            return this.getValueByIndex(index, outObject);
        }
    }
}
