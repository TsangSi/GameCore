import { js } from 'cc';
import Utils from '../utils/Utils';
import CfgManager from './CfgManager';

export default class CfgIndexer {
    protected CfgmI: CfgManager;
    /** 表名 */
    protected TableName = '';
    protected Walked = false;
    private IndexsByKey: {[key: string]: any[] | any} = js.createMap(true);
    private IdsByIndex = [];
    private IdsLength = 0;
    private Key: string = undefined;
    private Value: string = undefined;
    /** 是否已初始化 */
    public inited = false;
    /**
     *
     * @param tableName 表名
     * @param key 键
     * * 1.不传或undefined则为数组,传值将做键
     *      例：Cfg_Pet2Reborn[] 结构时，key传undefined或不传即可
     *      例：{ [k: string]：Cfg_Pet2Reborn }结构时，key需传字段名,如'k'
     * * 2.复合型用法，使用前请悉知各个参数的用法,如有疑问立即咨询mzc,不可肆意妄为
     * * 2-1.复合键关键字逗号','。所有被','分割开的键将以下划线_分割开共同作为一维键，顺序同','分割顺序。优先级低于'>'
     *      例：{ [k1_k2: string]：Cfg_Pet2Reborn }结构时，key需传字段名,如'k1,k2'
     * * 2-2.复合键关键字逗号'>'。所有被>分割开的键将产生多维键，顺序同'>'分割顺序,若最后一维是数组，需以>结尾即可,不可在键中间使用数组。优先级高于','
     *      例：{ [k: number]: Cfg_Pet2Reborn[] }结构时，key需传字段名,如'k>'
     *      例：{ [k1: number]: { [k2: number]: Cfg_Pet2Reborn } }结构时，key需传字段名,如'k1>k2',以此类推
     * * 3.支持回调的键值。为处理现在代码中的this.getTaskKey()为键的情况，计划支持中，暂不支持,因支持将可能带来不可预知的计算量,建议此类数据日后另谋他路
     * @param value 储存值,不传或undefined则为整个数据结构,传值将只保存一个值
     */
    public constructor(cfgmI: CfgManager, tableName: string, key?: string, value?: string) {
        this.CfgmI = cfgmI;
        this.TableName = tableName;
        this.Key = key;
        this.Value = value;
        this.inited = true;
    }

    protected walk(data: any, index: number): void {
        //
    }

    protected _walk(): void {
        if (this.Walked) {
            return;
        }

        this.Walked = true;

        let k1: string[] = [];
        if (!Utils.isNullOrUndefined(this.Key)) {
            k1 = this.Key.split('>');
        }
        const tmp = this.CfgmI.getCfgDatas(this.TableName);
        if (Utils.isNullOrUndefined(tmp) || !(tmp.length > 0)) { return; }
        tmp.forEach((data, index: number) => {
            const keys: string[] = [];
            for (let j = 0; j < k1.length; j++) {
                let k = '';
                if (k1[j].length > 0) {
                    const k2 = k1[j].split(',');
                    for (let l = 0; l < k2.length; l++) {
                        if (k.length > 0) {
                            k += '_';
                        }
                        k += data[k2[l]] !== undefined && data[k2[l]] !== null ? data[k2[l]] : '';
                    }
                }
                keys.push(k);
            }
            if (keys.length === 1) {
                this.IdsByIndex.push(keys[0]);
                this.IdsLength++;
            } else {
                let d = this.IndexsByKey as any[];
                while (keys.length > 0) {
                    const k = keys.shift();
                    if (!d) d = k.length > 0 ? js.createMap(true) : [];
                    if (keys.length === 0) {
                        if (k.length > 0) d[k] = index;
                        if (k.length === 0) d.push(index);
                    } else {
                        if (!d[k]) d[k] = keys[0] === '' ? [] : js.createMap(true);
                        d = d[k];
                    }
                }
            }
            this.walk(data, index);
        });
    }

    /**
     * 获取字段值，根据索引，字段名
     * @param index 索引
     * @param key 字段名
     * @param defaultValue 默认值
     * @returns 字段值 | 默认值
     */
    public select<T>(name: string, index: number): T {
        if (typeof index !== 'number') { return undefined; }
        this._walk();
        if (index >= 0) {
            return this.CfgmI.getCfgDataValue(this.TableName, index, name);
        }
        return undefined;
    }

    /**
     * 获取字段值，根据唯一key值，字段名
     * @param key 唯一key值
     * @param name 字段名
     * @param defaultValue 默认值
     * @returns 字段值 | 默认值
     */
    public selectByKey<T>(key: string, name: string, ...args): T {
        if (Utils.isNullOrUndefined(name)) { return undefined; }
        this._walk();

        if (this.IdsLength > 0) {
            const index = this.IdsByIndex.indexOf(key);
            return this.select(name, index);
        } else {
            let d = this.IndexsByKey[name];
            while (args.length > 0) {
                if (!d) { return undefined; }
                const k: string = args.shift();
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                d = d[k];
            }
            return this.select(key, d);
        }
    }

    /** 根据索引获取单条数据 */
    public getDataByIndex<T>(index: number): T {
        return this.CfgmI.getCfgOneData(this.TableName, index);
    }

    /** 根据key获取单条数据 */
    public getDataByKey<T>(key: string, object?:T): T {
        if (Utils.isNullOrUndefined(key)) { return undefined; }
        this._walk();
        if (this.IdsLength > 0) {
            const index = this.IdsByIndex.indexOf(key);
            return this.getDataByIndex(index);
        } else {
            const index = this.IndexsByKey[key];
            return this.getDataByIndex(index);
        }
    }
}
