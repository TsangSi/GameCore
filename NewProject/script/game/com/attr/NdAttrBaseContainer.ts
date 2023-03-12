/*
 * @Author: kexd
 * @Date: 2022-07-13 11:38:24
 * @FilePath: \SanGuo\assets\script\game\com\attr\NdAttrBaseContainer.ts
 * @Description:
 *
 */
import { IAttrBase, IShowAttrOption } from '../../base/attribute/AttrConst';
import { NdAttrBase } from './NdAttrBase';

const { ccclass, property } = cc._decorator;
/**
 * 属性容器
 * 无加成属性 只有基础属性
 */
@ccclass
export class NdAttrBaseContainer extends cc.Component {
    @property(cc.Prefab)
    private prefab: cc.Prefab = null;

    public init(data: IAttrBase[], width?: number, opt?: IShowAttrOption): void {
        // 推荐使用destroy而不是remove。不过这里都不要用(一定要用的话在接口外调用destroyAllChild吧)。而是采取多删少补有则刷新的办法。
        // this.node.removeAllChildren();

        // 删除多余的
        for (let index = data.length; index < this.node.children.length; index++) {
            const element = this.node.children[index];
            element.destroy();
        }

        // 数组别使用 for in 或 for of
        // for (const item of data) {
        for (let i = 0; i < data.length; i++) {
            let nd: cc.Node = null;
            // 已经存在，则只需要刷新
            if (i < this.node.children.length) {
                nd = this.node.children[i];
            } else {
                // 新增
                nd = cc.instantiate(this.prefab);
                this.node.addChild(nd);
            }

            if (width) {
                nd.width = width;
            }

            const comp: NdAttrBase = nd.getComponent(NdAttrBase);
            comp.setAttr(data[i], opt);
        }
    }
}
