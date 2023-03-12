/*
 * @Author: hwx
 * @Date: 2022-06-09 20:38:36
 * @FilePath: \SanGuo-2.4-main\assets\script\game\com\tab\TabData.ts
 * @Description: 页签常量
 */
export interface TabData {
    /** 唯一ID */
    id: number,
    /** 图标路径，成对出现，未选中xxx_02，选中xxx_01，下标自动补全 */
    icon?: string,
    /** 标题 */
    title?: string,
    /** 红点ID */
    redId?: number,
    /** 是否尾部数据 */
    isTrail?: boolean,
    /** ui 路径 */
    uiPath?: string,
    /** 功能id */
    funcId?: number,
    /** 引导id */
    guideId?: number,
    /** 功能能描述 */
    descId?: number,
    /** 点击是否缩放 */
    notScale?: boolean
}
