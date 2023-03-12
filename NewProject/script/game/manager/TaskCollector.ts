/*
 * @Author: hrd
 * @Date: 2022-04-22 12:03:50
 * @LastEditors: hrd
 * @LastEditTime: 2022-05-27 17:29:21
 * @FilePath: \SanGuo\assets\script\game\manager\TaskCollector.ts
 * @Description: 任务收集器
 *
 */

type CollectorHandler = { taskFunc: ()=> void, target: unknown }

export default class TaskCollector {
    private static _i: TaskCollector = null;
    public static get I(): TaskCollector {
        if (!this._i) {
            this._i = new TaskCollector();
        }
        return this._i;
    }

    // 龙珠收集状态
    private _taskStateDict: { [key: number]: { [id: number]: boolean; }; } = {};
    // 龙珠要做的事
    private _taskFunc: { [key: number]: CollectorHandler } = {};

    /**
     * 添加任务
     * @param key 任务key
     * @param taskIdList 任务Id列表
     * @param taskFunc 任务队列完成回调
     */
    public addTaskList(key:DB_KEY_ENUM, taskIdList:Array<number>, taskFunc: ()=>void, target: unknown): void {
        this._taskStateDict[key] = {};
        const handler: CollectorHandler = { taskFunc, target };
        this._taskFunc[key] = handler;
        for (let i = 0; i < taskIdList.length; i++) {
            this._taskStateDict[key][taskIdList[i]] = false;
        }
    }

    /**
     *  完成一个任务
     * @param key
     * @param taskId 任务Id
     */
    public endTask(key:DB_KEY_ENUM, taskId: number): void {
        if (!Object.prototype.hasOwnProperty.call(this._taskStateDict, key)) {
            return;
        }
        const taskObj = this._taskStateDict[key];
        if (taskObj[taskId] !== undefined) {
            this._taskStateDict[key][taskId] = true;
            // console.log('----------  add one ---  '+ ball +' -----');
        }
        this.callDragon(key);
    }

    /**
     * 根据任务类型名称来判断任务是否完成
     * @param key
     */
    public checkName(key: DB_KEY_ENUM): boolean {
        if (this._taskStateDict[key] === undefined) {
            return false;
        }

        const task = this._taskStateDict[key];
        for (const key in task) {
            if (!task[key]) {
                return false;
            }
        }
        return true;
    }

    public clear(): void {
        this._taskStateDict = {};
        this._taskFunc = {};
    }

    public clearByKey(key: DB_KEY_ENUM): void {
        if (Object.prototype.hasOwnProperty.call(this._taskStateDict, key)) {
            delete this._taskStateDict[key]; // 删除任务列表
        }
        if (Object.prototype.hasOwnProperty.call(this._taskFunc, key)) {
            delete this._taskFunc[key]; // 删除执行函数
        }
    }

    private callDragon(key:DB_KEY_ENUM) {
        if (!Object.prototype.hasOwnProperty.call(this._taskStateDict, key)) {
            return;
        }
        if (this.checkName(key)) {
            if (this._taskFunc[key]) {
                const handler = this._taskFunc[key];
                handler.taskFunc.call(handler.target);
            }
            this.clearByKey(key);
        }
    }
}

export enum DB_KEY_ENUM {
    /** 游戏加载完成 */
    LodgingEnd = 1,
    /** 显示登陆界面 */
    ShowLoginUI = 2,

}

export enum DB_ID_ENUM {
    /** 登录回包 */
    LoginBack,
    /** 获取角色信息 */
    RoelInfoEnd,
    /** 配置表初始化完成 */
    ConfigInitEnd,
    /** 地图初始化完成 */
    MapInitEnd,
    /** 主界面始化完成 */
    MainUIInitEnd,
    /** 协议加载完成 */
    LodgingProto,
    /** 跟节点初始化 */
    InitRoot,

}
