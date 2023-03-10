/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable no-constant-condition */

/*
 * @Author: kexd
 * @Date: 2022-04-25 15:40:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-05 20:22:16
 * @FilePath: \SanGuo2.4\assets\script\game\base\mapBase\road\AStarRoadSeeker.ts
 * @Description:A*寻路算法
 *
 */
import RoadNode from './RoadNode';
import IRoadSeeker from './IRoadSeeker';
import BinaryTreeNode from './BinaryTreeNode';
import { ENUM_ROAD } from './MapRoadUtils';

export default class AStarRoadSeeker implements IRoadSeeker {
    /** 横向移动一个格子的代价 */
    private readonly COST_STRAIGHT: number = 10;

    /** 斜向移动一个格子的代价 */
    private readonly COST_DIAGONAL: number = 14;

    /** 最大搜寻步骤数，超过这个值时表示找不到目标(改为1000步，10000步消耗太大了) */
    private readonly maxStep: number = 1000;

    /** 开启列表 */
    private _openlist: Array<RoadNode>;

    /** 关闭列表 */
    private _closelist: Array<RoadNode>;

    /** 二叉堆存储结构 */
    private _binaryTreeNode: BinaryTreeNode = new BinaryTreeNode();

    /** 开始节点 */
    private _startNode: RoadNode;

    /** 当前检索节点 */
    private _currentNode: RoadNode;

    /** 目标节点 */
    private _targetNode: RoadNode;

    /** 地图路点数据 */
    private _roadNodes: { [key: number]: RoadNode; };

