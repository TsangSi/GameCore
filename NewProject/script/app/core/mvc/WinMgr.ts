/* eslint-disable dot-notation */
/*
 * @Author: hrd
 * @Date: 2022-03-28 11:44:49
 * @FilePath: \SanGuo2.4\assets\script\app\core\mvc\WinMgr.ts
 * @Description: 窗口管理类
 *
 */
import { E } from '../../../game/const/EventName';
import PerformanceMgr from '../../../game/manager/PerformanceMgr';
import { AppEvent } from '../../AppEventConst';
import { EventClient } from '../../base/event/EventClient';
import { ResMgr } from '../res/ResMgr';
import BaseVo, { IBaseVo, PopupType } from './BaseVo';
import BaseUiView from './view/BaseUiView';
import { GameLayerEnum } from './WinConst';

export default class WinMgr {
    /** 视图对象数据 */
    private _viewObjs: { [key: number]: BaseVo };
    /** 打开中的视图面版列表 */
    private _viewList: BaseUiView[] = [];
    /** 暂存关闭视图数据列表 */
    private _stashVoList: BaseVo[] = [];
    /** 加载中的视图数据 */
    // private _loaddingVo: BaseVo;
    /** 加载中的视图 */
    private _loaddingIdList: number[] = [];
    /** 视图基础数据 */
    private _voCfgs: { [key: number]: IBaseVo };
    /** 弹窗视图列表容器 */
    private _popupViews: { [key: number]: BaseVo[] };
    /** 打开窗口序号自曾值 */
    private _openIndex: number = 0;
    /**
     * 构造函数
     */
    public constructor() {
        this._viewObjs = cc.js.createMap(true);
        this._voCfgs = cc.js.createMap(true);
        this._popupViews = cc.js.createMap(true);
    }

    private static Instance: WinMgr;
    public static get I(): WinMgr {
        if (!this.Instance) {
            this.Instance = new WinMgr();
        }
        return this.Instance;
    }

    /** 添加视图配置
     * @param info 视图配置基础数据
     */
    public addConfig(info: IBaseVo): void {
        if (!info.resClass) {
            return;
        }
        this._voCfgs[info.id] = info;
    }

    /**
     * 面板注册
     * @param key 面板唯一标识
     * @param view 面板
     */
    public register(registerVo: BaseVo): void {
        if (!registerVo.resClass) {
            return;
        }
        if (registerVo.view) {
            return;
        }
        this._viewObjs[registerVo.id] = registerVo;
    }

    /**
     * 开启面板
     * @param key 面板唯一标识
     * @param param 参数
     *
     */
    public open(key: number, ...param: any[]): void {
        console.log('开启面板:', key, this.getVoCfgByWinId(key));
        PerformanceMgr.I.startCollect(key);
        this._open(key, param).then(
            () => {
                this.startCollect();
            },
            (err) => {
                this.delLoaddingId(key);
                console.log(err);
            },
        );
    }

    public getVoCfgByWinId(winId: number): string {
        if (this._voCfgs[winId]) {
            return this._voCfgs[winId].prefabPath;
        }
        return '';
    }

    /** 需要重写 用于打开界面收集HttpRequest数据 */
    public startCollect(): void {
        //
    }

    private async _open(key: number, param: any): Promise<void> {
        const voInfo = this._voCfgs[key];
        if (!voInfo) {
            console.log(`UI_${key}不存在`);
            return;
        }
        // console.error(`>>>>>>>>>>>>>>${key}`, ViewConst[key]);

        let registerVo: BaseVo = this._viewObjs[key];

        console.log(registerVo);

        if (!registerVo) {
            // console.log(`UI_${key}不存在`);
            registerVo = new BaseVo();
            registerVo.init(voInfo);
            this.register(registerVo);
            // return;
        }
        this._openIndex++;
        const isPopupView: PopupType = registerVo.isPopup;
        if (registerVo.view) { // 在打开状态的
            if (!isPopupView) {
                registerVo.zIndex = this._openIndex;
                registerVo.extraParam = param;
                registerVo.view.refreshView(param);
                this.setTop(registerVo.view, registerVo.view.node.parent);
                console.log(`UI_${key}已经在显示中`);
                return;
            } else {
                if (!this._popupViews[key]) this._popupViews[key] = [];
                const vo = new BaseVo();
                vo.init(voInfo);
                vo.extraParam = param;
                vo.zIndex = this._openIndex;
                vo.view = registerVo.view;
                if (isPopupView === PopupType.Last) {
                    this._popupViews[key].push(vo);
                } else if (isPopupView === PopupType.Nwe) {
                    vo.view.refreshView(param);
                    this._popupViews[key].unshift(registerVo);
                }
                return;
            }
        }
        if (this._loaddingIdList.indexOf(registerVo.id) !== -1) {
            console.log(`UI_${key}加载中...`);
            if (isPopupView) {
                if (!this._popupViews[key]) this._popupViews[key] = [];
                const vo = new BaseVo();
                vo.init(voInfo);
                vo.extraParam = param;
                vo.zIndex = this._openIndex;
                vo.view = registerVo.view;
                this._popupViews[key].push(vo);
            }
            return;
        }
        registerVo.zIndex = this._openIndex;
        await this._openByVo(registerVo, param);
    }

