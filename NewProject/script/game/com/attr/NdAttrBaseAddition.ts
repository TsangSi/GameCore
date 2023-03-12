/*
 * @Author: zs
 * @Date: 2022-07-13 15:31:03
 * @FilePath: \SanGuo2.4\assets\script\game\com\attr\NdAttrBaseAddition.ts
 * @Description:
 */
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { BaseAddOptions, EAttrType, IAttrBase } from '../../base/attribute/AttrConst';
import { DynamicImage } from '../../base/components/DynamicImage';
import { UtilAttr } from '../../base/utils/UtilAttr';

const { ccclass, property } = cc._decorator;

@ccclass
export class NdAttrBaseAddition extends cc.Component {
    @property(cc.Node)
    private NdAttr: cc.Node = null;

    @property(cc.Node)
    private NdAdd: cc.Node = null;

    @property(DynamicImage)
    private NdIcon: DynamicImage = null;

    @property(cc.Label)
    private LabKey: cc.Label = null;

    @property(cc.Label)
    private LabVal: cc.Label = null;

    @property(cc.Label)
    private LabAddition: cc.Label = null;

    @property(cc.Node)
    private imgAdd: cc.Node = null;

    @property(cc.Node)
    private NdLine: cc.Node = null;

    // isShowAdd?: boolean, // 是否显示加成
    // // 总的宽度
    // baseAddwidth?: number, // 默认是280
    // // 左边的
    // NdAttrWidth?: number, // 左边的宽度默认180
    // NdAttrX?: number, // 默认是-140
    // NdAttrSpaceX?: number, // 默认是5
    // // 右边的
    // NdAddWidth?: number, // 右边的宽度默认100
    // NdAddX?: number, // 默认是40
    // NdAddSpaceX?: number, // 默认是0

    public setAttr(
        base: IAttrBase,
        add: IAttrBase,
        param?: BaseAddOptions,
    ): void {
        const opts: BaseAddOptions = {
            isShowAdd: true, // 是否显示加成属性
            isShowAddSign: false, // 是否显示+号
            isShowLine: false, // 是否显示线
            // 总的整个Node宽度
            baseAddwidth: 280, // 默认是280

            // 左边基础属性的
            NdAttrWidth: 180, // 左边的宽度默认180
            NdAttrX: -140, // 默认是-140
            NdAttrSpaceX: 5, // 默认是5
            NdAttrColor: UtilColor.NorN, // 棕色

            // 右边加成属性的
            NdAddWidth: 100, // 右边的宽度默认100
            NdAddX: 40, // 默认是40
            NdAddSpaceX: 0, // 默认是0
            NdAddColor: UtilColor.GreenV, // 原谅色

            // 攻击：30 +8
            signkey: ':', // 攻击:999
            signVal: '+', // +23
        };
        if (param) {
            for (const k in param) {
                opts[k] = param[k];
            }
        }
        if (opts.isCustom) {
            const type = base.attrType;
            this.NdIcon.loadImage(UtilAttr.getIconByAttrType(type), 1, true);
            this.LabKey.string = `${base.name}${opts.signkey}`;

            /* 万分比判断显示 */
            if (type >= EAttrType.Attr_19 && type <= EAttrType.Attr_22) {
                this.LabVal.string = `+${(base.value / 100).toFixed(2)}%`;
                this.LabAddition.string = opts.isShowAdd ? `${(add.value / 100).toFixed(2)}%` : '';
            } else {
                this.LabVal.string = `+${base.value}`;
                this.LabAddition.string = opts.isShowAdd ? `${add.value}` : '';
            }

            this.imgAdd.active = add.value !== 0;
            this.LabAddition.node.active = add.value !== 0;
            return;
        }

        const type = base.attrType;
        this.NdIcon.loadImage(UtilAttr.getIconByAttrType(type), 1, true);

        this.LabKey.string = `${base.name}${opts.signkey}`;// 攻击  防御 ...
        this.LabKey.node.color = UtilColor.Hex2Rgba(opts.NdAttrColor);
        this.LabVal.string = `${base.value}`;// +1232
        this.LabVal.node.color = UtilColor.Hex2Rgba(opts.NdAttrColor);

        this.LabAddition.string = opts.isShowAdd ? `${opts.isShowAddSign ? opts.signVal : ''}${add.value}` : '';
        this.imgAdd.active = opts.isShowAdd;
        this.LabAddition.node.active = opts.isShowAdd;
        if (this.NdLine) {
            this.NdLine.active = opts.isShowLine;
        }
        // 整个的总宽度
        if (opts.resizeMode && opts.NdAddWidth && !add) {
            this.node.width = opts.baseAddwidth - opts.NdAddWidth;
            this.NdAttr.width = opts.NdAttrWidth - opts.NdAddWidth;
            this.NdAttr.x = opts.NdAttrX + opts.NdAddWidth;
            this.node.x = opts.NdAddX;
        } else {
            this.node.width = opts.baseAddwidth;//
            this.NdAttr.width = opts.NdAttrWidth;
            this.NdAttr.x = opts.NdAttrX;
            this.node.x = 0;
        }

        const layout = this.NdAttr.getComponent(cc.Layout);
        // const mlayout = this.node.getComponent(cc.Layout);
        if (layout) {
            layout.spacingX = opts.NdAttrSpaceX;
            if (opts.resizeMode && !add) {
                layout.resizeMode = opts.resizeMode;
            } else {
                layout.resizeMode = cc.Layout.ResizeMode.NONE;
            }
        }
        // if (mlayout) {
        //     if (opts.resizeMode && !add) {
        //         mlayout.resizeMode = opts.resizeMode;
        //     } else {
        //         mlayout.resizeMode = cc.Layout.ResizeMode.NONE;
        //     }
        // }
        this.NdAdd.active = !!add;

        this.NdAdd.width = opts.NdAddWidth;
        this.NdAdd.x = opts.NdAddX;
        const addLayout = this.NdAttr.getComponent(cc.Layout);
        if (addLayout) {
            addLayout.spacingX = opts.NdAddSpaceX;
        }
    }
}
