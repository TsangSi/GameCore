/*
 * @Author: zs
 * @Date: 2022-12-06 15:05:28
 * @FilePath: \SanGuo2.4-main\assets\script\game\base\config\indexer\ConfigCollectionBookIndexer.ts
 * @Description:
 *
 */
import { ECollectionBookTabId } from '../../../module/collectionBook/CollectionBookConst';
import { Config } from '../Config';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;

interface ITypeArray {
    [type: number]: number[]
}
@ccclass('ConfigCollectionBookIndexer')
export class ConfigCollectionBookIndexer extends ConfigIndexer {
    private static _i: ConfigCollectionBookIndexer;
    public static get I(): ConfigCollectionBookIndexer {
        if (!this._i) {
            this._i = new ConfigCollectionBookIndexer(Config.Type.Cfg_CollectionBook, Config.Type.Cfg_CollectionBookType);
        }
        return this._i;
    }
    private indexByStage: { [stage: number]: number } = cc.js.createMap(true);
    private indexsByClass: { [cls: number]: ITypeArray | number[] } = cc.js.createMap(true);
    protected walks(tableName: string, data: unknown, index: number): void {
        if (tableName === Config.Type.Cfg_CollectionBook.name) {
            this.walkBook(data as Cfg_CollectionBook, index);
        } else if (tableName === Config.Type.Cfg_CollectionBookType.name) {
            this.walkBookType(data as Cfg_CollectionBookType, index);
        }
    }
    private walkBook(data: Cfg_CollectionBook, index: number): void {
        const subs: { [subType: number]: number[] } = this.indexsByClass[data.Class] = this.indexsByClass[data.Class] || cc.js.createMap(true);
        const indexss = subs[data.SubType] = subs[data.SubType] || [];
        indexss.push(index);
        if (data.Class === ECollectionBookTabId.Career) {
            this.indexByStage[data.UnlockParam] = index;
        }
    }

    private subTypeName: { [subType: number]: string } = cc.js.createMap(true);
    private classTypeName: { [classType: number]: string } = cc.js.createMap(true);
    private walkBookType(data: Cfg_CollectionBookType, index: number): void {
        if (data.SubType) {
            this.subTypeName[data.SubType] = data.Name;
        }
        if (data.Class && !this.classTypeName[data.Class]) {
            this.classTypeName[data.Class] = data.Name;
        }
    }

    private sortType: number[] = [];
    /**
     * 获取数组
     * @param cls 大类别
     * @param sub 小类别
     * @returns
     */
    public getIndexsByClass(cls: number, sub?: number): number[] {
        this._walks();
        let type: number = cls;
        const subs = this.indexsByClass[cls];
        let indexs: number[] = [];
        // eslint-disable-next-line dot-notation
        if (subs && subs['length'] >= 0) {
            indexs = subs as number[];
        } else if (subs) {
            indexs = subs[sub] as number[];
            type = sub;
        }
        if (indexs && this.sortType.indexOf(type) < 0) {
            indexs.sort((a, b) => {
                const c1: Cfg_CollectionBook = this.getValueByIndex(a);
                const c2: Cfg_CollectionBook = this.getValueByIndex(b);
                return c1.Sort - c2.Sort;
            });
            this.sortType.push(type);
        }
        return indexs || [];
    }

    /**
     * 根据大类别获取小类别数组
     * @param cls 大类别
     * @returns
     */
    public getSubTypesByClass(cls: number): number[] {
        this._walks();
        const subTypes: number[] = [];
        if (this.indexsByClass[cls]) {
            for (const k in this.indexsByClass[cls]) {
                subTypes.push(+k);
            }
        }
        return subTypes;
    }

    /**
     * 获取小类别名字
     * @param subType 小类别
     * @returns
     */
    public getSubTypeName(subType: number): string {
        this._walks();
        return this.subTypeName[subType] || '';
    }
    /**
     * 获取大类别名字
     * @param classType 大类别
     * @returns
     */
    public getClassName(classType: number): string {
        this._walks();
        return this.classTypeName[classType] || '';
    }

    /** 根据关卡获取生涯对应的索引 */
    public getIndexByStage(stage: number): number {
        this._walks();
        return this.indexByStage[stage];
    }
}
