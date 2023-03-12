import { UI_PATH_ENUM } from '../../const/UIPath';

/*
 * @Author: hwx
 * @Date: 2022-06-21 12:07:06
 * @FilePath: \SanGuo\assets\script\game\com\tips\ItemTipsConst.ts
 * @Description: Tips 常量
 */

export const ItemTipsContentPath = {
    /** 通用Tips */
    General: UI_PATH_ENUM.Com_Tips_Content_ItemTipsGeneralContent,
    /** 属性 */
    Attr: UI_PATH_ENUM.Com_Tips_Content_ItemTipsAttrContent,
    /** 装备Tips */
    Equip: UI_PATH_ENUM.Com_Tips_Content_ItemTipsEquipContent,
    /** 随机宝箱Tips */
    RandomChest: UI_PATH_ENUM.Com_Tips_Content_ItemTipsRandomChestContent,
    /** 自选宝箱Tips */
    PickChest: UI_PATH_ENUM.Com_Tips_Content_ItemTipsPickChestContent,
    /** 化身Tips */
    Avatar: UI_PATH_ENUM.Com_Tips_Content_ItemTipsAvatarContent,
};

export const ItemTipsUseType = {
    /** 无 */
    None: 0,
    /** 普通 */
    Normal: 1,
    /** 鲜花 */
    Flower: 2,
    /** 邮寄 */
    Mail: 3,
    /** 多选一 */
    Multi: 4,
    /** 预览 */
    Preview: 5,
    /** 合成 */
    Compose: 6,
};

/** 属性项类型 */
export const enum ItemTipsAttrItemType {
    /** 基础属性 */
    BASE = 1,
    /** 附加属性 */
    ADD = 2,
    /** 洗炼属性 */
    WASH = 3,
    /** 镶嵌属性 */
    INLAID = 4
}

/** 属性项信息 */
export interface ItemTipsAttrItemInfo {
    /** 属性项类型ID */
    id: ItemTipsAttrItemType,
    /** 属性项标题 */
    title: string,
    /** 属性字符串 */
    attrStr: string,
    /** 强化等级，基础属性才有 */
    strengthLv?: number,
    /** 强化属性字符串，基础属性才有 */
    strengthAttrStr?: string,
    /** 化金等级，基础属性才有 */
    goldLv?: number,
    /** 化金属性字符串，基础属性才有 */
    goldAttrStr?: string,
}
