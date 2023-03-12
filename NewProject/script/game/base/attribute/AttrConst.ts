/*
 * @Author: zs
 * @Date: 2022-06-21 21:50:02
 * @FilePath: \SanGuo\assets\script\game\base\attribute\AttrConst.ts
 * @Description:
 *
 */
export enum EAttrType {
    /** 生命, */
    Attr_1 = 1,
    /** 攻击, */
    Attr_2 = 2,
    /** 防御, */
    Attr_3 = 3,
    /** 命中, */
    Attr_4 = 4,
    /** 闪避, */
    Attr_5 = 5,
    /** 暴击, */
    Attr_6 = 6,
    /** 抗暴, */
    Attr_7 = 7,
    /** 攻速, */
    Attr_8 = 8,
    /** 无视防御, */
    Attr_9 = 9,
    /** 减免无视, */
    Attr_10 = 10,
    /** 伤害加深, */
    Attr_11 = 11,
    /** 伤害减免, */
    Attr_12 = 12,
    /** 伤害增加加成, */ // 不显示
    Attr_13 = 13,
    /** 伤害减免加成, */ // 不显示
    Attr_14 = 14,
    /** 暴击伤害增加, */
    Attr_15 = 15,
    /** 暴击伤害减免, */
    Attr_16 = 16,
    /** 致命一击, */
    Attr_17 = 17,
    /** 致命抵抗, */
    Attr_18 = 18,
    /** PVP伤害增加, */
    Attr_19 = 19,
    /** PVP伤害减免, */
    Attr_20 = 20,
    /** PVE伤害增加, */
    Attr_21 = 21,
    /** PVE伤害减免, */
    Attr_22 = 22,
    /** 额外伤害, */
    Attr_23 = 23,
    /** 仙击, */
    Attr_24 = 24,
    /** 仙抗, */
    Attr_25 = 25,
    /** 金攻击, */
    Attr_26 = 26,
    /** 金防御, */
    Attr_27 = 27,
    /** 木攻击, */
    Attr_28 = 28,
    /** 木防御, */
    Attr_29 = 29,
    /** 水攻击, */
    Attr_30 = 30,
    /** 水防御, */
    Attr_31 = 31,
    /** 火攻击, */
    Attr_32 = 32,
    /** 火防御, */
    Attr_33 = 33,
    /** 土攻击, */
    Attr_34 = 34,
    /** 土防御, */
    Attr_35 = 35,
    /** 金伤害加深, */
    Attr_36 = 36,
    /** 金伤害减免, */
    Attr_37 = 37,
    /** 木伤害加深, */
    Attr_38 = 38,
    /** 木伤害减免, */
    Attr_39 = 39,
    /** 水伤害加深, */
    Attr_40 = 40,
    /** 水伤害减免, */
    Attr_41 = 41,
    /** 火伤害加深, */
    Attr_42 = 42,
    /** 火伤害减免, */
    Attr_43 = 43,
    /** 土伤害加深, */
    Attr_44 = 44,
    /** 土伤害减免, */
    Attr_45 = 45,
    /** 全系攻击, */
    Attr_46 = 46,
    /** 全系防御, */
    Attr_47 = 47,
    /** 全系伤害加深, */
    Attr_48 = 48,
    /** 全系伤害减免, */
    Attr_49 = 49,
    /** 生命, */ // 万分比 生命加成
    Attr_51 = 51,
    /** 攻击, */ // 万分比 攻击加成
    Attr_52 = 52,
    /** 防御, */ // 万分比 防御加成
    Attr_53 = 53,
    /** 命中, */ // 万分比 命中加成
    Attr_54 = 54,
    /** 闪避, */ // 万分比 闪避加成
    Attr_55 = 55,
    /** 暴击, */ // 万分比 暴击加成
    Attr_56 = 56,
    /** 抗暴, */ // 万分比 抗暴
    Attr_57 = 57,
    /** 攻速, */ // 万分比 攻速
    Attr_58 = 58,
    /** 无视防御, */ // 万分比 无视防御
    Attr_59 = 59,
    /** 减免无视, */ // 万分比 减免无视
    Attr_60 = 60,
    /** 伤害加深, */ // 万分比 伤害加深
    Attr_61 = 61,
    /** 伤害减免, */ // 万分比 伤害减免加成
    Attr_62 = 62,
    /** 伤害增加, */ // 万分比 伤害增加加成
    Attr_63 = 63,
    /** 伤害减免, */ // 万分比 伤害减免加成
    Attr_64 = 64,
    /** 暴击伤害增加, */ // 万分比 暴击伤害增加加成
    Attr_65 = 65,
    /** 暴击伤害减免, */ // 万分比 暴击伤害减免加成
    Attr_66 = 66,
    /** 致命一击百分比, */ // 万分比 致命一击加成
    Attr_67 = 67,
    /** 致命抵抗百分比, */ // 万分比 致命抵抗加成
    Attr_68 = 68,
    /** PVP伤害增加百分比, */ // 万分比 PVP伤害增加加
    Attr_69 = 69,
    /** PVP伤害减免百分比, */ // 万分比 PVP伤害减免加
    Attr_70 = 70,
    /** PVE伤害增加百分比, */ // 万分比 PVE伤害增加加
    Attr_71 = 71,
    /** PVE伤害减免百分比, */ // 万分比 PVE伤害减免加
    Attr_72 = 72,
    /** 额外伤害, */ // 万分比 额外伤害加成
    Attr_73 = 73,
    /** 仙击, */ // 万分比 仙击加成
    Attr_74 = 74,
    /** 仙抗, */ // 万分比 仙抗加成
    Attr_75 = 75,
    /** 真实命中, */ // 真实命中
    Attr_101 = 101,
    /** 真实暴击, */ // 真实暴击
    Attr_102 = 102,
    /** 星之力, */ // 星之力
    Attr_323 = 323,
    /** 星之力百分比, */ // 星之力百分比
    Attr_324 = 324,
    /** 星之盾, */ // 星之盾
    Attr_325 = 325,
    /** 星之盾百分比, */ // 星之盾百分比
    Attr_326 = 326,
    /** 主角星之力, */ // 星之盾百分比
    Attr_327 = 327,
    /** 主角星之盾, */ // 星之盾百分比
    Attr_328 = 328,
    /** 宠物星之力, */ // 星之盾百分比
    Attr_329 = 329,
    /** 宠物星之盾, */ // 星之盾百分比
    Attr_330 = 330,
    /** 战神星之力, */ // 星之盾百分比
    Attr_331 = 331,
    /** 战神星之盾, */ // 星之盾百分比
    Attr_332 = 332,
    /** 英雄星之力, */ // 星之盾百分比
    Attr_333 = 333,
    /** 英雄星之盾, */ // 星之盾百分比
    Attr_334 = 334,
    /** 异兽星之力, */ // 星之盾百分比
    Attr_335 = 335,
    /** 异兽星之盾, */ // 星之盾百分比
    Attr_336 = 336,
    /** 神龙星之力, */ // 星之盾百分比
    Attr_337 = 337,
    /** 神龙星之盾, */ // 星之盾百分比
    Attr_338 = 338,
    /** 偃甲星之力, */ // 星之盾百分比
    Attr_339 = 339,
    /** 偃甲星之盾, */ // 星之盾百分比
    Attr_340 = 340,
    /** 仙童星之力, */ // 星之盾百分比
    Attr_341 = 341,
    /** 仙童星之盾, */ // 星之盾百分比
    Attr_342 = 342,
    /** 天仙星之力, */ // 星之盾百分比
    Attr_343 = 343,
    /** 天仙星之盾, */ // 星之盾百分比
    Attr_344 = 344,
    /** 神击, */ // 神击概率增加
    Attr_351 = 351,
    /** 神抗, */ // 神抗概率减少
    Attr_352 = 352,
    /** 神击, */ // 神击概率增加百分比
    Attr_201 = 201,
    /** 神抗, */ // 神抗概率减少百分比
    Attr_202 = 202,
}

