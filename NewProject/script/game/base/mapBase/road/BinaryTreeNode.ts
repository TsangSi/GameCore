/*
 * @Author: kexd
 * @Date: 2022-04-25 15:40:31
 * @LastEditors: kexd
 * @LastEditTime: 2022-05-30 09:50:51
 * @FilePath: \SanGuo\assets\script\game\base\mapBase\road\BinaryTreeNode.ts
 * @Description:二堆叉结构存储
 *
 */
import RoadNode from './RoadNode';

export default class BinaryTreeNode {
    /** 当前寻路标记,用于标记节点是否属于当前次寻路运算 */
    private _seekTag:number = 0;

    /** 开启列表根节点 */
    private _openNode:RoadNode = null;

    /** 计数当次寻路的运算代价（用于测试数据） */
    private _count:number = 0;

    /**
     * 刷新寻路tag标记，用于标记当前是哪次的寻路
     */
    public refleshTag():void {
        this._openNode = null;

        this._count = 0;

        this._seekTag++;

        if (this._seekTag > 1000000000) {
            this._seekTag = 0;
        }
    }

    /**
     * 二叉堆树是否为空，即没有任何节点加入
     * @returns
     */
    public isTreeNull():boolean {
        return this._openNode == null;
    }

    /**
     * 把节点添加进二叉堆里
     * @param roadNode 要添加的节点
     * @param head 从哪个节点位置开始添加
     * @returns
     */
    public addTreeNode(roadNode:RoadNode, head:RoadNode = null):void {
        this._count++; // 计数统计运算代价

        if (head == null) {
            // 如果开启节点为空，则拿首次加二叉堆的节点作为开启节点
            if (this._openNode == null) {
                this._openNode = roadNode;
                // console.log(this._count,"add root ",roadNode.f,roadNode.toString());
                return;
            } else { // 如果开启节点存在，头节点为null,默认把开启节点用于头节点
                head = this._openNode;
            }
        }

        if (roadNode.f >= head.f) {
            if (head.right == null) {
                head.right = roadNode;
                roadNode.treeParent = head;
                // console.log(this._count,"add right ",roadNode.f,roadNode.toString());
            } else {
                this.addTreeNode(roadNode, head.right);
            }
        } else
        if (head.left == null) {
            head.left = roadNode;
            roadNode.treeParent = head;
            // console.log(this._count,"add left ",roadNode.f,roadNode.toString());
        } else {
            this.addTreeNode(roadNode, head.left);
        }
    }

    /**
     * 删除树节点
     * @param roadNode 要删除的节点
     */
    public removeTreeNode(roadNode:RoadNode):void {
        this._count++; // 计数统计运算代价

        // 节点不在树结构中
        if (roadNode.treeParent == null && roadNode.left == null && roadNode.right == null) {
            return;
        }

        // 如果是根节点，优先把左子节点转换成根节点，左子节点不存在，则把右子节点转换成根节点
        if (roadNode.treeParent == null) {
            if (roadNode.left) {
                this._openNode = roadNode.left;
                roadNode.left.treeParent = null;

                if (roadNode.right) {
                    roadNode.right.treeParent = null;
                    this.addTreeNode(roadNode.right, this._openNode);
                }
            } else if (roadNode.right) { // 如果没有左节点，只有右节点
                this._openNode = roadNode.right;
                roadNode.right.treeParent = null;
            }
        } else if (roadNode.treeParent.left === roadNode) { // 如果是左子节点
            if (roadNode.right) {
                roadNode.treeParent.left = roadNode.right;
                roadNode.right.treeParent = roadNode.treeParent;

                if (roadNode.left) {
                    roadNode.left.treeParent = null;
                    this.addTreeNode(roadNode.left, roadNode.right);
                }
            } else {
                roadNode.treeParent.left = roadNode.left;
                if (roadNode.left) {
                    roadNode.left.treeParent = roadNode.treeParent;
                }
            }
        } else if (roadNode.treeParent.right === roadNode) { // 如果是右子节点
            if (roadNode.left) {
                roadNode.treeParent.right = roadNode.left;
                roadNode.left.treeParent = roadNode.treeParent;

                if (roadNode.right) {
                    roadNode.right.treeParent = null;
                    this.addTreeNode(roadNode.right, roadNode.left);
                }
            } else {
                roadNode.treeParent.right = roadNode.right;
                if (roadNode.right) {
                    roadNode.right.treeParent = roadNode.treeParent;
                }
            }
        }

        roadNode.resetTree();
    }

    /**
     * 从二叉堆结构里快速查找除f值最小的路节点
     * @param head 搜索的起始节点
     * @returns
     */
    public getMin_F_Node(head:RoadNode = null):RoadNode {
        this._count++; // 计数统计运算代价

        if (head == null) {
            if (this._openNode == null) {
                return null;
            } else {
                head = this._openNode; // 如果头节点为null，并且开启节点不为空，则头节点默认使用开启节点
            }
        }

        if (head.left == null) {
            const minNode:RoadNode = head;

            if (head.treeParent == null) {
                this._openNode = head.right;
                if (this._openNode) {
                    this._openNode.treeParent = null;
                }
            } else {
                head.treeParent.left = head.right;
                if (head.right) {
                    head.right.treeParent = head.treeParent;
                }
            }

            return minNode;
        } else {
            return this.getMin_F_Node(head.left);
        }
    }

    /**
     * 把节点加入开启列表，即打入开启列表标志
     * @param node
     */
    public setRoadNodeInOpenList(node:RoadNode):void {
        node.openTag = this._seekTag; // 给节点打入开放列表的标志
        node.closeTag = 0; // 关闭列表标志关闭
    }

    /**
     * 把节点加入关闭列表，即打入关闭列表标志
     * @param node
     */
    public setRoadNodeInCloseList(node:RoadNode):void {
        node.openTag = 0; // 开放列表标志关闭
        node.closeTag = this._seekTag; // 给节点打入关闭列表的标志
    }

    /**
     * 节点是否在开启列表
     * @param node
     * @returns
     */
    public isInOpenList(node:RoadNode):boolean {
        return node.openTag === this._seekTag;
    }

    /**
     * 节点是否在关闭列表
     * @param node
     * @returns
     */
    public isInCloseList(node:RoadNode):boolean {
        return node.closeTag === this._seekTag;
    }

    public getOpenList():RoadNode[] {
        const openList:RoadNode[] = [];
        this.seachTree(this._openNode, openList);
        return openList;
    }

    private seachTree(head:RoadNode, openList:RoadNode[]) {
        if (head == null) {
            return;
        }

        openList.push(head);

        if (head.left) {
            this.seachTree(head.left, openList);
        }

        if (head.right) {
            this.seachTree(head.right, openList);
        }
    }
}
