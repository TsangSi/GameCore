/* eslint-disable semi */
/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-tabs */
/*
 * @Author: kexd
 * @Date: 2022-04-25 15:40:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-05 10:04:54
 * @FilePath: \SanGuo2.4\assets\script\game\base\mapBase\road\IRoadSeeker.ts
 * @Description:寻路接口
 *
 */
import RoadNode from './RoadNode';

export default interface IRoadSeeker {
    /**
     *寻路入口方法（管理使用seekPath还是seekPath2）
     * @param startNode
     * @param targetNode
     * @returns
     */
    findPath(startNode: RoadNode, targetNode: RoadNode): Array<RoadNode>;
    /**
     *寻路入口方法
     * @param startNode
     * @param targetNode
     * @returns
     */
    seekPath(startNode: RoadNode, targetNode: RoadNode): Array<RoadNode>;

    /**
     *寻路入口方法 如果没有寻到目标，则返回离目标最近的路径
     * @param startNode
     * @param targetNode
     * @returns
     */
    seekPath2(startNode: RoadNode, targetNode: RoadNode): Array<RoadNode>;

    /**
     *测试寻路步骤
     * @param startNode
     * @param targetNode
     * @returns
     */
    testSeekPathStep(startNode: RoadNode, targetNode: RoadNode, callback: Function, target: any, time: number): void;

    /**
     * 是否是可通过的点
     * @param node
     */
    isPassNode(node: RoadNode): boolean

    /**
     * 根据世界坐标获得路节点
     * @param cx
     * @param cy
     * @returns
     */
    getRoadNode(cx: number, cy: number): RoadNode
};
