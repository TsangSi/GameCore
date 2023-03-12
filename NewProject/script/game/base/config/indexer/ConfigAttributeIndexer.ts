/*
 * @Author: zs
 * @Date: 2022-06-22 20:27:04
 * @FilePath: \SanGuo2.4\assets\script\game\base\config\indexer\ConfigAttributeIndexer.ts
 * @Description:
 *
 */
import { UtilArray } from '../../../../app/base/utils/UtilArray';
import {
    EAttrType, IAttrBase,
} from '../../attribute/AttrConst';
import { UtilAttr } from '../../utils/UtilAttr';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;

@ccclass('ConfigAttributeIndexer')
export class ConfigAttributeIndexer extends ConfigIndexer {
    private static _i: ConfigAttributeIndexer;
    public static get I(): ConfigAttributeIndexer {
        if (!this._i) {
            this._i = new ConfigAttributeIndexer(ConfigConst.Cfg_Attribute);
        }
        return this._i;
    }

    private attrTypesById: { [id: number]: number[] } = cc.js.createMap(true);
    private attrGradeTypesById: { [id: number]: IAttrBase } = cc.js.createMap(true);
    private attrExtraById: { [id: number]: IAttrBase } = cc.js.createMap(true);
    protected walk(data: Cfg_Attribute, index: number): void {
        if (!data.Id) { return; }
        const list = this.attrTypesById[data.Id] = [];
        list[0] = data.FightValue ? +data.FightValue : 0;
        let needSort = false;
        // let lastType = 0;
        let attrType = 0;
        let value = 0;
        let listIndex = 0;
        let nextIndex = 0;
        const indexs: number[] = [];
        let lastAttrType = 0;
        let length = 0;
        for (const key in data) {
            attrType = EAttrType[key];
            value = data[key];
            if (value && attrType) {
                if (needSort || (attrType !== 0 && (attrType - lastAttrType)) >= 10) {
                    needSort = true;
                    listIndex = attrType * 2 - 1;
                    nextIndex = UtilArray.Insert(indexs, listIndex) as number;
                    nextIndex += length;
                    list.splice(nextIndex * 2 + 1, 0, attrType, value);
                } else {
                    list.push(attrType);
                    list.push(value);
                    length++;
                    lastAttrType = attrType;
                }
            }
        }
        indexs.length = 0;

        if (data.ExtraAttr) {
            const obj: IAttrBase = cc.js.createMap(true);
            obj.extraAttr = data.ExtraAttr;
            this.attrExtraById[data.Id] = obj;
        }
    }

    /**
     * 获取IAttrBase，属性数组
     * @param id 属性id
     * @returns
     */
    public getAttrsById(id: number): IAttrBase[] {
        this._walks();
        if (!this.attrTypesById[id]) {
            return [];
        }
        const s: IAttrBase[] = [];
        let attrType = 0;
        let value = 0;
        for (let i = 1, n = Math.floor(this.attrTypesById[id].length / 2); i <= n; i++) {
            attrType = this.attrTypesById[id][i * 2 - 1];
            value = this.attrTypesById[id][i * 2];
            s.push({ attrType, value, name: UtilAttr.GetAttrName(attrType) });
        }
        return s;
    }

    /**
     * 获取配置表内的基础战力
     * @param id 属性id
     * @returns
     */
    public getFightValueById(id: number): number {
        this._walks();
        return this.attrTypesById[id][0] || 0;
    }

    /**
     * 获取属性进阶类型万分比加成
     * @param id
     * @returns IAttrBase
     */
    public getAttrGradeTypeById(id: number): IAttrBase {
        this._walks();
        return this.attrGradeTypesById[id];
    }

    /**
     * 获取属性扩展
     * @param id
     * @returns IAttrBase
     */
    public getAttrExtraById(id: number): IAttrBase {
        this._walks();
        return this.attrExtraById[id];
    }
    public getValue(index: number, outObject?: string | object): undefined {
        return undefined;
    }
    public getValueByKey<T>(...args: (number | string | object)[]): undefined {
        return undefined;
    }

    public getNestedMap(): undefined {
        return undefined;
    }
}
