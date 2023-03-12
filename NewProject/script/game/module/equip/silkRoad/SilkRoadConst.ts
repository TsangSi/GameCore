/** 城池节点 */
export interface RoadPoint {
    /** 城池编号 */
    id: number,
    /** 花费时间 */
    time: number,
    /** 城池名称 */
    name: string
}

export interface RoadReward {
    itemId: number;
    itemNum: number;
}

/** 线路 */
export interface RoadData {
    /** 编号 */
    id: number;
    /** 模型 */
    img: number;
    /** 路线名称 */
    name: string;
    /** 显示品质 */
    quality: number;
    /** 时间总和 */
    time: number;
    /** 消耗类型 */
    costType: number;
    /** 消耗数量 */
    costNum: number;
    /** 事件概率 */
    eventPriority: number;
    /** 路线节点 */
    points: RoadPoint[];
    /** 奖励 */
    reward: RoadReward[];
}
