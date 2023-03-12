/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Author: hrd
 * @Date: 2022-03-28 11:27:55
 * @LastEditors: Please set LastEditors
 * @Description:
 */
import { E } from '../../../../game/const/EventName';
import { AppEvent } from '../../../AppEventConst';
import { EventClient } from '../../../base/event/EventClient';
import BaseVo from '../BaseVo';
import WinMgr from '../WinMgr';
import BaseCmp from './BaseCmp';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseUiView extends BaseCmp {
    /** 视图界面基础数据 */
    public viewVo: BaseVo;
    /** 视图数据是否初始化完成 */
    private _dataInit = false;
    /** ui组件是否初始化完成 */
    private _uiInit = false;

    public initEndHandler: () => void = null;

    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 复写时必须调用 super()
     */
    protected onLoad(): void {
        super.onLoad();
    }
    /**
     * 复写时必须调用 super()
     */
    protected start(): void {
        super.start();
        this._uiInit = true;
        this.checkInit();
    }
    /**
     * 复写时必须调用 super()
     */
    protected onEnable(): void {
        super.onEnable();
        // 参数区分打开界面
        EventClient.I.emit(E.Win.WinOpen, this.viewVo);
    }

    /**
     * 复写时必须调用 super()
     */
    protected onDisable(): void {
        super.onDestroy();
    }
    /**
     * 复写时必须调用 super()
     */
    protected onDestroy(): void {
        this.doDestroy();
    }

    /**
     * 面板开启执行函数，用于子类继承，不建议直接调用
     * @param param 参数
     */
    public open(...param: unknown[]): void {
        this._dataInit = true;
        this.checkInit();
        this.addToLayer();
    }

    protected addToLayer(): void {
        if (!this.viewVo) return;
        EventClient.I.emit(AppEvent.ViewAddToLayer, this.viewVo.layerType, this.node);
    }

    /** 布局 */
    protected align(): void {
        // todo
    }

    /** 判断是否初始化完成 */
    private checkInit() {
        if (!this._uiInit) {
            return;
        }
        if (!this._dataInit) {
            return;
        }
        this.init(this.viewVo.extraParam);
        if (this.initEndHandler) {
            this.initEndHandler();
        }
    }

    /** UI和数据都初始化完毕  如果有东西修改UI的内容  在这里面处理 */
    public init(...param: unknown[]): void {
        // if (this.initEndHandler) {
        //     this.initEndHandler();
        // }
    }

    public refreshView(...param: unknown[]): void {
        // todo
    }

    /** 当舞台尺寸发生了变化 */
    public stageOnResize(): void {
        this.align();
    }

    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    public _close(): void {
        super._close();
    }

    protected close(): void {
        WinMgr.I.close(this.uiId);
    }

    /** 执行关闭视图 */
    public closeView(): void {
        WinMgr.I.closeView(this);
    }

    /**
     * 销毁
     */
    private doDestroy(): void {
        this.viewVo = null;
    }
}
