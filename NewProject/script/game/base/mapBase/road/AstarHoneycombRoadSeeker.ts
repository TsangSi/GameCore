/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-constant-condition */
/* eslint-disable no-tabs */
/*
 * @Author: kexd
 * @Date: 2022-04-06 21:01:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-05 10:08:11
 * @FilePath: \SanGuo2.4\assets\script\game\base\mapBase\road\AstarHoneycombRoadSeeker.ts
 * @Description:六边形 A*寻路算法
 *
 */

import RoadNode from './RoadNode';
import IRoadSeeker from './IRoadSeeker';
import BinaryTreeNode from './BinaryTreeNode';
import { ENUM_ROAD } from './MapRoadUtils';

export default class AstarHoneycombRoadSeeker implements IRoadSeeker {
    /** 横向移动一个格子的代价 */
    private readonly COST_STRAIGHT: number = 10;

    /** 斜向移动一个格子的代价 */
    private readonly COST_DIAGONAL: number = 10;

    /** 最大搜寻步骤数，超过这个值时表示找不到目标 10000太大了，用1000吧 */
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

    /** 用于检索一个节点周围6个点的向量数组 格子列数为偶数时使用 */
    private _round1: number[][] = [[0, -1], [1, -1], [1, 0], [0, 1], [-1, 0], [-1, -1]];

