/*
 * @Author: lijun
 * @Date: 2023-02-20 11:17:05
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { HuarongdaoGenType, HuarongdaoMatchState, IHuarongdaoActivityTimeStep } from '../HuarongdaoConst';
import HuarongdaoHandlerView from './HuarongdaoHandlerView';
import HuarongdaoMapView from './HuarongdaoMapView';
import HuarongdaoResult from './HuarongdaoResult';
import HuarongdaoTips from './HuarongdaoTips';

const { ccclass } = cc._decorator;

@ccclass
export default class HuarongdaoPage extends WinTabPage {
    private _mapView: HuarongdaoMapView = null;
    private _handlerView: HuarongdaoHandlerView = null;
    private _resultView: HuarongdaoResult = null;
    private _tipsView: HuarongdaoTips = null;
    private _countDownView: cc.Node = null;

    private _time: number = 0;// 阶段时间
    private _activityStep: IHuarongdaoActivityTimeStep = null;// 时间阶段
    private _initViewState: boolean = false;// 界面是否实例化完成
    private _initFinished: boolean = false;// 收取数据并刷新完成

    protected start(): void {
        super.start();
        this.addE();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
        ModelMgr.I.HuarongdaoModel.clearData();
    }

    protected onDisable(): void {
        ModelMgr.I.HuarongdaoModel.clearData();
        super.onDestroy();
    }

    protected onEnable(): void {
        super.onEnable();
        if (this._initViewState) { // 页签切回来的时候拉数据,_initViewState避免重复拉取
            ControllerMgr.I.HuarongdaoController.reqC2SHuarongInfo();
        }
    }

    public init(): void {
        // 实例化赛跑界面
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.HuarongdaoMapView, this.node, (err, node) => {
            this._mapView = node.getComponent(HuarongdaoMapView);
            // 实例化操作界面
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.HuarongdaoHandlerView, this.node, (err, node) => {
                this._handlerView = node.getComponent(HuarongdaoHandlerView);
                // 实例化聊天组件
                ResMgr.I.showPrefabOnce(UI_PATH_ENUM.HuarongdaoBulletChat, this.node, (err, node) => {
                    if (err) {
                        console.log(err);
                    }
                });

                this._mapView.init();
                this._handlerView.init();

                if (!this._initViewState) {
                    ControllerMgr.I.HuarongdaoController.reqC2SHuarongInfo();
                }

                this._initViewState = true;// 界面实例化完成
            });
        });
    }

    public addE(): void {
        EventClient.I.on(E.Huarongdao.UpdateView, this.updateView, this);
    }

    public remE(): void {
        EventClient.I.off(E.Huarongdao.UpdateView, this.updateView, this);
    }

    /** 追逐结果展示 */
    private showResultView() {
        if (this._resultView) {
            this._resultView.node.active = true;
            this._resultView.initView();
        } else {
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.HuarongdaoResult, this.node, (err, node) => {
                if (node) {
                    this._resultView = node.getComponent(HuarongdaoResult);
                    this._resultView.initView();
                }
            });
        }
    }

    private hideResultView() {
        if (this._resultView) {
            this._resultView.node.active = false;
        }
    }

    /** 活动提示 */
    private showTipsView() {
        if (this._tipsView) {
            this._tipsView.node.active = true;
        } else {
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.HuarongdaoTips, this.node, (err, node) => {
                if (node) {
                    this._tipsView = node.getComponent(HuarongdaoTips);
                }
            });
        }
    }

    /** 关闭活动提示 */
    private hideTipsView() {
        if (this._tipsView) {
            this._tipsView.node.active = false;
        }
    }

    /** 倒计时 */
    private showCountDownView() {
        if (this._countDownView) {
            this._countDownView.active = true;
        } else {
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.HuarongdaoCountDown, this.node, (err, node) => {
                if (node) {
                    this._countDownView = node;
                }
            });
        }
        this.scheduleOnce(() => {
            this.hideCountDownView();
            this.updateActivityStep();
            this._initFinished = true;
        }, 3);

        /** 倒计时需要将追逐过程延后3秒，添加一个倒计时时间段，后续按当前时间刷新位置需要扣除3秒 */
        ModelMgr.I.HuarongdaoModel.setCountDownTime(3);
        ModelMgr.I.HuarongdaoModel.setMatchState(HuarongdaoMatchState.countDown);
        this._mapView.updateTimeStep();
        this._mapView.loadInitPos();

        this.scheduleOnce(() => {
            ControllerMgr.I.HuarongdaoController.reqC2SHuarongInfo();
        }, 2);
    }

    /** 倒计时结束 */
    private hideCountDownView() {
        if (this._countDownView) {
            this._countDownView.active = false;
        }
    }

    /** 收到活动数据，刷新页面 */
    private updateView(): void {
        this._initFinished = false;
        if (ModelMgr.I.HuarongdaoModel.getMatchState() !== HuarongdaoMatchState.countDown) {
            this.updateActivityStep();
        }

        this._mapView.updateView();
    }

    /** 刷新活动阶段
     */
    private updateActivityStep(): void {
        this._activityStep = ModelMgr.I.HuarongdaoModel.getActivityTimeStep();

        if (this._activityStep.type >= 0) {
            this._initFinished = true;
        } else {
            this._initFinished = false;
        }
        if (this._activityStep.type === HuarongdaoMatchState.wait) { // 等待开始阶段，展示活动开始提示，若数据不对，5秒后重新拉取数据
            this.hideResultView();
            this.showTipsView();
            this._time = this._activityStep.time || 5;
            ModelMgr.I.HuarongdaoModel.setMatchState(HuarongdaoMatchState.wait);
        } else if (this._activityStep.type === HuarongdaoMatchState.support) { // 押注阶段，关闭所有提示弹窗
            this.hideResultView();
            this.hideTipsView();
            this._time = this._activityStep.time || 5;
            ModelMgr.I.HuarongdaoModel.setMatchState(HuarongdaoMatchState.support);
        } else if (this._activityStep.type === HuarongdaoMatchState.match) { // 赛跑阶段
            this._time = this._activityStep.time;
            ModelMgr.I.HuarongdaoModel.setMatchState(HuarongdaoMatchState.match);
        } else if (this._activityStep.type === HuarongdaoMatchState.over) { // 结算阶段，避免突兀，延迟0.3秒显示结算界面
            this._time = this._activityStep.time;
            ModelMgr.I.HuarongdaoModel.setMatchState(HuarongdaoMatchState.over);
            this.scheduleOnce(() => {
                this.showResultView();
            }, 0.3);
        } else { // 异常数据，重新拉取数据
            ModelMgr.I.HuarongdaoModel.setMatchState(HuarongdaoMatchState.wait);
            this.scheduleOnce(() => {
                this.requestData();
            }, 5);
        }

        this._handlerView.updateTimeStep(this._activityStep);
        this._mapView.updateTimeStep(this._activityStep);
    }

    /** 计时 */
    protected updatePerSecond(): void {
        if (this._tipsView && this._tipsView.node.active) {
            this._tipsView.updateSecond();
        }
        if (this._handlerView && this._handlerView.node.active) {
            this._handlerView.updateSecond();
        }

        if (!this._initFinished) { return; }
        if (this._time <= 0) {
            if (ModelMgr.I.HuarongdaoModel.getMatchState() === HuarongdaoMatchState.wait
                || ModelMgr.I.HuarongdaoModel.getMatchState() === HuarongdaoMatchState.support) {
                this._initFinished = false;
                if (this._activityStep.type === HuarongdaoMatchState.support) { // 押注阶段完毕，开始倒计时
                    this.showCountDownView();
                } else { // 阶段完毕，重新拉数据获取新的阶段的数据，（服务端要求，未到相应阶段，没有对应数据，所以阶段倒计时结束重新请求）
                    ControllerMgr.I.HuarongdaoController.reqC2SHuarongInfo();
                }
            } else if (ModelMgr.I.HuarongdaoModel.getMatchState() === HuarongdaoMatchState.over) { // 结算阶段完毕，清理旧数据，获取新数据
                this.requestData();
            } else { // 赛跑阶段完毕，清理倒计时时间，进入下一阶段
                ModelMgr.I.HuarongdaoModel.setCountDownTime(0);
                this.updateActivityStep();
            }
        } else {
            if (!this._activityStep || this._activityStep.type < 0 || this._activityStep.type === HuarongdaoMatchState.match) {
                this._time--;// 如果数据异常或赛跑阶段，正常计时
            } else {
                // 避免切换页签或后台导致时间不准，实时计算剩余时间
                this._time = ModelMgr.I.HuarongdaoModel.getActivityLeastTime(this._activityStep.type);
            }

            /** 追逐最后1秒 */
            if (this._time === 1 && ModelMgr.I.HuarongdaoModel.getMatchState() === HuarongdaoMatchState.match) {
                this.checkCatchState();
            }
        }
    }

    /** 请求华容道数据 */
    private requestData(): void {
        this._initFinished = false;
        ModelMgr.I.HuarongdaoModel.clearData();
        this._mapView.resetView();
        ControllerMgr.I.HuarongdaoController.reqC2SHuarongInfo();
    }

    /** 是否抓曹操 */
    private checkCatchState() {
        const win = ModelMgr.I.HuarongdaoModel.getWinGeninfo();
        if (ModelMgr.I.HuarongdaoModel.getGenType(win.Id) === HuarongdaoGenType.other) {
            this._mapView.catchCaocaoAnim();
        }
    }

    protected update(dt: number): void {
        super.update(dt);
        // eslint-disable-next-line no-unused-expressions
        this._mapView && this._mapView.mainUpdate(dt);
    }
}
