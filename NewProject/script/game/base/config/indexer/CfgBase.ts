/** import {' js } 'from 'cc';  // */
import { CfgData, ConfigInfo } from '../ConfigConst';
import { ConfigMgr } from '../ConfigMgr';

interface IIndexer {
    /**
     * 可重写，数据每一行会执行这里，是在执行initItem之前
     * @param data 每一行数据， 类型：Cfg_XX
     * @param index 当前行的索引
     */
    walk: (data: unknown, index: number) => void;
    /**
     * 可重写，数据每一行会执行这里，是在执行initItem之后
     * @param tableName 表名
     * @param data 每一行数据， 类型：Cfg_XX
     * @param index 当前行的索引
     */
    walks: (tableName: string, data: unknown, index: number) => void;
    walkEx: (info: ConfigInfo, data: unknown, index: number) => void;
}

export class CfgBase {
    public constructor(cfgInfo: ConfigInfo) {
        this.cfgInfo = cfgInfo;
        cfgInfo.key.split('>').forEach((k) => {
            if (k) {
                this._keyCount++;
            }
        });
    }

    public static Debug = false;

    /** 嵌套key数量 */
    private _keyCount = 0;
    public get keyCount(): number {
        return this._keyCount;
    }
    public cfgInfo: ConfigInfo;
    /** 根据索引存储的对应key列表 */
    public keysByIndex = [];
    public keysLength = 0;
    public length = 0;

    /** 配置表转换的键值结构体 */
    private _nestedMap: CfgData = cc.js.createMap(true);
    public get nestedMap(): unknown {
        return this._nestedMap;
    }

    public walkDatas(datas: object[], indexer: unknown): void {
        if (datas === null || datas === undefined || !(datas.length > 0)) { return; }
        const info = this.cfgInfo;
        const tableName = info.name;
        if (CfgBase.Debug) {
            console.time(`${tableName}_walk耗时`);
        }
        const key = info.key;
        /** 嵌套组合key列表 */
        let nestedCombinationKeys: string[] = [];
        if (key !== null && key !== undefined) {
            nestedCombinationKeys = key.split('>');
        }
        const keys = [];
        /** 拼接key */
        let spliceKey: string | number = null;
        /** 字段值 */
        let fieldValue: string | number = null;
        /** 组合key列表 */
        let tmpCombinationKeys: string[] = [];
        const clsIndexer: IIndexer = indexer as IIndexer;
        datas.forEach((data, index: number) => {
            // continue;
            this.length++;
            clsIndexer.walk(data, index);
            if (!info.ex || !info.ex.deleteSource) {
                ConfigMgr.I.initItem(tableName, data);
            }
            spliceKey = '';
            fieldValue = null;
            keys.length = 0;
            tmpCombinationKeys.length = 0;
            nestedCombinationKeys.forEach((tmpCombinationKey) => {
                spliceKey = '';
                if (tmpCombinationKey.length > 0) {
                    tmpCombinationKeys = tmpCombinationKey.split(',');
                    // if (tmpCombinationKeys.length > 1) { // 是组合key
                    tmpCombinationKeys.forEach((fieldName) => {
                        fieldValue = data[fieldName];
                        if (fieldValue !== undefined && fieldValue !== null) {
                            if (spliceKey !== '') {
                                spliceKey += `_${fieldValue}`;
                            } else {
                                spliceKey = fieldValue;
                            }
                        }
                    });
                }
                keys.push(spliceKey);
            });
            if (keys.length === 1) {
                this.keysByIndex.push(keys[0]);
                this.keysLength++;
            } else {
                let d: { [key: string]: any } = this.nestedMap as { [key: string]: any; };
                let isLast = false;
                for (let i = 0, n = keys.length; i < n; i++) {
                    isLast = (i + 1) >= n;
                    const k: number | string = keys[i];
                    const nextk: number | string = keys[i + 1];
                    if (!d) {
                        if (typeof k === 'number' || k.length > 0) {
                            d = cc.js.createMap(true);
                        } else {
                            d = [];
                        }
                    }
                    if (isLast) {
                        if (typeof k === 'number' || k.length > 0) {
                            d[k] = index;
                        } else if (k === '') {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                            d.push(index);
                        }
                    } else {
                        if (!d[k]) {
                            if (nextk === '') {
                                d[k] = [];
                            } else {
                                d[k] = cc.js.createMap(true);
                            }
                        }
                        d = d[k];
                    }
                }
            }
            clsIndexer.walks(tableName, data, index);
            if (info.ex) {
                clsIndexer.walkEx(info, data, index);
            }
            // console.log('data=', data);
        });
        if (CfgBase.Debug) {
            console.timeEnd(`${tableName}_walk耗时`);
        }
    }