    private async _openByVo(registerVo: BaseVo, param: any): Promise<void> {
        registerVo.extraParam = param;
        EventClient.I.emit(AppEvent.ControllerCheck, registerVo.mid);
        if (!registerVo.view) {
            this._loaddingIdList.push(registerVo.id);
            const temCla = registerVo.resClass;
            const prefab = await ResMgr.I.loadAsync(registerVo.prefabPath, cc.Prefab);
            if (!prefab) {
                this.delLoaddingId(registerVo.id);
                return;
            }
            const t = new Date().getTime();
            const node = cc.instantiate(prefab);
            const view = temCla(node);
            if (!view) {
                this.delLoaddingId(registerVo.id);
                node.destroy();
                return;
            }
            registerVo.view = view;
            registerVo.view.viewVo = registerVo;
            registerVo.view.uiId = registerVo.id;
            this.onViewAdd(registerVo);
            const endTime = new Date().getTime() - t;
            console.log(`【${node.name}】instanite+addChild时间:${endTime}毫秒`);
        } else {
            registerVo.view.open.apply(registerVo.view, registerVo.extraParam);
        }
        // this.hideOldView();
        registerVo.view.initEndHandler = () => {
            this.hideOldView();
        };
        this.delLoaddingId(registerVo.id);
    }

    private delLoaddingId(id: number) {
        const idx = this._loaddingIdList.indexOf(id);
        this._loaddingIdList.splice(idx, 1);
    }

    /**
     * 添加面版
     * @param vo 面版数据参数
     */
    private onViewAdd(vo: BaseVo): void {
        vo.view.open(vo.extraParam);
        this._viewList.push(vo.view);
        if (vo.layerType === GameLayerEnum.DEFAULT_LAYER && vo.view && vo.view.node && vo.view.node.parent) {
            this.refreshViewZOrder(vo.view.node.parent);
        }

        // if (this._viewList.length > 4) {
        //     const vo = this._viewList[this._viewList.length - 1];
        //     this._close(vo.viewVo);
        //     console.warn('弹窗窗口达到上限=====', vo.viewVo.id, this._viewList.length);
        // }
    }

    /**
     * 关闭面板
     * @param key 面板唯一标识
     * @param param 参数
     */
    public close(key: number): void {
        // console.log('关闭面板', key);
        const registerVo: BaseVo = this._viewObjs[key];
        if (!registerVo || !registerVo.view) {
            return;
        }
        if (!registerVo.view.node.parent) {
            return;
        }
        const ret = this.checkPopupView(key);
        // if (isAsync && ret) {
        //     const p = this._closeAsync(registerVo);
        // } else {
        //     this._close(registerVo);
        // }
        if (ret) {
            this.openPopupView(registerVo);
        } else {
            this._close(registerVo);
        }
    }

    public _close(registerVo: BaseVo): void {
        registerVo.view._close.apply(registerVo.view);
        this.delViewObj(registerVo);
        registerVo.view = null;
        registerVo.extraParam = null;
        this.hideOldView();
    }

    /**
     * 关闭面板
     * @param view this
     */
    public closeView(view: BaseUiView): void {
        this.close(view.uiId);
    }

    /**
     * 关闭多个面板
     * @param viewids 面板id列表
     * @param args  参数列表
     */
    public closeViewAttr(viewArgs: number[]): void;
    public closeViewAttr(viewArgs: number[], ...args: unknown[]): void {
        if (viewArgs.length !== 0) {
            viewArgs.forEach((vid, index) => {
                this.close(vid);
            });
        }
    }

    /**
     * 关闭所有面板
     * @param isStash 是否需要暂存，
     * 使用暂存模式可通过 resetStashViews() 恢复暂存列表内的界面。
     */
    public closeAll(isStash: boolean = false): void {
        // console.log('-------closeAll----------', isStash, this._viewList);
        this._stashVoList = [];
        while (this._viewList.length > 0) {
            const view = this._viewList[0];
            if (view && view.viewVo) {
                this.close(view.viewVo.id);
                const vo = view.viewVo;
                if (isStash) {
                    this._stashVoList.push(vo);
                }
            }
        }
        this._viewList = [];
        this._popupViews = cc.js.createMap(true);
    }

    /** 判断窗口是否开启 */
    public checkIsOpen(key: number): boolean {
        const registerVo: BaseVo = this._viewObjs[key];
        if (registerVo && registerVo.view) {
            return true;
        }
        return false;
    }

