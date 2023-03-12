/*
 * @Author: hrd
 * @Date: 2022-03-28 10:09:04
 * @Description: 控制器基类
 */
export interface IBaseController extends BaseController {
    /** 统一打开界面接口() */
    linkOpen?(): boolean

    /** 统一打开界面接口(页签id) */
    linkOpen?(tab: number): boolean

    /** 统一打开界面接口(页签id, 字符串参数, 动态传入的参数1,参数2,参数3) */
    linkOpen?(tab: number, param1: any[] | undefined, ...args: any[]): boolean
}

export default abstract class BaseController {
    /** 如果子类的这个值不赋值，就是2000到5000的一个随机值,如果是-1的话，就是立即执行 */
    protected gameStartDelay = 0;
    /**
     * 构造函数
     */
    public constructor() {
        this._init();
    }
    private _init() {
        this.addNetEvent();
        this.addClientEvent();
        this.init();
    }

    private do(): void {
        //
    }
    public init(): void {
        //
    }

    // /** 注册视图配置 */
    // protected abstract registerVoCfg(): void;

    /** 监听网络事件 子类实现 */
    public abstract addNetEvent(): void;

    /** 移除网络事件 子类实现 */
    public abstract delNetEvent(): void;

    /** 监听业务事件 子类实现 */
    public abstract addClientEvent(): void;

    /** 移除网络事件 子类实现 */
    public abstract delClientEvent(): void;

    /** 清理数据 */
    public abstract clearAll(): void

    /** 重置 */
    public reset(): void {
        this.delNetEvent();
        this.delClientEvent();
        this.clearAll();
    }
}
