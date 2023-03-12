/*
 * @Author: hwx
 * @Date: 2022-04-25 10:28:17
 * @Description: 红点工具类
 */
import { ResMgr } from '../../../app/core/res/ResMgr';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { RedDot } from '../../module/reddot/RedDot';
import { ERedDotStyle } from '../../module/reddot/RedDotConst';

export default class UtilRedDot {
    /** 红点模板 */
    // private static redDotPrefabMap: { [key: string]: cc.Prefab} = {};
    // private static loadingRedDotMap: { [key: string]: RedDotData } = {};

    // /**
    //  * 获取红点预制体模板
    //  * @param redDotPath 红点路径
    //  * @returns
    //  */
    // public static GetRedDotPrefab(redDotPath?: string): cc.Prefab {
    //     return UtilRedDot.redDotPrefabMap[redDotPath];
    // }

    // /**
    //  * 增加红点预制模板
    //  * @param redDotPath 模板路径
    //  * @param prefab 预制体
    //  */
    // public static AddRedDotPrefab(redDotPath: string, prefab: cc.Prefab): void {
    //     UtilRedDot.redDotPrefabMap[redDotPath] = prefab;
    // }

    // /**
    //  * 删除红点预制模板
    //  * @param redDotPath 模板路径
    //  */
    // public static DeleteRedDotPrefab(redDotPath: string): void {
    //     delete UtilRedDot.redDotPrefabMap[redDotPath];
    // }

    /**
     * 绑定红点，必须是有静态或动态数据的红点
     * @param rid 红点id
     * @param node 父节点
     * @param pos 位置
     * @param redDotStyle ERedDotStyle样式
     * @returns
     */
    public static Bind(rid: number, parent: cc.Node, pos?: cc.Vec2, redDotStyle: ERedDotStyle = ERedDotStyle.Nor, limitNum: number = 99): void {
        // 建议直接相对父节点右上角
        // 特殊情况提供坐标
        if (rid === 0 || rid === undefined) {
            cc.error('绑定的红点id不能为0 或者undefined');
            return;
        }
        const nodeReddot = parent.getChildByName('RedDot');
        if (nodeReddot) {
            const reddot = nodeReddot.getComponent(RedDot);
            reddot.setData(rid, redDotStyle, limitNum);
            if (pos) {
                nodeReddot.setPosition(pos);
            }
        } else {
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Com_Reddot_RedDot, parent, (e, n) => {
                if (e) return;
                if (!parent || !parent.isValid) return;
                n.getComponent(RedDot)?.setData(rid, redDotStyle, limitNum);
                if (pos) {
                    n.setPosition(pos);
                }
            });
        }
    }

    /**
     * 解除红点节点绑定
     * @param node 红点节点
     */
    public static Unbind(parent: cc.Node): void {
        const nodeReddot = parent.getChildByName('RedDot');
        if (nodeReddot) {
            this._pools.put(nodeReddot);
        }
    }

    // /**
    //  * 新建红点节点
    //  * @param customData
    //  * @param parent
    //  * @param pos
    //  * @param redDotStyle
    //  */
    // public static New(parent: cc.Node, pos: cc.Vec2, customData: RedDotData = { type: -1, count: 1 }, redDotStyle: string = RedDotStyle.NORMAL): void {
    //     // 同一个父节点不能同时异步加载两个红点
    //     if (UtilRedDot.loadingRedDotMap[parent.uuid]) {
    //         UtilRedDot.loadingRedDotMap[parent.uuid] = customData;
    //         return;
    //     }

    //     const redDot = parent.getComponentInChildren(RedDot);
    //     if (redDot) {
    //         redDot.setData(customData);
    //         return;
    //     }

    //     redDotStyle = redDotStyle || RedDotStyle.NORMAL;
    //     const redDotTpl = UtilRedDot.GetRedDotPrefab(redDotStyle);
    //     if (redDotTpl) {
    //         // 创建节点
    //         UtilRedDot.CreateNode(redDotTpl, parent, pos, customData);
    //     } else {
    //         UtilRedDot.loadingRedDotMap[parent.uuid] = customData;
    //         ResMgr.I.loadLocal(redDotStyle, cc.Prefab, (err, prefab: cc.Prefab) => {
    //             // 可能在加载中被修改了
    //             const redDotData = UtilRedDot.loadingRedDotMap[parent.uuid];
    //             // 加载完成删除缓存
    //             delete UtilRedDot.loadingRedDotMap[parent.uuid];
    //             if (err) return;
    //             UtilRedDot.AddRedDotPrefab(redDotStyle, prefab);
    //             UtilRedDot.CreateNode(prefab, parent, pos, redDotData);
    //         });
    //     }
    // }

    // /**
    //  * 删除红点节点
    // */
    // public static Delete(node: cc.Node): void {
    //     const redDot = node.getComponentInChildren(RedDot);
    //     if (redDot) {
    //         redDot.node.destroy();
    //     }
    // }

    // public static Hide(node: cc.Node): void {
    //     const redDot = node.getComponentInChildren(RedDot);
    //     if (redDot) {
    //         redDot.node.active = false;
    //     }
    // }

    // /**
    //  * 创建红点节点
    //  * @param data 红点数据
    //  * @param parent 父节点
    //  * @param pos 相对父节点的位置
    //  * @returns 红点节点
    //  */
    // private static CreateNode(redDotTpl: cc.Prefab, parent: cc.Node, pos?: cc.Vec2, data: RedDotData = { type: -1, count: 1 }): cc.Node | null {
    //     // 创建节点
    //     const redDotNode = cc.instantiate(redDotTpl);
    //     redDotNode.parent = parent;
    //     if (pos) redDotNode.setPosition(pos);

    //     // 设置红点数据
    //     const redDot = redDotNode.getComponent(RedDot);
    //     redDot.setData(data);

    //     return redDotNode;
    // }

    private static _pools: cc.NodePool = new cc.NodePool(RedDot);
    public static UpdateRed(parent: cc.Node, isShow: boolean, pos?: cc.Vec2, style?: ERedDotStyle): void {
        if (!parent || !parent.isValid) { return; }
        if (isShow) {
            this.AddRedDot(parent, pos, style);
        } else {
            const n = parent.getChildByName('RedDot');
            if (n) {
                this._pools.put(n);
            }
        }
    }

    private static AddRedDot(parent: cc.Node, pos?: cc.Vec2, style?: ERedDotStyle) {
        const nodeRedDot = parent.getChildByName('RedDot');
        if (!nodeRedDot) {
            const node = this._pools.get(pos, style);
            if (node) {
                parent.addChild(node);
                return;
            }
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Com_Reddot_RedDot, parent, (e, n) => {
                if (!e && n) {
                    n.getComponent(RedDot)?.reuse(pos, style);
                }
            });
        } else {
            nodeRedDot.getComponent(RedDot)?.reuse(pos, style);
        }
    }
}
