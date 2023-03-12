/*
 * @Author: kexd
 * @Date: 2022-09-22 16:44:45
 * @FilePath: \SanGuo\assets\script\game\module\general\gskin\GskinConst.ts
 * @Description: 武将-皮肤 常量
 */
/** 武将皮肤页签 */
export enum GskinPageType {
    /** 皮肤界面 */
    Skin = 0,
}

export enum GSkinState {
    /** 未激活 */
    UnActive = 0,
    /** 可激活 */
    CanActive,
    /** 可升星(已激活材料够，红点) */
    CanUpStar,
    /** 已激活但材料不够，不能升星 */
    CannotUpStar,
    /** 已满级 */
    MaxStar,
}
