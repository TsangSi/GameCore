/* eslint-disable camelcase */
/*
 * @Author: zs
 * @Date: 2022-05-09 14:26:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-04 16:51:58
 * @FilePath: \SanGuo2.4\assets\script\game\base\config\indexer\ConfigItemIndexer.ts
 * @Description:
 *
 */
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;

@ccclass('ConfigItemIndexer')
export class ConfigItemIndexer extends ConfigIndexer {
    private static _i: ConfigItemIndexer;
    public static get I(): ConfigItemIndexer {
        if (!this._i) {
            this._i = new ConfigItemIndexer(ConfigConst.Cfg_Item);
        }
        return this._i;
    }

    /** 根据subtype存储的索引列表 */
    private indexsBySubType: Map<number, number[]> = new Map();
    /** 根据Param存储的索引 */
    private _param: Map<number, number> = new Map();

    protected walk(data: Cfg_Item, index: number): void {
        // 背包类型
        let indexs = this.indexsBySubType.get(data.SubType);
        if (!indexs) {
            indexs = [];
            this.indexsBySubType.set(data.SubType, indexs);
        }
        indexs.push(index);
        // param
        if (data.Param) {
            this._param.set(data.Param, data.Id);
        }
    }

    /**
     * 根据功能类型获取物品索引列表
     * @param subType 功能类型
     * @returns
     */
    public getIndexsBySubType(subType: number): number[] {
        return this.indexsBySubType.get(subType) || [];
    }

    /**
     * 根据param参数索引到道具id
     * @param param 道具param参数
     * @returns 道具id
     */
    public getItemIdByParam(param: number): number {
        this._walks();
        return this._param.get(param);
    }

    /**
     * 根据物品名称获取物品ID，目前仅用于GM命令
     * @param name 名称
     * @returns ID
     */
    public getIdByName(name: string): number {
        const cfg = this.CfgmI.getDatas(this.TableName);
        for (let i = 0, len = cfg.length; i < len; i++) {
            const item = cfg[i] as Cfg_Item;
            if (item.Name === name) {
                return item.Id;
            }
        }
        return 0;
    }
}
