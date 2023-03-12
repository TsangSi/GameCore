/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilString } from '../../../app/base/utils/UtilString';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { RES_ENUM } from '../../const/ResPath';
import { ViewConst } from '../../const/ViewConst';
import { AttrBase } from '../attribute/AttrBase';
import {

    EAttrShowType, IAttrBase, IAttrDetailTipCfg, IShowAttrOption,

} from '../attribute/AttrConst';
import { AttrInfo } from '../attribute/AttrInfo';
import { AttrModel } from '../attribute/AttrModel';
import { Config } from '../config/Config';
import { ConfigAttributeIndexer } from '../config/indexer/ConfigAttributeIndexer';
import UtilItem from './UtilItem';

/*
 * @Author: zs
 * @Date: 2022-06-23 17:30:18
 * @FilePath: \SanGuo2.4\assets\script\game\base\utils\UtilAttr.ts
 * @Description:
 */
export class UtilAttr {
    /**
     *
     * @param attrs IntAttr属性列表 [ {K, V}, {K, V}]
     * @param shoType 显示类型，AttrInfo.ShowAttrType
     * @param option 可选扩展object{ s: '', nameC: string, valueC: string, Column: number }
     * @returns
     */
    public static GetShowAttrStr(attrs: IntAttr[], shoType: EAttrShowType, option?: IShowAttrOption): string;
    /**
      *
      * @param attrs IAttrBase [ {attrType, value, name}, {attrType, value, name}]
      * @param showType 显示类型，AttrInfo.ShowAttrType
      * @param option 可选扩展object{ s: '', nameC: string, valueC: string, Column: number }
      * @returns
      */
    public static GetShowAttrStr(attrs: IAttrBase[], showType: EAttrShowType, option?: IShowAttrOption): string;
    public static GetShowAttrStr(attrs: IntAttr[] | IAttrBase[], showType: EAttrShowType, option?: IShowAttrOption): string {
        if (!attrs) { return ''; }

        let attrStr = '';
        let nameColor;
        let valueColor;
        /** 是否有颜色 */
        const hasColor = showType.indexOf('color') >= 0;
        if (hasColor) {
            nameColor = option?.nameC || UtilColor.NorV;
            valueColor = option?.valueC || UtilColor.GreenV;
        }
        const column = option?.Column || 0;
        const s = option?.s || '\n';
        const len = attrs.length;
        let name = '';
        let value = 0;
        attrs.sort((a, b) => {
            if (a.K) {
                return a.K - b.K;
            }
            return a.attrType - b.attrType;
        });
        attrs.forEach((element: any, index) => {
            if (element.K) {
                name = UtilAttr.GetAttrName(element.K);
                value = element.V;
            } else {
                name = element.name || UtilAttr.GetAttrName(element.attrType);
                value = element.value;
            }

            if (hasColor) {
                attrStr += UtilString.FormatArgs(showType, nameColor, name, valueColor, value);
            } else {
                attrStr += UtilString.FormatArgs(showType, name, value);
            }
            if (column > 0 && index % column === 0 && index !== len - 1) {
                attrStr += '\n';
            } else if (index !== len - 1) {
                attrStr += s;
            }
        });
        return attrStr;
    }

    public static GetShowAttr1Str(attrs: IntAttr1[]): string {
        if (!attrs) { return ''; }

        let attrStr = '';
        const len = attrs.length;
        attrs.sort((a, b) => a.K - b.K);
        attrs.forEach((element: IntAttr1, index) => {
            const name = UtilAttr.GetAttrName(element.K);
            const value = element.V1;
            const color = UtilItem.GetItemQualityColor(element.V2, true);// 富文本彩色不做处理

            attrStr += UtilString.FormatArgs(`<color={0}>{1}: {2}</c>`, color, name, value);
            if (index < len) {
                attrStr += '\n';
            }
        });
        return attrStr;
    }

    public static GetAttrs(attrs: IntAttr[]): string {
        if (!attrs) { return ''; }

        let attrStr = '';
        attrs.sort((a, b) => a.K - b.K);
        attrs.forEach((element: IntAttr, index) => {
            const name = UtilAttr.GetAttrName(element.K);
            const value = element.V;
            attrStr += UtilString.FormatArgs(`{0}+{1}\n`, name, value);
        });
        return attrStr;
    }

    public static GetAttrBaseListById(attrId: number): IAttrBase[] {
        const indexer = Config.Get<ConfigAttributeIndexer>(Config.Type.Cfg_Attribute);
        const attrs: IAttrBase[] = indexer.getAttrsById(attrId);
        return attrs;
    }

    /**
     * 获取属性的进阶类型
     * @param attrId
     * @returns IAttrBase
     */
    public static GetAttrBaseGradeType(attrId: number): IAttrBase {
        const indexer = Config.Get<ConfigAttributeIndexer>(Config.Type.Cfg_Attribute);
        return indexer.getAttrGradeTypeById(attrId);
    }

