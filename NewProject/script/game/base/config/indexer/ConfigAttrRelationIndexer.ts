/*
 * @Author: zs
 * @Date: 2022-09-29 12:03:05
 * @FilePath: \SanGuo\assets\script\game\base\config\indexer\ConfigAttrRelationIndexer.ts
 * @Description:
 *
 */
import { UtilArray } from '../../../../app/base/utils/UtilArray';
import { EShowAttrType } from '../../attribute/AttrConst';
import { Config } from '../Config';
import { ConfigIndexer } from './ConfigIndexer';

interface IShowAttrType { Attr: number, Sort: number, PercentType: boolean }

const { ccclass } = cc._decorator;
@ccclass('ConfigAttrRelationIndexer')
export class ConfigAttrRelationIndexer extends ConfigIndexer {
    private static _i: ConfigAttrRelationIndexer = null;
    public static get I(): ConfigAttrRelationIndexer {
        if (!this._i) {
            this._i = new ConfigAttrRelationIndexer(Config.Type.Cfg_Attr_Relation);
        }
        return this._i;
    }
    private showAttrTypes: { [type: number]: IShowAttrType[], len: number } = cc.js.createMap(true);

    protected walk(data: Cfg_Attr_Relation, index: number): void {
        if (data.IsShow !== 1) {
            this.showAttrTypes.len = this.showAttrTypes.len || 0;
            if (this.showAttrTypes[data.AttrType] === undefined) {
                this.showAttrTypes.len += 1;
            }
            const attrKeys: IShowAttrType[] = this.showAttrTypes[data.AttrType] = this.showAttrTypes[data.AttrType] || [];
            UtilArray.Insert(attrKeys, { Attr: data.Attr, Sort: data.Sort, PercentType: data.PercentType === 1 }, (d: IShowAttrType) => d.Sort);
        }
    }

    /** 类型数量 */
    public getTypesVals(): number {
        this._walks();
        return this.showAttrTypes.len;
    }

    /**
     * 根据显示类型获取该类型的属性列表
     * @param type 显示类型
     * @returns
     */
    public getShowAttrTypes(type: EShowAttrType): IShowAttrType[] {
        this._walks();
        return this.showAttrTypes[type] || [];
    }
}