    /** 用于检索一个节点周围6个点的向量数组 格子列数为奇数时使用 */
    private _round2: number[][] = [[0, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];

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

        if (this._startNode === this._targetNode) {
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
                console.log('没找到目标计算步骤为：', step);
                return [];
            }

            step++;

            this.searchRoundNodes(this._currentNode);

            // 二叉堆树里已经没有任何可搜寻的点了，则寻路结束，每找到目标
            if (this._binaryTreeNode.isTreeNull()) {
                console.log('没找到目标计算步骤为：', step);
                return [];
            }

            this._currentNode = this._binaryTreeNode.getMin_F_Node();

            if (this._currentNode === this._targetNode) {
                console.log('找到目标计算步骤为：', step);
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
                console.log('没找到目标计算步骤为：', step);
                return this.seekPath(startNode, closestNode);
            }

            step++;

            this.searchRoundNodes(this._currentNode);

            // 二叉堆树里已经没有任何可搜寻的点了，则寻路结束，没找到目标
            if (this._binaryTreeNode.isTreeNull()) {
                console.log('没找到目标计算步骤为：', step);
                return this.seekPath(startNode, closestNode);
            }

            this._currentNode = this._binaryTreeNode.getMin_F_Node();

            if (closestNode == null) {
                closestNode = this._currentNode;
            } else if (this._currentNode.h < closestNode.h) {
                closestNode = this._currentNode;
            }

            if (this._currentNode === this._targetNode) {
                // console.log('找到目标计算步骤为：', step);
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
     * 获得最终寻路到的所有路点
     * @returns
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

        // 把多个节点连在一起的，横向或者斜向的一连串点，除两边的点保留

        let preNode: RoadNode;
        let midNode: RoadNode;
        let nextNode: RoadNode;

        let preHpos: HoneyPoint;
        let midHpos: HoneyPoint;
        let nextHpos: HoneyPoint;

        // let hround:number[][] = [[-1,-1],[-1,0],[0,1],[1,1],[1,0],[0,-1]];
        // let hround2:number[][] = [[-2,-1],[-1,1],[1,2],[2,1],[1,-1],[-1,-2]];

        // 第一阶段优化： 对横，竖，正斜进行优化
        for (let i = 1; i < nodeArr.length - 1; i++) {
            preNode = nodeArr[i - 1];
            midNode = nodeArr[i];
            nextNode = nodeArr[i + 1];

            preHpos = this.getHoneyPoint(preNode);
            midHpos = this.getHoneyPoint(midNode);
            nextHpos = this.getHoneyPoint(nextNode);

            const bool1: boolean = midNode.cx === preNode.cx && midNode.cx === nextNode.cx;

            const bool2: boolean = (midNode.cy === preNode.cy && midNode.cy === nextNode.cy)
                && ((preNode.cx % 2 === midNode.cx % 2 && midNode.cx % 2 === nextNode.cx % 2));

            const bool3: boolean = preHpos.hx === midHpos.hx && midHpos.hx === nextHpos.hx;

            const bool4: boolean = preHpos.hy === midHpos.hy && midHpos.hy === nextHpos.hy;

            if (bool1 || bool2 || bool3 || bool4) {
                nodeArr.splice(i, 1);
                i--;
            }
        }

        // 第二阶段优化：对不在横，竖，正斜的格子进行优化
        for (let i: number = 0; i < nodeArr.length - 2; i++) {
            const startNode: RoadNode = nodeArr[i];
            let optimizeNode: RoadNode = null;

            // 优先从尾部对比，如果能直达就把中间多余的路点删掉
            let j: number = nodeArr.length - 1;
            for (; j > i + 1; j--) {
                const targetNode: RoadNode = nodeArr[j];

                if (this.isArriveBetweenTwoNodes(this.getHoneyPoint(startNode), this.getHoneyPoint(targetNode))) {
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
    private isArriveBetweenTwoNodes(startPoint: HoneyPoint, targetPoint: HoneyPoint): boolean {
        if (startPoint.hx === targetPoint.hx && startPoint.hy === targetPoint.hy) {
            return false;
        }

        const disX: number = Math.abs(targetPoint.hx - startPoint.hx);
        const disY: number = Math.abs(targetPoint.hy - startPoint.hy);

        let dirX = 0;

        if (targetPoint.hx > startPoint.hx) {
            dirX = 1;
        } else if (targetPoint.hx < startPoint.hx) {
            dirX = -1;
        }

        let dirY = 0;

        if (targetPoint.hy > startPoint.hy) {
            dirY = 1;
        } else if (targetPoint.hy < startPoint.hy) {
            dirY = -1;
        }

        let rx: number = 0;
        let ry: number = 0;
        let intNum: number = 0;
        let decimal: number = 0;

        if (disX > disY) {
            const rate: number = disY / disX;

            for (let i = 0; i < disX; i += 2) {
                ry = i * dirY * rate;
                intNum = dirY > 0 ? Math.floor(startPoint.hy + ry) : Math.ceil(startPoint.hy + ry);
                decimal = Math.abs(ry % 1);

                const hpoint1: HoneyPoint = new HoneyPoint();
                hpoint1.hx = startPoint.hx + i * dirX;
                hpoint1.hy = decimal <= 0.5 ? intNum : intNum + 1 * dirY;

                // cc.log(i + "  :: " ,hpoint1.hx, hpoint1.hy," yy ",startPoint.hy + i * dirY * rate,ry % 1,rate,intNum,decimal,dirY,ry);

                ry = (i + 1) * dirY * rate;
                intNum = dirY > 0 ? Math.floor(startPoint.hy + ry) : Math.ceil(startPoint.hy + ry);
                decimal = Math.abs(ry % 1);

                const hpoint2: HoneyPoint = new HoneyPoint();
                hpoint2.hx = startPoint.hx + (i + 1) * dirX;
                hpoint2.hy = decimal <= 0.5 ? intNum : intNum + 1 * dirY;

                ry = (i + 2) * dirY * rate;
                intNum = dirY > 0 ? Math.floor(startPoint.hy + ry) : Math.ceil(startPoint.hy + ry);
                decimal = Math.abs(ry % 1);

                const hpoint3: HoneyPoint = new HoneyPoint();
                hpoint3.hx = startPoint.hx + (i + 2) * dirX;
                hpoint3.hy = decimal <= 0.5 ? intNum : intNum + 1 * dirY;

                if (!this.isCrossAtAdjacentNodes(startPoint, targetPoint, hpoint1, hpoint2, hpoint3)) {
                    return false;
                }
            }
        } else {
            const rate: number = disX / disY;

            for (let i = 0; i < disY; i += 2) {
                rx = i * dirX * rate;
                intNum = dirX > 0 ? Math.floor(startPoint.hx + rx) : Math.ceil(startPoint.hx + rx);
                decimal = Math.abs(rx % 1);

                const hpoint1: HoneyPoint = new HoneyPoint();
                hpoint1.hx = decimal <= 0.5 ? intNum : intNum + 1 * dirX;
                hpoint1.hy = startPoint.hy + i * dirY;

                rx = (i + 1) * dirX * rate;
                intNum = dirX > 0 ? Math.floor(startPoint.hx + rx) : Math.ceil(startPoint.hx + rx);
                decimal = Math.abs(rx % 1);

                const hpoint2: HoneyPoint = new HoneyPoint();
                hpoint2.hx = decimal <= 0.5 ? intNum : intNum + 1 * dirX;
                hpoint2.hy = startPoint.hy + (i + 1) * dirY;

                rx = (i + 2) * dirX * rate;
                intNum = dirX > 0 ? Math.floor(startPoint.hx + rx) : Math.ceil(startPoint.hx + rx);
                decimal = Math.abs(rx % 1);

                const hpoint3: HoneyPoint = new HoneyPoint();
                hpoint3.hx = decimal <= 0.5 ? intNum : intNum + 1 * dirX;
                hpoint3.hy = startPoint.hy + (i + 2) * dirY;

                if (!this.isCrossAtAdjacentNodes(startPoint, targetPoint, hpoint1, hpoint2, hpoint3)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 判断三个相邻的点是否可通过
     * @param node1
     * @param node2
     */
    private isCrossAtAdjacentNodes(startPoint: HoneyPoint, targetPoint: HoneyPoint, hpoint1: HoneyPoint, hpoint2: HoneyPoint, hpoint3: HoneyPoint): boolean {
        const node1: RoadNode = this.getNodeByHoneyPoint(hpoint1.hx, hpoint1.hy);
        const node2: RoadNode = this.getNodeByHoneyPoint(hpoint2.hx, hpoint2.hy);
        const node3: RoadNode = this.getNodeByHoneyPoint(hpoint3.hx, hpoint3.hy); // 节点3主要用做路径方向的判断

        if (node1 === node2) {
            return false;
        }

        // 前两个点只要有一个点不能通过就不能通过，节点3只做方向向导，不用考虑是否可通过和是否存在
        if (!this.isPassNode(node1) || !this.isPassNode(node2)) {
            return false;
        }

        const dirX1: number = hpoint1.hx - hpoint2.hx;
        const dirY1: number = hpoint1.hy - hpoint2.hy;

        const dirX2: number = hpoint3.hx - hpoint2.hx;
        const dirY2: number = hpoint3.hy - hpoint2.hy;

        // hround:number[][] = [[-1,-1],[-1,0],[0,1],[1,1],[1,0],[0,-1]]; //相邻点向量
        // [-1,1] [1,-1] //特殊相邻点向量

        // 如果不是相邻的两个点 则不能通过
        if ((Math.abs(dirX1) > 1 || Math.abs(dirY1) > 1) || (Math.abs(dirX2) > 1 || Math.abs(dirY2) > 1)) {
            return false;
        }

        // 特殊相邻点 特殊对待
        if (dirX1 === -dirY1) { // 如果第一个点和第二个点是特殊相邻点
            if (dirX1 === -1) {
                if (!this.isPassNode(this.getNodeByHoneyPoint(hpoint2.hx - 1, hpoint2.hy)) || !this.isPassNode(this.getNodeByHoneyPoint(hpoint2.hx, hpoint2.hy + 1))) {
                    return false;
                }
            } else if (!this.isPassNode(this.getNodeByHoneyPoint(hpoint2.hx + 1, hpoint2.hy)) || !this.isPassNode(this.getNodeByHoneyPoint(hpoint2.hx, hpoint2.hy - 1))) {
                return false;
            }
        }

        // 第一个点和第二个点已经可通过，如果第二个点是终点，那么可直达
        if (hpoint2.hx === targetPoint.hx && hpoint2.hy === targetPoint.hy) {
            return true;
        }

        // 特殊相邻点 特殊对待
        if (dirX2 === -dirY2) { // 如果第二个点和第三个点是特殊相邻点
            if (dirX2 === -1) {
                if (!this.isPassNode(this.getNodeByHoneyPoint(hpoint2.hx - 1, hpoint2.hy)) || !this.isPassNode(this.getNodeByHoneyPoint(hpoint2.hx, hpoint2.hy + 1))) {
                    return false;
                }
            } else if (!this.isPassNode(this.getNodeByHoneyPoint(hpoint2.hx + 1, hpoint2.hy)) || !this.isPassNode(this.getNodeByHoneyPoint(hpoint2.hx, hpoint2.hy - 1))) {
                return false;
            }
        }

        // 如果相邻的点和目标点在同一直线
        if (hpoint1.hx === hpoint2.hx && hpoint2.hx === hpoint3.hx) {
            return true;
        }

        // let hround2:number[][] = [[-2,-1],[-1,1],[1,2],[2,1],[1,-1],[-1,-2]];

        if (this.isPassNode(this.getNodeByHoneyPoint(hpoint2.hx + (dirX1 + dirX2), hpoint2.hy + (dirY1 + dirY2)))) {
            return true;
        }

        return false;
    }

    /**
     * 获得六边形格子坐标（以正斜角和反斜角为标准的坐标）
     * @param node
     */
    public getHoneyPoint(node: RoadNode): HoneyPoint {
        const hx: number = node.cy + Math.ceil(node.cx / 2); // 设置反斜角为x坐标
        const hy: number = node.cy - Math.floor(node.cx / 2); // 设置正斜角为y坐标

        return new HoneyPoint(hx, hy);
    }

    /**
     * 根据六边形格子坐标获得路节点
     * @param hx
     * @param hy
     * @returns
     */
    public getNodeByHoneyPoint(hx: number, hy: number): RoadNode {
        const cx: number = hx - hy; // 研究出来的
        const cy: number = Math.floor((hx - hy) / 2) + hy; // 研究出来的

        return this.getRoadNode(cx, cy);
    }

    /**
     * 获得一个点周围指定方向相邻的一个点
     * @param node 制定的点
     * @param roundIndex 0是下，然后顺时针，5右下
     */
    public getRoundNodeByIndex(node: RoadNode, roundIndex: number): RoadNode {
        if (!node) {
            return null;
        }

        roundIndex %= 6;

        let round: number[][];

        if (node.cx % 2 === 0) {
            round = this._round1;
        } else {
            round = this._round2;
        }
        const cx: number = node.cx + round[roundIndex][0];
        const cy: number = node.cy + round[roundIndex][1];

        return this.getRoadNode(cx, cy);
    }

    /**
     * 获得一个点周围所有的相邻点
     * @param node
     */
    public getRoundNodes(node: RoadNode): RoadNode[] {
        let round: number[][];

        if (node.cx % 2 === 0) {
            round = this._round1;
        } else {
            round = this._round2;
        }

        const nodeArr: RoadNode[] = [];

        for (let i: number = 0; i < round.length; i++) {
            const cx: number = node.cx + round[i][0];
            const cy: number = node.cy + round[i][1];

            const node2: RoadNode = this.getRoadNode(cx, cy);

            nodeArr.push(node2);
        }

        return nodeArr;
    }

    /**
     * 是否是可通过的点
     * @param node
     */
    public isPassNode(node: RoadNode): boolean {
        if (node == null || node.value === ENUM_ROAD.Block) {
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
                console.log('没找到目标计算步骤为：', step);
                clearInterval(this._handle);
                return;
            }

            step++;

            this.searchRoundNodes(this._currentNode);

            if (this._binaryTreeNode.isTreeNull()) { // 二叉堆树里已经没有任何可搜寻的点了，则寻路结束，每找到目标
                console.log('没找到目标计算步骤为：', step);
                clearInterval(this._handle);
                return;
            }

            this._currentNode = this._binaryTreeNode.getMin_F_Node();

            if (this._currentNode === this._targetNode) {
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
        let round: number[][];

        if (node.cx % 2 === 0) {
            round = this._round1;
        } else {
            round = this._round2;
        }

        for (let i: number = 0; i < round.length; i++) {
            const cx: number = node.cx + round[i][0];
            const cy: number = node.cy + round[i][1];
            const node2: RoadNode = this.getRoadNode(cx, cy);

            if (this.isPassNode(node2) && node2 !== this._startNode && !this.isInCloseList(node2)) {
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

        if (node.cx === this._currentNode.cx || node.cy === this._currentNode.cy) {
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
     * 释放资源
     */
    public dispose(): void {
        this._roadNodes = null;
        this._round1 = null;
        this._round2 = null;
    }
}

/**
 * 六边形格子坐标（以正斜角和反斜角为标准的坐标）
 */
class HoneyPoint {
    public hx: number = 0;
    public hy: number = 0;

    public constructor(x: number = 0, y: number = 0) {
        this.hx = x;
        this.hy = y;
    }
}