    /** 获取界面注册数据 */
    public getBaseVo(key: number): BaseVo {
        return this._viewObjs[key];
    }

    /** 移除窗口对象 */
    private delViewObj(vo: BaseVo): void {
        const vid = vo.id;
        const index = this._viewList.indexOf(vo.view);
        if (index > -1) {
            this._viewList.splice(index, 1);
        }

        for (let idx = 0; idx < this._stashVoList.length; idx++) {
            const vo = this._stashVoList[idx];
            if (vo.id === vid) {
                this._stashVoList.splice(idx, 1);
                break;
            }
        }
    }

    /**
     * 隐藏旧的窗口
     */
    private _isShowPre: boolean = false;
    private hideOldView() {
        // const arr = [];
        let isShow = true;
        const len = this._viewList.length;
        for (let i = len - 1; i >= 0; i--) {
            const view = this._viewList[i];
            if (!view.viewVo) {
                console.log(view);
            }
            if (view.viewVo.layerType !== GameLayerEnum.DEFAULT_LAYER) {
                continue;
            }
            const oldShow = view.getHideState();
            if (oldShow !== isShow) {
                this.hideView(view, isShow);
            }
            const isShowAll = view.viewVo.isShowAll;
            if (isShowAll) {
                isShow = false;
            }
        }
        if (this._isShowPre !== isShow) {
            EventClient.I.emit(AppEvent.WinBigAllClose, isShow);
            this._isShowPre = isShow;
        }
    }

    private hideView(view: BaseUiView, isShow: boolean) {
        if (!view.viewVo.isNotHide) {
            view.setHide(isShow);
        }

        // winCmp.close_state = isShow;
        // if (isShow == false) {
        //     this.closeWin(winCmp);
        // }
    }

    /** 设置到顶部 */
    private setTop(view: BaseUiView, p: cc.Node) {
        this.refreshViewZOrder(p);
        const index = this._viewList.indexOf(view);
        if (index > -1) {
            this._viewList.splice(index, 1);
        }
        this._viewList.push(view);
        this.hideOldView();
    }

    /** 刷新视图渲染层级 */
    private refreshViewZOrder(p: cc.Node): void {
        if (!p) return;
        const arr: cc.Node[] = [];
        p.children.forEach((nd: cc.Node) => {
            arr.push(nd);
        });
        const len = arr.length;
        let nowZidx = 0;
        for (let i = 0; i < len; i++) {
            const nd = arr[i];
            const com = nd.getComponent('BaseUiView') as BaseUiView;
            if (com && com.viewVo) {
                const vo = com.viewVo;
                nd.setSiblingIndex(vo.zIndex);
                nowZidx = vo.zIndex;
            } else if (nd) nd.setSiblingIndex(nowZidx);
        }
    }

    /** 检查改view ID是存在弹窗列表 */
    private checkPopupView(key: number): boolean {
        const infoVos: BaseVo[] = this._popupViews[key];
        if (infoVos && infoVos.length > 0) {
            return true;
        }
        return false;
    }

    /** 打开缓存的堆叠窗口 */
    private openPopupView(registerVo: BaseVo): void {
        // let p: Promise<void> = null;
        const infoVos: BaseVo[] = this._popupViews[registerVo.id];
        if (infoVos && infoVos.length > 0) {
            const vo = infoVos.shift();
            this._viewObjs[registerVo.id] = vo;
            // p = this._openByVo(vo, vo.extraParam);
            if (!vo.view) {
                vo.view = registerVo.view;
            }
            vo.view.refreshView(vo.extraParam);
        }
        // return p;
    }

    /**
     * 清除弹窗视图列表容器记录
     * @param key 界面id
     */
    public clearPopupView(key: number): void {
        if (this._popupViews[key]) {
            this._popupViews[key].length = 0;
        }
    }

    /** 打开界面收集接口 */
    public openViewCollect(): void {
        //
    }

    /** 恢复暂存视图界面
     * 界面恢复后会清空暂存视图数据。
    */
    public resetStashViews(): void {
        if (!this._stashVoList || this._stashVoList.length <= 0) {
            return;
        }
        console.log('========', this._stashVoList);
        for (let i = 0; i < this._stashVoList.length; i++) {
            const vo = this._stashVoList[i];
            if (!vo.stashParam) continue; // 没有暂存参数的不处理
            // const p = this._openByVo(vo, vo.stashParam);
            this.open(vo.id, ...vo.stashParam);
        }
        // 清空暂存视图数据
        this.clearAllStashVo();
    }

    /** 清除所有暂存数据 */
    public clearAllStashVo(): void {
        this._stashVoList = [];
    }

    /** 设置界面暂存参数 */
    public setViewStashParam(key: number, param: unknown[]): void {
        const vo = this.getBaseVo(key);
        if (!vo) return;
        vo.setStashParam(param);
    }
}
