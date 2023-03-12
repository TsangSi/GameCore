import { UtilArray } from '../../../../app/base/utils/UtilArray';
import { NumberS } from '../../../const/GameConst';
import { ConfigInfo, ConfigInfoEx } from '../ConfigConst';
import { ConfigMgr } from '../ConfigMgr';
import { CfgBase } from './CfgBase';

let CfgMgrI: ConfigMgr;

export class ConfigIndexer {
    protected get CfgmI(): ConfigMgr {
        if (!CfgMgrI) {
            CfgMgrI = ConfigMgr.I;
        }
        return CfgMgrI;
    }

    protected CfgBaseData: { [name: string]: CfgBase } = {};
    /** 默认第一个表名 */
    protected TableName: string = '';
    protected Walked = false;
    public static I: ConfigIndexer;
    public constructor(...ConfigInfos: ConfigInfo[]) {
        for (let i = 0, n = ConfigInfos.length; i < n; i++) {
            const info = ConfigInfos[i];
            if (!this.TableName) {
                this.TableName = info.name;
            }
            this.CfgBaseData[info.name] = new CfgBase(info);
        }
    }

    /**
     *  获取指定key值的表长
     */
    public get keysLength(): number {
        this._walks();
        return this.CfgBaseData[this.TableName].keysLength;
    }

    /**
     * 获取整张表的长度
     */
    public get length(): number {
        this._walks();
        return this.CfgBaseData[this.TableName].length;
    }

