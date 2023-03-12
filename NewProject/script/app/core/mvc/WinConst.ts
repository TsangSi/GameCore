/*
 * @Author: hrd
 * @Date: 2022-03-28 15:08:48
 * @FilePath: \SanGuo2.4\assets\script\app\core\mvc\WinConst.ts
 * @Description:
 */

/** 游戏层级 */
export enum GameLayerEnum {
    /** 地图层 */
    MAP_LAYER = 1,
    /** 主城层 */
    MAIN_CITY_LAYER = 2,
    /** 战斗层 */
    BATTLE_LAYER = 3,
    /** 层级在主界面层下面的 */
    DOWN_LAYER = 4,
    /** 主界面层 */
    MAIN_LAYER = 5,
    /** 默认UI弹出层 */
    DEFAULT_LAYER = 6,
    /** 提示窗层 */
    TIPS_LAYER = 7,
    /** 飘字层 */
    POP_LAYER = 8,
    /** 警告提示层 */
    WARN_LAYER = 9
}

export class WinTabData {
    /** 下标id */
    public TabId: number = 0;
    /** 标题文本 */
    // public title: string = '';
    /** 标题图片 */
    // public titleImg: string = '';
    /** 按钮图片 */
    public btnImg: string = '';
    // /** 按钮标识 */
    // public mark: string = '';
    /** 红点id */
    public redId: number = 0;
    /** 预制路径 */
    public prefabPath: string;
    /** 类名 */
    public className: string;
}

export enum EMarkType {
    /** 没有 */
    None = 0,
    /** 双倍 */
    Double = 1,
    /** 有新类型就补充吧 */
}

/** 页签数据结构 */
export interface IWinTabData {
    /** 下标id */
    TabId: number;
    /** 功能id */
    funcId?: number,
    /** 页签按钮id，对应页签图标与标题 */
    TabBtnId?: number,
    /** 活动对应按钮名，用于页签图标与标题 */
    ActBtnName?: string,
    /** 引导id */
    guideId?: number,
    /** 标题文本 */
    // title?: string;
    /** 标题图片 */
    // titleImg?: string;
    /** 按钮图片 */
    // btnImg?: string;
    // /** 按钮标识 */
    // mark: string ;
    /** 红点id */
    redId?: number;
    /** 预制路径 */
    prefabPath: string;
    /** 类名 */
    className: string;
    /** 按钮标题url */
    btnTitle?: string;
    /** 判断页签是否初始化无需赋值 */
    _isInit?: boolean;
    /** 顶部的说明弹窗ID */
    descId?: number;
    /** 标签 */
    markType?: EMarkType,
}
