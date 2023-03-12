/*
 * @Author: hrd
 * @Date: 2022-03-28 11:31:24
 * @FilePath: \SanGuo2.4\assets\script\app\core\mvc\BaseVo.ts
 * @Description:
 *
 */

import { WinSmallType } from '../../../game/com/win/WinSmall';
import BaseUiView from './view/BaseUiView';
import {
    GameLayerEnum, IWinTabData,
} from './WinConst';

export interface IBaseVo {
    /** 视图 Id */
    id: number;
    /** 视图 UI层类型 */
    layerType: GameLayerEnum;
    /** 预制路径 */
    prefabPath: string;
    /** 获取预制脚本组件 */
    resClass: (node) => BaseUiView;
    /** 模块id */
    mid: number;
    /** 是否使用缩放特效打开 默认flase */
    scaleEff?: boolean;
    /** 是否使用半黑背景 默认为false */
    blackBg?: boolean;
    /** 是否点击半黑背景关闭界面 默认为true */
    blackBgClickClose?: boolean;
    /** 黑背景的透明度 */
    backBgAlpha?: number;
    /** 额外参数 */
    extraParam?: unknown;
    /** 界面暂存参数 (缓存如一级、二级界面参数) */
    stashParam?: unknown;
    /** 页签数据 */
    tabData?: IWinTabData[];
    /** 子页类名 */
    childView?: string,
    /** 子页预制体路径 */
    childPath?: string,
    /** 标题 */
    title?: string,
    /** 窗口大小 */
    size?: cc.Size,
    /** 显示点击空白区域关闭 */
    isShowTips?: boolean,
    /** 是否全屏显示视图 */
    isShowAll?: boolean;
    /** 是否为重复弹窗视图 */
    isPopup?: number;
    /** 窗口叠加时不隐藏 */
    isNotHide?: boolean;
    /** 用来对View节点进行排序 */
    zIndex?: number;
    /** winSmall窗口类型 */
    winSmallType?: WinSmallType;
    /** 是否点击空白处关闭 */
    isBlackClose?: boolean;
    /** 是否显示关闭按钮 */
    isShowBtnClose?: boolean;
}

export enum PopupType {
    /** 默认 */
    Normall = 0,
    /** 优先显示最新界面 */
    Nwe = 1,
    /** 优先显示旧界面 */
    Last = 2,
}

export default class BaseVo implements IBaseVo {
    public constructor() {
        // todo
    }

    /** 视图 Id */
    public id: number;
    /** 视图 UI层节点 */
    public layer: cc.Node = null;
    /** 视图 UI层类型 */
    public layerType: GameLayerEnum;
    /** 预制脚本对象 */
    public resClass: (node) => BaseUiView = null;
    /** 视图 */
    public view: BaseUiView;
    public resources: string[];
    /** 是否使用缩放特效打开 默认flase */
    public scaleEff = false;
    /** 是否使用半黑背景 默认为false */
    public blackBg = false;
    /** 是否点击半黑背景关闭界面 默认为true */
    public blackBgClickClose = true;
    /** 黑背景的透明度 */
    public backBgAlpha = 1;
    /** 额外参数 */
    public extraParam: unknown;
    /** 界面暂存参数 (缓存如一级、二级界面参数) */
    public stashParam?: unknown[];
    /** 预制路径 */
    public prefabPath: string = '';
    /** 页签数据 */
    public tabData: IWinTabData[];
    /** 模块id */
    public mid: number;
    /** 子页类名 */
    public childView: string;
    /** 子页预制体路径 */
    public childPath: string;
    /** 显示点击空白区域关闭 */
    public isShowTips: boolean = false;
    /** 是否全屏显示视图 */
    public isShowAll: boolean = true;
    /** 是否为重复弹窗视图 */
    public isPopup: number = PopupType.Normall;
    /** 窗口大小 */
    public size?: cc.Size;
    /** 标题 */
    public title?: string;
    /** 窗口叠加时不隐藏 */
    public isNotHide?: boolean = false;
    /** 用来对View节点进行排序 */
    public zIndex: number = 0;
    // /** winSmall窗口类型 */
    public winSmallType: WinSmallType = 0;
    /** 是否点击空白处关闭 */
    public isBlackClose: boolean = true;
    /** 显示关闭按钮 */
    public isShowBtnClose: boolean = true;

    private n: cc.Node = null;

    public init(data: IBaseVo): void {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const v = data[key];
                this[key] = v;
            }
        }
    }

    /** 设置暂存参数 */
    public setStashParam(param: unknown[]): void {
        this.stashParam = param;
    }
}
