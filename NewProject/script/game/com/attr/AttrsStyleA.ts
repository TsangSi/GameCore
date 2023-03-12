/*
 * @Author: hwx
 * @Date: 2022-07-12 16:22:00
 * @FilePath: \SanGuo2.4-main\assets\script\game\com\attr\AttrsStyleA.ts
 * @Description: 属性样式A
 */
import { UtilBool } from '../../../app/base/utils/UtilBool';
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../i18n/i18n';
import { AttrInfo } from '../../base/attribute/AttrInfo';
import { AttrItemA } from './AttrItemA';

const { ccclass, property } = cc._decorator;

@ccclass
export class AttrsStyleA extends BaseCmp {
    @property(cc.Node)
    private NdContainer: cc.Node = null;
    @property(cc.Prefab)
    private PrefabTpl: cc.Prefab = null;
    @property(cc.Label)
    private LabEmptyTips: cc.Label = null;
    @property(cc.Label)
    private LabelTitle: cc.Label = null;
    @property({ tooltip: CC_DEV && '多语言提示ID' })
    private emptyTipsId: string = '';
    private ndTpl: cc.Node = null;

    /**
     * 初始化数据
     * @param attrInfo 属性类
     * @param title 标题
     */
    public init(attrInfo: AttrInfo, title?: string): void {
        if (!this.ndTpl) {
            this.ndTpl = cc.instantiate(this.PrefabTpl);
        }

        const attrs = attrInfo.attrs.sort((a, b) => a.attrType - b.attrType);

        const len = attrs.length;
        if (len === 0 && this.emptyTipsId) {
            this.LabEmptyTips.string = i18n.tt(Lang[this.emptyTipsId]);
            this.LabEmptyTips.node.active = true;
        } else {
            this.LabEmptyTips.node.active = false;
        }

        UtilCocos.LayoutFill(this.NdContainer, (item, idx) => {
            item.active = true;
            const attr = attrs[idx];
            item.getComponent(AttrItemA).init(attr);
        }, len, this.ndTpl);

        if (!UtilBool.isNullOrUndefined(title)) {
            this.setTitle(title);
        }
    }

    public setLabelEmptyTips(str: string): void {
        this.LabEmptyTips.string = str;
    }

    /** 设置标题 */
    public setTitle(str: string): void {
        if (this.LabelTitle) {
            this.LabelTitle.string = str;
        }
    }
}
