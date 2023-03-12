/*
 * @Author: zs
 * @Date: 2022-10-25 22:35:44
 * @FilePath: \SanGuo2.4-main\assets\script\game\com\attr\NdAttrBaseAdditionContainer.ts
 * @Description:
 *
 */
import { BaseAddOptions, IAttrBase } from '../../base/attribute/AttrConst';
import { NdAttrBaseAddition } from './NdAttrBaseAddition';

const { ccclass, property } = cc._decorator;
@ccclass
export class NdAttrBaseAdditionContainer extends cc.Component {
    @property(cc.Prefab)
    private prefab: cc.Prefab = null;

    /**
     * 基础属性 & 加成属性
     * isShowAdd 是否显示加成属性
     */
    public init(baseAttr: IAttrBase[], addAttr: IAttrBase[], opts?: BaseAddOptions): void {
        for (let index = baseAttr.length; index < this.node.children.length; index++) {
            const element = this.node.children[index];
            element.destroy();
        }

        for (let i = 0, len = baseAttr.length; i < len; i++) {
            const baseItem: IAttrBase = baseAttr[i];

            let addAttrItem: IAttrBase;
            if (addAttr != null) {
                addAttrItem = addAttr[i];
            }

            let nd: cc.Node = null;
            // 已经存在，则只需要刷新
            if (i < this.node.children.length) {
                nd = this.node.children[i];
            } else {
                // 新增
                nd = cc.instantiate(this.prefab);
                this.node.addChild(nd);
            }
            const comp: NdAttrBaseAddition = nd.getComponent(NdAttrBaseAddition);
            if (opts) {
                opts.isShowLine = opts?.isShowLine && (i !== len - 1);
            }
            comp.setAttr(baseItem, addAttrItem, opts);// 设置基础属性与加成属性
        }
    }
}
