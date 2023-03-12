/*
 * @Author: myl
 * @Date: 2022-10-26 10:29:36
 * @Description:
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class BattleRewardExBase extends cc.Component {
    /** 处理扩展内容赋值 */
    protected _data: S2CPrizeReport = null;

    /** 回调处理 */
    protected _callBack: (p?: unknown) => void = null;

    /** 关闭回调 */
    protected _closeCall: () => void = null;

    public setData(data: S2CPrizeReport): void {
        this._data = data;
    }

    public setCallBack(callBack: (p?: unknown) => void): void {
        if (callBack) {
            this._callBack = callBack;
        }
    }

    public setCloseCall(closeCall: () => void): void {
        this._closeCall = closeCall;
    }
}