    /**
     * 获取属性的扩展属性
     * @param attrId
     * @returns IAttrBase
     */
    public static GetAttrBaseExtra(attrId: number): IAttrBase {
        const indexer = Config.Get<ConfigAttributeIndexer>(Config.Type.Cfg_Attribute);
        return indexer.getAttrExtraById(attrId);
    }
    /**
     * 根据属性类型 获得图标URL
     * @param attrType 属性类型
     * @returns 图标路径
     * @author ylj
     */
    public static getIconByAttrType(attrType: number): string {
        return `${RES_ENUM.Com_Icon_Com_Icon_Attr}${attrType}`;
    }

    /**
     * 获取Tips强化属性字符串
     * @param baseAttrIdOrAttrs
     * @param strengthAttrIdOrAttrs
     * @returns string
     */
    public static GetTipsStrengthAttrStr(baseAttrIdOrAttrs: number | IAttrBase[], strengthAttrIdOrAttrs: number | IAttrBase[]): string {
        let ret = '';
        // 基础属性
        let baseAttrs: IAttrBase[] = [];
        if (typeof baseAttrIdOrAttrs === 'number') {
            baseAttrs = this.GetAttrBaseListById(baseAttrIdOrAttrs);
        } else {
            baseAttrs = baseAttrIdOrAttrs;
        }

        // 强化属性
        let strengthAttrs: IAttrBase[] = [];
        if (typeof strengthAttrIdOrAttrs === 'number') {
            strengthAttrs = this.GetAttrBaseListById(strengthAttrIdOrAttrs);
        } else {
            strengthAttrs = strengthAttrIdOrAttrs;
        }

        // 对比属性增加项
        for (let i = 0; i < baseAttrs.length; i++) {
            const bAttr = baseAttrs[i];
            let sAttrValue = 0;
            for (let j = 0; j < strengthAttrs.length; j++) {
                const sAttr = strengthAttrs[j];
                if (bAttr.attrType === sAttr.attrType) {
                    sAttrValue = sAttr.value;
                    break;
                }
            }
            if (sAttrValue > 0) {
                ret += `+${sAttrValue}\n`;
            } else {
                ret += '\n';
            }
        }
        return ret;
    }

    /**
     * 获取Tips强化属性和战力详情字符串
     * @param baseAttrIdOrAttrs 基础属性
     * @param strengthAttrInfo 强化属性
     * @returns [attrStr, fvDetailStr]
     */
    public static GetTipsStrengthFvAttrStr(baseAttrIdOrAttrs: number | IAttrBase[], strengthAttrInfo: AttrInfo): [number, string] {
        let fv = 0;
        let attrStr = '';
        if (strengthAttrInfo) {
            fv = strengthAttrInfo.fightValue;
            attrStr = UtilAttr.GetTipsStrengthAttrStr(baseAttrIdOrAttrs, strengthAttrInfo.attrs);
        }
        return [fv, attrStr];
    }

    /** 打开战力详情界面 */
    public static OpenAttrDetailWin(attrInfoCfg: IAttrDetailTipCfg[], showType: EAttrShowType, option?: IShowAttrOption): void {
        const cfgs = [];
        for (let i = 0; i < attrInfoCfg.length; i++) {
            const cfg = attrInfoCfg[i];
            const attrId = cfg.attrId;
            const attr = AttrModel.MakeAttrInfo(attrId);
            const content = this.GetShowAttrStr(attr.attrs, showType, option);
            cfgs.push({ title: cfg.title, data: content });
        }
        WinMgr.I.open(ViewConst.AttrDetailTips, cfgs);
    }
    /**
     * 根据字符串属性获取属性
     * @param strAttr 字符串属性
     * @returns
     */
    public static GetAttrInfoByStr(strAttr: string): AttrInfo {
        if (!strAttr) return null;
        const attrInfo = new AttrInfo();
        const attrs = strAttr.split('|');
        let a: string[] = [];
        // 基础属性
        attrs.forEach((attr) => {
            a = attr.split(':');
            // 有可能是相同属性，所以用add，可以把两个相同属性叠加起来
            attrInfo.add({ attrs: [new AttrBase(+a[0], +a[1])] });
        });
        return attrInfo;
    }

    /** 获取属性id对应的名称 */
    public static GetAttrName(attrId: number): string {
        return Config.Get(Config.Type.Cfg_Attr_Relation).getValueByKey(attrId, 'Fun_Name1');
    }

    /* 获取boss属性: 推荐战力 */
    public static GetBossFv(id: number, level: number): number {
        let fv = 0;
        const cfg: Cfg_Attr_Monster = Config.Get(Config.Type.Cfg_Attr_Monster).getValueByKey(id, level);
        if (!cfg) {
            return fv;
        }
        fv = +cfg.FightValue;
        return fv;
    }
}
