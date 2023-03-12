/*
 * @Author: kexd
 * @Date: 2023-02-17 11:27:50
 * @FilePath: \SanGuo2.4\assets\script\game\module\funcPreview\FuncPreviewConst.ts
 * @Description:
 *
 */

export enum EFuncState {
    /** 未开放 */
    UnOpen = 0,
    /** 可领取 */
    CanGet = 1,
    /** 已领取 */
    Got = 2
}

export interface IFuncMsg {
    index: number,
    state: EFuncState,
    cfg: Cfg_FuncPreview,
    selected?: boolean,
    callback?: (index: number) => void,
    context?: any,
}