export interface IShowAttrOption {
    /** 间隔符，默认换行 */
    s?: string,
    /** 属性名的颜色，默认常用色 */
    nameC?: string,
    /** 属性值的颜色，默认绿色 */
    valueC?: string,
    /** 列数，默认0，一行显示 */
    Column?: number,
    /** 字体大小 */
    ASize?: number,
}

/** 属性显示类型 */
export enum EAttrShowType {
    /** 生命 100（有颜色，用于富文本） */
    SpaceRich = '<color={0}>{1}</c> <color={2}>{3}</c>',
    /** 生命+100（有颜色，用于富文本） */
    PlusRich = '<color={0}>{1}</c><color={2}>+{3}</c>',
    /** 生命    +100（4个空格，有颜色，用于富文本） */
    PlusSpace4Rich = '<color={0}>{1}</c><color={2}>    +{3}</c>',
    /** 生命:100（有颜色，用于富文本） */
    ColonRich = '<color={0}>{1}:</c><color={2}>{3}</c>',
    /** 生命: 100（有颜色，用于富文本） */
    SpaceAndColonRich = '<color={0}>{1}: </c><color={2}>{3}</c>',
    /** 生命 100 */
    Space = '{0} {1}',
    /** 生命+100 */
    Plus = '{0}+{1}',
    /** 生命:100 */
    Colon = '{0}:{1}',
    /** 生命: 100 */
    SpaceAndColon = '{0}: {1}',
}
export interface IAttrBase {
    /** 属性类型id */
    attrType: EAttrType,
    /** 属性值 */
    value: number,
    /** 属性名 */
    name?: string,
    /** 属性key字段名 */
    key?: string,
    /** 升阶系统类型 */
    gradeType?: number
    /** 升阶系统类型万分比加成 */
    gradeAdd?: number
    /** 特殊属性 */
    extraAttr?: string
}

