import { IAttrBase } from '../../../base/attribute/AttrConst';
import { NumberS } from '../../../const/GameConst';

/*
 * @Author: zs
 * @Date: 2022-07-19 10:59:17
 * @FilePath: \SanGuo\assets\script\game\module\roleskin\v\RoleSkinConst.ts
 * @Description:
 *
 */
export interface ICfgRoleSkin {
    Id: number,
    AnimId: NumberS,
    Name: string,
    Attrs?: IAttrBase[],
    AddAttrs?: IAttrBase[],
    Quality?: number,
    AttrId?: number,
    NeedItem?: number,
    IconId?: string,
    GradeHorse?: number,
    GradeWing?: number,
    GradeWeapon?: number,
    isSuit?: boolean,
}

export interface IRoleSkinItem extends cc.Node {
    _cfgRoleSkin: ICfgRoleSkin
}

/** 角色套装分类 */
export enum ERoleSkinPageIndex {
    /** 时装 */
    Skin = 0,
    /** 时装套装 */
    SkinSuit = 1,
    /** 活动套装/荣誉套装 */
    ActitySuit = 2,
    /** 异域套装 */
    ExoticSuit = 3,
    /** 仙装 */
    SpecialSuit = 11,

}
/** 套装部件数量 */
export const SUIT_PART_COUNT = 4;
/** 套装部件起始数量 */
export const SUIT_PART_STAR = 2;

/** 套装部件索引 */
export enum ESkinPartIndex {
    /** 時裝 */
    Body,
    /** 坐騎 */
    Horse,
    /** 翅膀 */
    Wing,
    /** 光武 */
    Weapon,
}

/** 时装注灵最大值 */
export const ROLESKIN_SOUL_MAX_LEVEL = 30;