    /**
     * 可重写，数据每一行会执行这里，是在执行initItem之后
     * @param tableName 表名
     * @param data 每一行数据， 类型：Cfg_XX
     * @param index 当前行的索引
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected walks(tableName: string, data: unknown, index: number): void { /** */ }

    /**
     * 可重写，数据每一行会执行这里，是在执行initItem之前
     * @param data 每一行数据， 类型：Cfg_XX
     * @param index 当前行的索引
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected walk(data: unknown, index: number): void { /** */ }

    /**
     * 扩展区间的处理
     * @param info ConfigInfo
     * @param data 每一行数据， 类型：Cfg_XX
     * @param index 当前行的索引
     */
    protected walkEx(info: ConfigInfo, data: unknown, index: number): void {
        if (info.ex.intervalKey) {
            this.walkInterval(info.name, info.ex, data, index);
        }
    }

    public getKeys(tableName: string = this.TableName): any[] {
        this._walks();
        return this.CfgBaseData[tableName].keysByIndex;
    }

    protected _walks(): void {
        if (this.Walked) {
            return;
        }
        this.Walked = true;
        for (const name in this.CfgBaseData) {
            this.CfgBaseData[name].walkDatas(this.CfgmI.getDatas(name), this);
        }
    }

    // /**
    // //  * 获取一条数据，根据索引，字段名
    // //  * @param name 字段名
    // //  * @param index 索引
    // //  * @returns 字段值
    // //  */
    // // public getValue<T>(index: number): T | undefined;
    // // /**
    // //   * 获取一条数据，根据索引，字段名
    // //   * @param name 字段名
    // //   * @param index 索引
    // //   * @returns 字段值
    // //   */
    // // public getValue<T extends object>(index: number): T | undefined;
    // // /**
    // //  * 获取单个字段值，根据索引，字段名
    // //  * @param name 字段名
    // //  * @param index 索引
    // //  * @returns 字段值
    // //  */
    // // public getValue<T>(index: number, name: string): T | undefined;

    /**
     * 获取一条数据，根据索引
     * @param index 索引
     * @returns object
     */
    public getValueByIndex<T>(index: number): T
    public getValueByIndex<T>(index: number, key: string): T
    public getValueByIndex<T extends object>(index: number, outObject: T): T
    public getValueByIndex<T extends object>(index: number, outObject?: T): T {
        return this._getValueByIndex(this.TableName, index, outObject);
    }

    protected _getValueByIndex<T>(tabName: string, index: number): T
    protected _getValueByIndex<T>(tabName: string, index: number, key: string): T
    protected _getValueByIndex<T extends object>(tabName: string, index: number, outObject: T): T
    protected _getValueByIndex<T extends object>(tabName: string, index: number, outObject?: T): T {
        if (index !== 0 && !index) { return undefined; }
        this._walks();
        const cls = this.CfgBaseData[tabName];
        return cls?.getValueByIndex(index, outObject);
    }

    // /**
    //  * 获取单条数据，根据唯一key值
    //  * @param key key值
    /**
     * ```ts
     * // 两个key以上的示例：
     * getValueByKey('key1_key2'); // 获取对应的单条数据
     * getValueByKey(key1, key2); // 获取对应的单条数据
     *```
     */
    public getValueByKey<T>(key: string | number): T | undefined
    public getValueByKey<T>(key: string | number, valueName: string): T | undefined
    public getValueByKey<T extends object>(key: string | number, outObject: T): T | undefined
    public getValueByKey<T extends object>(key: string | number, key2: string | number): T | undefined
    public getValueByKey<T>(key: string | number, key2: string | number, valueName: string): T | undefined
    public getValueByKey<T extends object>(key: string | number, key2: string | number, outObject: T): T | undefined
    public getValueByKey<T extends object>(key: string | number, key2: string | number, key3: string | number): T | undefined
    public getValueByKey<T>(key: string | number, key2: string | number, key3: string | number, valueName: string): T | undefined
    public getValueByKey<T extends object>(key: string | number, key2: string | number, key3: string | number, outObject: T): T | undefined
    public getValueByKey<T>(...args: (number | string | object)[]): T | undefined {
        return this._getValueByKey(this.TableName, ...args);
    }

    protected _getValueByKey<T>(tabName: string, ...args: (number | string | object)[]): T {
        /** 参数列表数量 */
        const argLen = args.length;
        if (argLen === 0) { return undefined; }
        this._walks();
        const cls = this.CfgBaseData[tabName];
        if (cls) {
            return cls.getValueByKey(...args);
        }

        return undefined;
    }

    /** 根据索引获取单条数据 */
    protected getData<T>(index: number): T {
        this._walks();
        return this.CfgmI.getOneData(this.TableName, index);
    }

    /** 最大的-区间列表 */
    protected maxIntervals: { [tbName: string]: number[] | { [tbName: string]: number[] }[] } = cc.js.createMap(true);
    protected walkInterval(tbName: string, ex: ConfigInfoEx, data: unknown, index: number): void {
        let interData: unknown;
        if (ex.types && ex.types.length) {
            interData = this.maxIntervals[tbName] = this.maxIntervals[tbName] || cc.js.createMap(true);
        } else {
            interData = this.maxIntervals[tbName] = this.maxIntervals[tbName] || [];
        } if (ex.types) {
            let k: string;
            for (let i = 0, n = ex.types.length; i < n; i++) {
                k = data[ex.types[i]];
                if ((i + 1) === ex.types.length) {
                    interData[k] = interData[k] || [];
                } else {
                    interData[k] = interData[k] || cc.js.createMap(true);
                }
                interData = interData[k];
            }
            const list = interData as { v: number, index: number }[];
            list.push({ v: data[ex.intervalKey], index });
        } else {
            const list: number[] = interData as number[];
            list.push(data[ex.intervalKey]);
        }
    }

    /**
     * 找到相近值的索引
     * @param value 要查找的值
     * @param tbName 表名，可选，如果有多个表 并且 不是从第一个表查找
     */
    public getIntervalIndex(...args: any[]): number {
        return this._getIntervalIndex(this.TableName, ...args);
    }

    protected _getIntervalIndex(tabName: string, ...args: any[]): number {
        this._walks();
        let list: unknown = this.maxIntervals[tabName];
        const info = this.CfgBaseData[tabName].cfgInfo;
        if (info.ex && info.ex.intervalKey) {
            if (info.ex.types) {
                for (let i = 0, n = info.ex.types.length; i < n; i++) {
                    if (list) {
                        list = list[args.shift() as number];
                    }
                }
                if (!list) return -1;
                const index = UtilArray.LowerBound(list as any, { v: args[args.length - 1] }, (obj: { v: number }) => obj.v);
                const tmpList1 = list as { v: number, index: number }[];
                if (tmpList1[index] === null || tmpList1[index] === undefined) {
                    return this.length;
                } else {
                    return tmpList1[index].index;
                }
            } else {
                const tmpList2: number[] = list as number[];
                return UtilArray.LowerBound(tmpList2, args[args.length - 1]);
            }
        }
        return -1;
    }

    /** 根据条件id 获取区间数据
     * interval 区间中的值
    */
    public getIntervalData<T extends object>(interval: number): T | undefined;
    public getIntervalData<T extends object>(key: NumberS, interval: number): T | undefined;
    public getIntervalData<T extends object>(key1: NumberS, key2: NumberS, interval: number): T | undefined;
    public getIntervalData<T extends object>(...args: any[]): T | undefined {
        // 38
        const index: number = this.getIntervalIndex(...args);
        if (index < 0) { // 未找到数据
            return undefined;
        }
        const d = this.getValueByIndex(index);
        if (!d) { return undefined; }
        // d {Id: 39}
        const info = this.CfgBaseData[this.TableName].cfgInfo;
        // 'Id'
        if (info.ex && info.ex.intervalKey) {
            // 39
            const interValue: number = d[info.ex.intervalKey];
            // 39
            const checkkValue: number = args[args.length - 1];
            // 需要检测查找的值 大于 当前找到的配置表的值就属于超出边界
            if (checkkValue > interValue) {
                return undefined;
            }
        }
        return d as T;
    }

    public getIntervalDataByTableName<T extends object>(tabName: string, ...args: any[]): T | undefined {
        const index: number = this._getIntervalIndex(tabName, ...args);
        if (index < 0) { // 未找到数据
            return undefined;
        }
        const d = this.getValueByIndex(index);
        if (!d) { return undefined; }
        const info = this.CfgBaseData[tabName].cfgInfo;
        if (info.ex && info.ex.intervalKey) {
            const interValue: number = d[info.ex.intervalKey];
            const checkkValue: number = args[args.length - 1];
            // 需要检测查找的值 大于 当前找到的配置表的值就属于超出边界
            if (checkkValue > interValue) {
                return undefined;
            }
        }
        return d as T;
    }

    public getNestedMap(): unknown {
        this._walks();
        return this.CfgBaseData[this.TableName].nestedMap;
    }

    /**
     * 遍历整张表，尽量少用
     * @param callback 遍历回调，如果不需要继续遍历，回调里return false就会停止遍历
     * @returns
     */
    public forEach<T>(callback: (cfg: T, index: number) => boolean): void {
        this._walks();
        for (let i = 0, n = this.length; i < n; i++) {
            if (callback(this.getValueByIndex(i), i) === false) {
                return;
            }
        }
    }

    /**
     * 主要用于活动类的数据转换处理。活动类的数据表前端不导出，通过协议以json方式发给前端。
     * @param jsonData 数据
     */
    public setActivityDatas(tabName: string, jsonData: string[]): void {
        const datas = this.CfgmI.setActivityDatas(tabName, jsonData, true);
        if (datas.length > 0) {
            this.Walked = true;
            this.CfgBaseData[tabName].walkDatas(datas, this);
        }
    }
}