export interface IAttrInfo {
    /** 战力 */
    fightValue?: number;
    attrs: IAttrBase[];
}

export enum ERoleAttrID {
    /** 用户称号 */
    Title = 530,
    /** 坐骑幻化id */
    GradeHorse = 570,
    /** 羽翼幻化id */
    GradeWing = 571,
    /** 光武幻化id */
    GradeWeapon = 572,
}

/** 角色属性界面类型 */
export enum EShowAttrType {
    /** 基础 */
    Base = 1,
    /** 高级 */
    Advanced = 2,
    /** 特殊 */
    Special = 3
}

export interface BaseAddOptions {
    isCustom?: boolean, // 自定义显示
    isShowAdd?: boolean, // 是否显示加成
    isShowAddSign?: boolean,
    isShowLine?: boolean, // 是否显示线
    // 总的宽度
    baseAddwidth?: number, // 默认是280
    // 左边的
    NdAttrWidth?: number, // 左边的宽度默认180
    NdAttrX?: number, // 默认是-140
    NdAttrSpaceX?: number, // 默认是5
    NdAttrColor?: string, // 属性颜色
    signkey?: string, // 符号 “：”//防御:10
    signVal?: string, // 符号 “+” 攻击+5
    // 右边的
    NdAddWidth?: number, // 右边的宽度默认100
    NdAddX?: number, // 默认是40
    NdAddSpaceX?: number, // 默认是0
    NdAddColor?: string// #0xddslj
    // 修改resizeMode
    resizeMode?: cc.Layout.ResizeMode,
}

/** 属性展示tip窗口中每一条的目录 */
export interface IAttrDetailTipCfg {
    title: string,
    attrIds?: number[],
    attrId?: number
}
