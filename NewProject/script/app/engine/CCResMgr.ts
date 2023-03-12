/*
 * @Author: zs
 * @Date: 2022-06-13 20:49:21
 * @FilePath: \h3_engine\src\engine\CCResMgr.ts
 * @Description:
 *
 */
export class CCResMgr {
    /** 贴图纹理对象释放的回调 */
    private static _TCallback: (uuid: string) => void;
    private static _TTarget: unknown;
    /** 精灵帧对象释放的回调 */
    private static _SCallback: (uuid: string) => void;
    private static _STarget: unknown;
    /** 资源释放的回调 */
    private static _ACallback: (asset: cc.Asset, force?: boolean) => void;
    private static _ATarget: unknown;
    public static SetRemoveTextureCallback(callback: (uuid: string) => void, target: unknown): void {
        this._TCallback = callback;
        this._TTarget = target;
    }

    public static SetRemoveSpriteFrameCallback(callback: (uuid: string) => void, target: unknown): void {
        this._SCallback = callback;
        this._STarget = target;
    }

    public static RemoveTextureCallback(uuid: string): void {
        if (this._TCallback && this._TTarget) {
            this._TCallback.call(this._TTarget, uuid);
        }
    }
    public static RemoveSpriteFrameCallback(uuid: string): void {
        if (this._SCallback && this._STarget) {
            this._SCallback.call(this._STarget, uuid);
        }
    }

    public static SetDecRefCallback(callback: (asset: cc.Asset, force?: boolean) => void, target: unknown): void {
        this._ACallback = callback;
        this._ATarget = target;
    }

    public static DecRef(asset: cc.Asset, force?: boolean): void {
        if (this._ACallback && this._ATarget) {
            this._ACallback.call(this._ATarget, asset, force);
        }
    }
}
