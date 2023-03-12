/*
 * @Author: hrd
 * @Date: 2022-05-27 17:03:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-22 18:24:18
 * @FilePath: \SanGuo\assets\script\game\com\win\WinTabPage.ts
 * @Description: 标签页
 *
 */

import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../app/core/mvc/WinMgr';
import WinTabFrame from './WinTabFrame';
import PerformanceMgr from '../../manager/PerformanceMgr';
import { FuncId } from '../../const/FuncConst';
import { RedDotMgr } from '../../module/reddot/RedDotMgr';
import RedDotModelMgr from '../../module/reddot/RedDotModelMgr';

const { ccclass } = cc._decorator;

@ccclass
export class WinTabPage extends BaseCmp {
    /** 窗口id */
    protected winId: number;
    /** 主窗口实例对象 */
    protected param: unknown;
    /** 点击了win页签索引 */
    protected tabIdx: number;
    /** 点击了win页签Id */
    protected tabId: number;
    protected _funcId: number;

    private _isOnLoadEnd = false;
    private _isStartEnd = false;
    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    protected onLoad(): void {
        super.onLoad();
        this._isOnLoadEnd = true;
        this.checkInit();
    }

    /**
     * WinTabPage 不需要在start处理业务，移至init
     */
    protected start(): void {
        super.start();
        PerformanceMgr.I.endCollect(this.winId);
        this._isStartEnd = true;
        this.checkInit();
    }

    /** 判断是否初始化完成 */
    private checkInit(): void {
        if (!this._isOnLoadEnd) {
            return;
        }
        if (!this._isStartEnd) {
            return;
        }
        this.init(this.winId, this.param, this.tabIdx, this.tabId);
    }

    /** 生命周期 onLoad之后 start之前 */
    public _init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        // todo
        this.winId = winId;
        this.tabIdx = tabIdx;
        this.tabId = tabId;
        this.param = param;

        // console.log('---------------winId=', winId, tabIdx);
    }

    /** 生命周期 start之后 只在page初始化时调用一次 */
    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        // console.log('---------------winId=', winId, tabIdx);
    }

    /** 页签初始化后，每次切换调用  */
    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        this.tabIdx = tabIdx;
        this.tabId = tabId;
    }

    public getWinTabFrame(): WinTabFrame {
        const vo = WinMgr.I.getBaseVo(this.winId);
        return vo.view ? vo.view as WinTabFrame : null;
    }

    public set funcId(v: number) {
        this._funcId = v;

        // 处理funcid的添加红点监听
        RedDotModelMgr.I.registerRedDot(v);
    }

    public get funcId(): number {
        return this._funcId;
    }

    protected onDestroy(): void {
        super.onDestroy();
        /** 移除红点的监听 */
        RedDotModelMgr.I.unRegisterRedDot(this.funcId);
    }
}