    /** 用于检索一个节点周围8个点的向量数组 */
    private _round: number[][] = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];

    private _handle;

    /** 是否优化路径 */
    private _optimize: boolean = true;

    public constructor(roadNodes: { [key: string]: RoadNode; }) {
        this._roadNodes = roadNodes;
    }

    public findPath(startNode: RoadNode, targetNode: RoadNode): Array<RoadNode> {
        this._startNode = startNode;
        this._currentNode = startNode;
        this._targetNode = targetNode;

        if (!this._startNode || !this._targetNode) { return []; }

        if (this._startNode === this._targetNode) {
            return [this._targetNode];
        }

        // 如果目标点是不可到达的，采用跑到最近路线方法：seekPath2
        if (!this.isPassNode(this._targetNode)) {
            return this.seekPath2(startNode, targetNode);
        }
        return this.seekPath(startNode, targetNode);
    }

    /**
     * 寻路入口方法
     * @param startNode
     * @param targetNode
     * @return
     */
    public seekPath(startNode: RoadNode, targetNode: RoadNode): Array<RoadNode> {
        this._startNode = startNode;
        this._currentNode = startNode;
        this._targetNode = targetNode;

        if (!this._startNode || !this._targetNode) { return []; }

        if (this._startNode == this._targetNode) {
            return [this._targetNode];
        }

        if (!this.isPassNode(this._targetNode)) {
            console.log('目标不可达到：');
            return [];
        }

        this._startNode.g = 0; // 重置起始节点的g值
        this._startNode.resetTree(); // 清除起始节点原有的二叉堆关联关系

        this._binaryTreeNode.refleshTag(); // 刷新二叉堆tag，用于后面判断是不是属于当前次的寻路
        // this._binaryTreeNode.addTreeNode(this._startNode); //把起始节点设置为二叉堆结构的根节点

        let step: number = 0;

        while (true) {
            if (step > this.maxStep) {
                console.log('超过计算步骤了,没找到目标计算步骤为：', step);
                return [];
            }

            step++;

            this.searchRoundNodes(this._currentNode);

            if (this._binaryTreeNode.isTreeNull()) { // 二叉堆树里已经没有任何可搜寻的点了，则寻路结束，每找到目标
                console.log('seekPath二叉堆树里已经没有任何可搜寻的点了,没找到目标,计算步骤为：', step);
                return [];
            }

            this._currentNode = this._binaryTreeNode.getMin_F_Node();

            if (this._currentNode == this._targetNode) {
                // console.log('找到目标计算步骤为：', step);
                return this.getPath();
            } else {
                this._binaryTreeNode.setRoadNodeInCloseList(this._currentNode);// 打入关闭列表标记
            }
        }

        return [];
    }

    /**
     *寻路入口方法 如果没有寻到目标，则返回离目标最近的路径
    * @param startNode
    * @param targetNode
    * @return
    *
    */
    public seekPath2(startNode: RoadNode, targetNode: RoadNode): Array<RoadNode> {
        this._startNode = startNode;
        this._currentNode = startNode;
        this._targetNode = targetNode;

        if (!this._startNode || !this._targetNode) { return []; }

        if (this._startNode === this._targetNode) {
            return [this._targetNode];
        }

        let newMaxStep: number = this.maxStep;

        if (!this.isPassNode(this._targetNode)) {
            // 如果不能直达目标，最大寻路步骤 = 为两点间的预估距离的2倍
            newMaxStep = (Math.abs(this._targetNode.cx - this._startNode.cx) + Math.abs(this._targetNode.cy - this._startNode.cy)) * 2;
            if (newMaxStep > this.maxStep) {
                newMaxStep = this.maxStep;
            }
        }

        this._startNode.g = 0; // 重置起始节点的g值
        this._startNode.resetTree(); // 清除起始节点原有的二叉堆关联关系

        this._binaryTreeNode.refleshTag(); // 刷新二叉堆tag，用于后面判断是不是属于当前次的寻路
        // this._binaryTreeNode.addTreeNode(this._startNode); //把起始节点设置为二叉堆结构的根节点

        let step: number = 0;

        let closestNode: RoadNode = null; // 距离目标最近的路点

        while (true) {
            if (step > newMaxStep) {
                return this.seekPath(startNode, closestNode);
            }

            step++;

            this.searchRoundNodes(this._currentNode);

            if (this._binaryTreeNode.isTreeNull()) { // 二叉堆树里已经没有任何可搜寻的点了，则寻路结束，没找到目标
                console.log('seekPath2二叉堆树里已经没有任何可搜寻的点了,没找到目标,计算步骤为：', step);
                return this.seekPath(startNode, closestNode);
            }

            this._currentNode = this._binaryTreeNode.getMin_F_Node();

            if (closestNode == null) {
                closestNode = this._currentNode;
            } else if (this._currentNode.h < closestNode.h) {
                closestNode = this._currentNode;
            }

            if (this._currentNode == this._targetNode) {
                console.log('找到目标计算步骤为：', step);
                return this.getPath();
            } else {
                this._binaryTreeNode.setRoadNodeInCloseList(this._currentNode);// 打入关闭列表标记
            }
        }

        return this.seekPath(startNode, closestNode);
    }

    /**
     * 对路节点进行排序
     * @param node1
     * @param node2
     */
    private sortNode(node1: RoadNode, node2: RoadNode) {
        if (node1.f < node2.f) {
            return -1;
        } else if (node1.f > node2.f) {
            return 1;
        }

        return 0;
    }

    /**
     *获得最终寻路到的所有路点
     * @return
     */
    private getPath(): Array<RoadNode> {
        const nodeArr: Array<RoadNode> = [];

        let node: RoadNode = this._targetNode;

        while (node !== this._startNode) {
            nodeArr.unshift(node);
            node = node.parent;
        }

        nodeArr.unshift(this._startNode);

        if (!this._optimize) {
            return nodeArr;
        }

        // 第一阶段优化： 对横，竖，正斜进行优化
        // 把多个节点连在一起的，横向或者斜向的一连串点，除两边的点保留
        for (let i: number = 1; i < nodeArr.length - 1; i++) {
            const preNode: RoadNode = nodeArr[i - 1];
            const midNode: RoadNode = nodeArr[i];
            const nextNode: RoadNode = nodeArr[i + 1];

            const bool1: boolean = midNode.cx === preNode.cx && midNode.cx === nextNode.cx;
            const bool2: boolean = midNode.cy === preNode.cy && midNode.cy === nextNode.cy;
            const bool3: boolean = ((midNode.cx - preNode.cx) / (midNode.cy - preNode.cy)) * ((nextNode.cx - midNode.cx) / (nextNode.cy - midNode.cy)) == 1;

            if (bool1 || bool2 || bool3) {
                nodeArr.splice(i, 1);
                i--;
            }
        }

        // return nodeArr;

        // 第二阶段优化：对不在横，竖，正斜的格子进行优化
        for (let i: number = 0; i < nodeArr.length - 2; i++) {
            const startNode: RoadNode = nodeArr[i];
            let optimizeNode: RoadNode = null;

            // 优先从尾部对比，如果能直达就把中间多余的路点删掉
            let j: number = nodeArr.length - 1;
            for (; j > i + 1; j--) {
                const targetNode: RoadNode = nodeArr[j];

                // 在第一阶段优已经优化过横，竖，正斜了，所以再出现是肯定不能优化的，可以忽略
                if (startNode.cx == targetNode.cx || startNode.cy == targetNode.cy || Math.abs(targetNode.cx - startNode.cx) == Math.abs(targetNode.cy - startNode.cy)) {
                    continue;
                }

                if (this.isArriveBetweenTwoNodes(startNode, targetNode)) {
                    optimizeNode = targetNode;
                    break;
                }
            }

            if (optimizeNode) {
                const optimizeLen: number = j - i - 1;
                nodeArr.splice(i + 1, optimizeLen);
            }
        }

        return nodeArr;
    }

    /**
     * 两点之间是否可到达
     */
    private isArriveBetweenTwoNodes(startNode: RoadNode, targetNode: RoadNode): boolean {
        if (startNode == targetNode) {
            return false;
        }

        const disX: number = Math.abs(targetNode.cx - startNode.cx);
        const disY: number = Math.abs(targetNode.cy - startNode.cy);

        let dirX = 0;

        if (targetNode.cx > startNode.cx) {
            dirX = 1;
        } else if (targetNode.cx < startNode.cx) {
            dirX = -1;
        }

        let dirY = 0;

        if (targetNode.cy > startNode.cy) {
            dirY = 1;
        } else if (targetNode.cy < startNode.cy) {
            dirY = -1;
        }

        let rx: number = 0;
        let ry: number = 0;
        let intNum: number = 0;
        let decimal: number = 0;

        if (disX > disY) {
            const rate: number = disY / disX;

            for (let i = 0; i < disX; i++) {
                ry = startNode.cy + i * dirY * rate;
                intNum = Math.floor(ry);
                decimal = ry % 1;

                const cx1: number = startNode.cx + i * dirX;
                const cy1: number = decimal <= 0.5 ? intNum : intNum + 1;

                ry = startNode.cy + (i + 1) * dirY * rate;
                intNum = Math.floor(ry);
                decimal = ry % 1;

                const cx2: number = startNode.cx + (i + 1) * dirX;
                const cy2: number = decimal <= 0.5 ? intNum : intNum + 1;

                const node1: RoadNode = this.getRoadNode(cx1, cy1);
                const node2: RoadNode = this.getRoadNode(cx2, cy2);

                // cc.log(i + "  :: " + node1.cy," yy ",startNode.cy + i * rate,ry % 1);

                if (!this.isCrossAtAdjacentNodes(node1, node2)) {
                    return false;
                }
            }
        } else {
            const rate: number = disX / disY;

            for (let i = 0; i < disY; i++) {
                rx = i * dirX * rate;
                intNum = dirX > 0 ? Math.floor(startNode.cx + rx) : Math.ceil(startNode.cx + rx);
                decimal = Math.abs(rx % 1);

                const cx1: number = decimal <= 0.5 ? intNum : intNum + 1 * dirX;
                const cy1: number = startNode.cy + i * dirY;

                rx = (i + 1) * dirX * rate;
                intNum = dirX > 0 ? Math.floor(startNode.cx + rx) : Math.ceil(startNode.cx + rx);
                decimal = Math.abs(rx % 1);

                const cx2: number = decimal <= 0.5 ? intNum : intNum + 1 * dirX;
                const cy2: number = startNode.cy + (i + 1) * dirY;

                const node1: RoadNode = this.getRoadNode(cx1, cy1);
                const node2: RoadNode = this.getRoadNode(cx2, cy2);

                if (!this.isCrossAtAdjacentNodes(node1, node2)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 判断两个相邻的点是否可通过
     * @param node1
     * @param node2
     */
    private isCrossAtAdjacentNodes(node1: RoadNode, node2: RoadNode): boolean {
        if (node1 == node2) {
            return false;
        }

        // 两个点只要有一个点不能通过就不能通过
        if (!this.isPassNode(node1) || !this.isPassNode(node2)) {
            return false;
        }

        const dirX = node2.cx - node1.cx;
        const dirY = node2.cy - node1.cy;

        // 如果不是相邻的两个点 则不能通过
        if (Math.abs(dirX) > 1 || Math.abs(dirY) > 1) {
            return false;
        }

        // 如果相邻的点是在同一行，或者同一列，则判定为可通过
        if ((node1.cx == node2.cx) || (node1.cy == node2.cy)) {
            return true;
        }

        // 只剩对角情况了
        if (
            this.isPassNode(this.getRoadNode(node1.cx, node1.cy + dirY))
            && this.isPassNode(this.getRoadNode(node1.cx + dirX, node1.cy))
        ) {
            return true;
        }

        return false;
    }

    /**
     * 是否是可通过的点
     * @param node
     */
    public isPassNode(node: RoadNode): boolean {
        if (node == null || node.value == ENUM_ROAD.Block) {
            return false;
        }

        return true;
    }

    /**
     * 根据世界坐标获得路节点
     * @param cx
     * @param cy
     * @returns
     */
    public getRoadNode(cx: number, cy: number): RoadNode {
        const key: string = `${cx}_${cy}`;
        return this._roadNodes[key];
    }

    /**
     *测试寻路步骤
     * @param startNode
     * @param targetNode
     * @return
     */
    public testSeekPathStep(startNode: RoadNode, targetNode: RoadNode, callback: Function, target: any, time: number = 100): void {
        this._startNode = startNode;
        this._currentNode = startNode;
        this._targetNode = targetNode;

        if (!this.isPassNode(this._targetNode)) { return; }

        this._startNode.g = 0; // 重置起始节点的g值
        this._startNode.resetTree(); // 清除起始节点原有的二叉堆关联关系

        this._binaryTreeNode.refleshTag(); // 刷新二叉堆tag，用于后面判断是不是属于当前次的寻路
        // this._binaryTreeNode.addTreeNode(this._startNode); //把起始节点设置为二叉堆结构的根节点

        this._closelist = [];

        let step: number = 0;

        clearInterval(this._handle);
        this._handle = setInterval(() => {
            if (step > this.maxStep) {
                console.log('超过计算步骤,没找到目标,计算步骤为：', step);
                clearInterval(this._handle);
                return;
            }

            step++;

            this.searchRoundNodes(this._currentNode);

            if (this._binaryTreeNode.isTreeNull()) { // 二叉堆树里已经没有任何可搜寻的点了，则寻路结束，每找到目标
                console.log('testSeekPathStep二叉堆树里已经没有任何可搜寻的点了,没找到目标,计算步骤为：', step);
                clearInterval(this._handle);
                return;
            }

            this._currentNode = this._binaryTreeNode.getMin_F_Node();

            if (this._currentNode == this._targetNode) {
                console.log('找到目标计算步骤为：', step);
                clearInterval(this._handle);

                this._openlist = this._binaryTreeNode.getOpenList();
                callback.apply(target, [this._startNode, this._targetNode, this._currentNode, this._openlist, this._closelist, this.getPath()]);
            } else {
                this._binaryTreeNode.setRoadNodeInCloseList(this._currentNode);// 打入关闭列表标记
                this._openlist = this._binaryTreeNode.getOpenList();
                this._closelist.push(this._currentNode);
                callback.apply(target, [this._startNode, this._targetNode, this._currentNode, this._openlist, this._closelist, null]);
            }
        }, time);
    }

    /**
     *查找一个节点周围可通过的点
     * @param node
     * @return
     */
    private searchRoundNodes(node: RoadNode): void {
        for (let i: number = 0; i < this._round.length; i++) {
            const cx: number = node.cx + this._round[i][0];
            const cy: number = node.cy + this._round[i][1];
            const node2: RoadNode = this.getRoadNode(cx, cy);

            if (this.isPassNode(node2) && node2 != this._startNode && !this.isInCloseList(node2) && !this.inInCorner(node2)) {
                this.setNodeF(node2);
            }
        }
    }

    /**
     *设置节点的F值
     * @param node
     */
    public setNodeF(node: RoadNode): void {
        let g: number;

        if (node.cx == this._currentNode.cx || node.cy == this._currentNode.cy) {
            g = this._currentNode.g + this.COST_STRAIGHT;
        } else {
            g = this._currentNode.g + this.COST_DIAGONAL;
        }

        if (this.isInOpenList(node)) {
            if (g < node.g) {
                node.g = g;

                node.parent = this._currentNode;
                node.h = (Math.abs(this._targetNode.cx - node.cx) + Math.abs(this._targetNode.cy - node.cy)) * this.COST_STRAIGHT;
                node.f = node.g + node.h;

                // 节点的g值已经改变，把节点先从二堆叉树结构中删除，再重新添加进二堆叉树
                this._binaryTreeNode.removeTreeNode(node);
                this._binaryTreeNode.addTreeNode(node);
            }
        } else {
            node.g = g;

            this._binaryTreeNode.setRoadNodeInOpenList(node);// 给节点打入开放列表的标志
            node.resetTree();

            node.parent = this._currentNode;
            node.h = (Math.abs(this._targetNode.cx - node.cx) + Math.abs(this._targetNode.cy - node.cy)) * this.COST_STRAIGHT;
            node.f = node.g + node.h;

            this._binaryTreeNode.addTreeNode(node);
        }
    }

    /**
     *节点是否在开启列表
     * @param node
     * @return
     */
    private isInOpenList(node: RoadNode): boolean {
        return this._binaryTreeNode.isInOpenList(node);
    }

    /**
     * 节点是否在关闭列表
     * @param node
     * @returns
     */
    private isInCloseList(node: RoadNode): boolean {
        return this._binaryTreeNode.isInCloseList(node);
    }

    /**
     *节点是否在拐角处
     * @return
     */
    private inInCorner(node: RoadNode): boolean {
        if (node.cx == this._currentNode.cx || node.cy == this._currentNode.cy) {
            return false;
        }

        const node1: RoadNode = this.getRoadNode(this._currentNode.cx, node.cy);
        const node2: RoadNode = this.getRoadNode(node.cx, this._currentNode.cy);

        if (this.isPassNode(node1) && this.isPassNode(node2)) {
            return false;
        }

        return true;
    }

    /**
     * 释放资源
     */
    public dispose(): void {
        this._roadNodes = null;
        this._round = null;
    }
}