    private parseArgs(args: any[], length?: number): any[] {
        length = length || args.length;
        const firstArg = args[0];
        let keys: (number | string)[] = [];
        if (length <= this.keyCount) {
            if (typeof firstArg === 'string') {
                keys = this.getArgsByKey(firstArg);
            } else {
                keys = args.concat();
            }
            args.splice(0, this.keyCount);
        } else {
            keys = args.splice(0, this.keyCount) as (string[] | number[]);
        }
        return keys;
    }
    /**
     * 根据key拆分多个参数
     * @param key key
     */
    private getArgsByKey(key: string) {
        const args = key.split('_');
        return args;
    }

    public getValueByIndex<T>(index: number): T
    public getValueByIndex<T>(index: number, key: string): T
    public getValueByIndex<T>(index: number, outObject: T): T
    public getValueByIndex<T>(index: number, outObject?: T): T {
        if (index !== 0 && !index) { return undefined; }
        return this._getValueByIndex(this.cfgInfo.name, index, outObject);
    }

    protected _getValueByIndex<T>(cfgName: string, index: number): T
    protected _getValueByIndex<T>(cfgName: string, index: number, key: string): T
    protected _getValueByIndex<T>(cfgName: string, index: number, outObject: T): T
    protected _getValueByIndex<T>(cfgName: string, index: number, outObject?: T): T {
        const data = this.getData(index, cfgName);
        if (outObject && typeof outObject === 'string') {
            const value = outObject ? data[outObject] : data;
            return value as T;
        } else {
            return data as T;
        }
    }

    public getValueByKey<T>(...args: (number | string | object)[]): T | undefined {
        /** 参数列表数量 */
        const argLen = args.length;
        if (argLen === 0) { return undefined; }
        const keys = this.parseArgs(args, argLen);
        const data: T = this.getDataByKey(...keys);
        if (!data) { return undefined; }
        const key = args[0];
        if (key && typeof key === 'string') {
            return data[key] as T;
        } else {
            return data;
        }
    }
    /** 根据key获取单条数据 */
    public getDataByKey<T>(...args: (number | string)[]): T {
        /** 第一个参数 */
        const firstArg = args[0];
        if (!firstArg && firstArg !== 0) { return undefined; }
        if (this.keysLength > 0) {
            // const key = this.getKeyByArgs(args);
            const index = this.keysByIndex.indexOf(firstArg);
            return this.getData(index);
        } else {
            let value;
            if (typeof firstArg === 'string' && !args[1]) {
                // 只有一个参数，并且该参数是字符串
                args = this.getArgsByKey(firstArg);
            }
            for (let i = 0, n = args.length; i < n; i++) {
                if (value === undefined || value === null) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    value = this._nestedMap[args[i]];
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    value = value[args[i]];
                }
                if (value === undefined || value === null) {
                    return undefined;
                }
            }
            if (typeof value === 'number') {
                return this.getData(value);
            } else {
                return value as T;
            }
        }
    }
    /** 根据索引获取单条数据 */
    public getData<T>(index: number, tbName?: string): T {
        return ConfigMgr.I.getOneData(tbName || this.cfgInfo.name, index);
    }
}
