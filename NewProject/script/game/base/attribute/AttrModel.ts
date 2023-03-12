/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Config } from '../config/Config';
import { ConfigAttributeIndexer } from '../config/indexer/ConfigAttributeIndexer';
import { IAttrBase, IAttrInfo } from './AttrConst';
import { AttrInfo } from './AttrInfo';

/*
 * @Author: zs
 * @Date: 2022-06-22 20:20:20
 * @FilePath: \SanGuo2.4-main\assets\script\game\base\attribute\AttrModel.ts
 * @Description:
 */
export class AttrModel {
    /**
     * 生成一个属性Info类
     * @param attrId 属性id
     */
    public static MakeAttrInfo(...intAttrs: IntAttr[]): AttrInfo;
    public static MakeAttrInfo(...intAttrs: IntAttr1[]): AttrInfo;
    public static MakeAttrInfo(...Ids: number[]): AttrInfo;
    public static MakeAttrInfo(...intAttrsORIds: number[] | IntAttr[] | IntAttr1[]): AttrInfo {
        if (intAttrsORIds.length <= 0) {
            return new AttrInfo();
        }
        if (typeof intAttrsORIds[0] === 'number') {
            return this.MakeAttrInfoByIds(intAttrsORIds as number[]);
        } else {
            return this.MakeAttrInfoByAttr(intAttrsORIds as IntAttr[] | IntAttr1[]);
        }
    }

    private static MakeAttrInfoByIds(Ids: number[]): AttrInfo {
        const attrs: IAttrInfo[] = [];
        let a: IAttrBase[];
        Ids.forEach((attrId) => {
            a = this.Indexer.getAttrsById(attrId);
            const b: { attrs: IAttrBase[] } = cc.js.createMap(true);
            if (a.length > 0) {
                b.attrs = this.Indexer.getAttrsById(attrId);
            }
            attrs.push(b);
        });
        return new AttrInfo(...attrs);
    }

    private static MakeAttrInfoByAttr(intAttrs: IntAttr[] | IntAttr1[]): AttrInfo {
        const attrs: IAttrBase[] = [];
        intAttrs.forEach((intAttr) => {
            // IntAttr1 属性
            if (intAttr.V1) {
                attrs.push({ attrType: intAttr.K, value: intAttr.V1 });
            } else {
                attrs.push({ attrType: intAttr.K, value: intAttr.V });
            }
        });
        return new AttrInfo(...attrs);
    }

    private static _indexer: ConfigAttributeIndexer;
    public static get Indexer(): ConfigAttributeIndexer {
        if (!this._indexer) {
            this._indexer = Config.Get<ConfigAttributeIndexer>(Config.Type.Cfg_Attribute);
        }
        return this._indexer;
    }

    /**
     * 根据当前等级，获取属性倍率
     * @param Lv 当前等级
     * @param MaxLv 当前区间最大等级
     * @param Ratio 当前等级段属性加成万分比
     * @param TotalRatio 当前等级总万分比
     */
    public static getLevelRation(lv: number, maxLv: number, ratio: number, totalRatio: number): number {
        const ration = totalRatio - (maxLv - lv) * ratio;
        return ration / 10000;
    }
}
