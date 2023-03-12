/*
 * @Author: myl
 * @Date: 2022-11-16 15:02:01
 * @Description:
 */
export enum HeadPhotoType {
    /** 头像 */
    Head = 1,
    /** 头像框 */
    headFrame = 2,
    /** 气泡框 */
    chatBubble = 3,
}

/** 组装的列表数据 */
export type HeadItemData = { data: HeadInfo, cfg: Cfg_Photo, sort: number };
