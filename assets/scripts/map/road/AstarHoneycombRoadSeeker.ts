/* eslint-disable max-len */
import IRoadSeeker from './IRoadSeeker';
import RoadNode from './RoadNode';

/**
 * 六边形 A*寻路算法
 *
 */
export default class AstarHoneycombRoadSeeker implements IRoadSeeker {
    /**
         * 横向移动一个格子的代价
         */
    private COST_STRAIGHT = 10;
    /**
     * 斜向移动一个格子的代价
     */
    private COST_DIAGONAL = 10;
    /**
     *最大搜寻步骤数，超过这个值时表示找不到目标
    */
    private maxStep = 1000;
    /**
     * 开启列表
     */
    private _openlist: Array<RoadNode>;
    /**
     *关闭列表
    */
    private _closelist: Array<RoadNode>;
    /**
     *开始节点
    */
    private _startNode: RoadNode;
    /**
     *当前检索节点
    */
    private _currentNode: RoadNode;
    /**
     *目标节点
    */
    private _targetNode: RoadNode;
    /**
    *地图路点数据
    */
    private _roadNodes: { [key: number]: RoadNode; };
    /**
     *用于检索一个节点周围6个点的向量数组 格子列数为偶数时使用
        */
    private _round1: number[][] = [[0, -1], [1, -1], [1, 0], [0, 1], [-1, 0], [-1, -1]];
    /**
     *用于检索一个节点周围6个点的向量数组 格子列数为奇数时使用
        */
    private _round2: number[][] = [[0, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];

    private handle = undefined;

    /**
     * 是否优化路径
     */
    private optimize = true;
    public constructor(roadNodes: { [key: string]: RoadNode; }) {
        this._roadNodes = roadNodes;
    }
    /**
     *寻路入口方法
        * @param startNode
        * @param targetNode
        * @return
        *
        */
    public seekPath(startNode: RoadNode, targetNode: RoadNode): Array<RoadNode> {
        this._startNode = startNode;
        this._currentNode = startNode;
        this._targetNode = targetNode;
        if (!this._startNode || !this._targetNode) {
            return [];
        } else if (this._targetNode.value === 1) {
            console.log('目标不可达到：');
            return [];
        }

        this._openlist = [];
        this._closelist = [];
        let step = 0;
        while (step <= this.maxStep) {
            if (step > this.maxStep) {
                // console.log('没找到目标计算步骤为：', step);
                return [];
            }
            step++;
            this.searchRoundNodes(this._currentNode);
            if (this._openlist.length === 0) {
                // console.log('没找到目标计算步骤为：', step);
                return [];
            }
            this._openlist.sort(this.sortNode);
            this._currentNode = this._openlist.shift();
            if (this._currentNode === this._targetNode) {
                // console.log('找到目标计算步骤为：', step);
                return this.getPath();
            } else {
                this._closelist.push(this._currentNode);
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
        if (!this._startNode || !this._targetNode) {
            return [];
        }
        this._openlist = [];
        this._closelist = [];
        let step = 0;
        let closestNode: RoadNode = null; // 距离目标最近的路点
        while (step <= this.maxStep) {
            if (step > this.maxStep) {
                // console.log('没找到目标计算步骤为：', step);
                return this.seekPath(startNode, closestNode);
            }
            step++;
            this.searchRoundNodes(this._currentNode);
            if (this._openlist.length === 0) {
                // console.log('没找到目标计算步骤为：', step);
                return this.seekPath(startNode, closestNode);
            }
            this._openlist.sort(this.sortNode);
            this._currentNode = this._openlist.shift();
            if (closestNode == null) {
                closestNode = this._currentNode;
            } else if (this._currentNode.h < closestNode.h) {
                closestNode = this._currentNode;
            }
            if (this._currentNode === this._targetNode) {
                console.log('找到目标计算步骤为：', step);
                return this.getPath();
            } else {
                this._closelist.push(this._currentNode);
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
        *
        */
    private getPath(): Array<RoadNode> {
        const nodeArr: Array<RoadNode> = [];
        let node: RoadNode = this._targetNode;
        while (node !== this._startNode) {
            nodeArr.unshift(node);
            node = node.parent;
        }
        if (!this.optimize) {
            return nodeArr;
        }

        // 把多个节点连在一起的，横向或者斜向的一连串点，除两边的点保留

        let preNode: RoadNode;
        let midNode: RoadNode;
        let nextNode: RoadNode;

        for (let i = 1; i < nodeArr.length - 1; i++) {
            preNode = nodeArr[i - 1];
            midNode = nodeArr[i];
            nextNode = nodeArr[i + 1];

            let bool = false;

            let otherNode: RoadNode = null;

            if (Math.abs(nextNode.cx - preNode.cx) === 2 && preNode.cy === nextNode.cy) {
                if (midNode.cx % 2 === 0) {
                    if (midNode.cy === preNode.cy) {
                        otherNode = this._roadNodes[`${midNode.cx}_${midNode.cy + 1}`] as RoadNode;
                    } else {
                        otherNode = this._roadNodes[`${midNode.cx}_${midNode.cy - 1}`] as RoadNode;
                    }
                } else if (midNode.cy === preNode.cy) {
                    otherNode = this._roadNodes[`${midNode.cx}_${midNode.cy - 1}`] as RoadNode;
                } else {
                    otherNode = this._roadNodes[`${midNode.cx}_${midNode.cy + 1}`] as RoadNode;
                }
            }/* else if(midNode.px == nextNode.py && Math.abs(midNode.cx - preNode.cx) <= 1)
            {
                if(midNode.cx % 2 == 0)
                {
                    if(midNode.cy == preNode.cy)
                    {
                        otherNode = this._roadNodes[midNode.cx + "_" + (midNode.cy + 1)] as RoadNode
                    }else
                    {
                        otherNode = this._roadNodes[midNode.cx + "_" + (midNode.cy - 1)] as RoadNode
                    }

                }else
                {
                    if(midNode.cy == preNode.cy)
                    {
                        otherNode = this._roadNodes[midNode.cx + "_" + (midNode.cy - 1)] as RoadNode
                    }else
                    {
                        otherNode = this._roadNodes[midNode.cx + "_" + (midNode.cy + 1)] as RoadNode
                    }
                }
            } */

            if (otherNode) { bool = otherNode.value !== 1; }

            if (bool) {
                nodeArr.splice(i, 1);
                i--;
            }
        }

        for (let i = 1; i < nodeArr.length - 1; i++) {
            preNode = nodeArr[i - 1];
            midNode = nodeArr[i];
            nextNode = nodeArr[i + 1];

            const bool1: boolean = midNode.cx === preNode.cx && midNode.cx === nextNode.cx;

            const bool2: boolean = (midNode.cy === preNode.cy && midNode.cy === nextNode.cy) && ((preNode.cx % 2 === midNode.cx % 2 && midNode.cx % 2 === nextNode.cx % 2));

            const bool3: boolean = preNode.cy - Math.floor(preNode.cx / 2) === midNode.cy - Math.floor(midNode.cx / 2) && midNode.cy - Math.floor(midNode.cx / 2) === nextNode.cy - Math.floor(nextNode.cx / 2);

            const bool4: boolean = preNode.cy + Math.ceil(preNode.cx / 2) === midNode.cy + Math.ceil(midNode.cx / 2) && midNode.cy + Math.ceil(midNode.cx / 2) === nextNode.cy + Math.ceil(nextNode.cx / 2);

            if (bool1 || bool2 || bool3 || bool4) {
                nodeArr.splice(i, 1);
                i--;
            }
        }

        return nodeArr;
    }

    /**
     *测试寻路步骤
        * @param startNode
        * @param targetNode
        * @return
        *
        */
    public testSeekPathStep(startNode: RoadNode, targetNode: RoadNode, callback: (...arg: any) => void, target: any, time = 100): void {
        this._startNode = startNode;
        this._currentNode = startNode;
        this._targetNode = targetNode;

        if (this._targetNode.value === 1) { return; }

        this._openlist = [];
        this._closelist = [];

        let step = 0;

        clearInterval(this.handle);
        this.handle = setInterval(() => {
            if (step > this.maxStep) {
                // console.log('没找到目标计算步骤为：', step);
                clearInterval(this.handle);
                return;
            }

            step++;

            this.searchRoundNodes(this._currentNode);

            if (this._openlist.length === 0) {
                // console.log('没找到目标计算步骤为：', step);
                clearInterval(this.handle);
                return;
            }

            this._openlist.sort(this.sortNode);

            this._currentNode = this._openlist.shift();

            if (this._currentNode === this._targetNode) {
                // console.log('找到目标计算步骤为：', step);
                clearInterval(this.handle);
                callback.apply(target, [this._startNode, this._targetNode, this._currentNode, this._openlist, this._closelist, this.getPath()]);
            } else {
                this._closelist.push(this._currentNode);
                callback.apply(target, [this._startNode, this._targetNode, this._currentNode, this._openlist, this._closelist, null]);
            }
        }, time);
    }

    /**
     *查找一个节点周围可通过的点
        * @param node
        * @return
        *
        */
    private searchRoundNodes(node: RoadNode): void {
        let round: number[][];

        if (node.cx % 2 === 0) {
            round = this._round1;
        } else {
            round = this._round2;
        }

        for (let i = 0; i < round.length; i++) {
            const cx: number = node.cx + round[i][0];
            const cy: number = node.cy + round[i][1];
            const node2: RoadNode = this._roadNodes[`${cx}_${cy}`] as RoadNode;

            if (node2 != null && node2 !== this._startNode && node2.value !== 1 && !this.isInCloseList(node2) /* && !inInCorner(node2) */) {
                this.setNodeF(node2);
            }
        }
    }

    /**
     *设置节点的F值
        * @param node
        *
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
            } else {
                return;
            }
        } else {
            node.g = g;
            this._openlist.push(node);
        }

        node.parent = this._currentNode;
        node.h = (Math.abs(this._targetNode.cx - node.cx) + Math.abs(this._targetNode.cy - node.cy)) * this.COST_STRAIGHT;
        node.f = node.g + node.h;
    }

    /**
     *节点是否在开启列表
        * @param node
        * @return
        *
        */
    private isInOpenList(node: RoadNode): boolean {
        return this._openlist.indexOf(node) !== -1;
    }

    /**
     *节点是否在关闭列表
        *
        */
    private isInCloseList(node: RoadNode): boolean {
        return this._closelist.indexOf(node) !== -1;
    }

    /**
     *节点是否在拐角处
        * @return
        *
        */
    private inInCorner(node: RoadNode): boolean {
        if (node.cx === this._currentNode.cx || node.cy === this._currentNode.cy) {
            return false;
        }

        const node1: RoadNode = this._roadNodes[`${this._currentNode.cx}_${node.cy}`] as RoadNode;
        const node2: RoadNode = this._roadNodes[`${node.cx}_${this._currentNode.cy}`] as RoadNode;

        if (node1 != null && node1.value === 0 && node2 != null && node2.value === 0) {
            return false;
        }

        return true;
    }

    public dispose(): void {
        this._roadNodes = null;
        this._round1 = null;
        this._round2 = null;
    }
}
