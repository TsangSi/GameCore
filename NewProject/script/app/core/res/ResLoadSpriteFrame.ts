/* eslint-disable max-len */
/*
 * @Author: zs
 * @Date: 2023-02-24 12:11:41
 * @Description:
 *
 */
import {
    LoadInfo, CompleteCallback, ITexture2DEx, ISpriteFrameEx,
} from './ResConst';
import { ResLoadBase } from './ResLoadBase';

export class ResLoadSpriteFrame extends ResLoadBase<cc.SpriteFrame> {
    public constructor() {
        super('SpriteFrame');
    }

    protected loadRemote(path: string, callback: CompleteCallback<cc.SpriteFrame>, target: object, loadInfo: LoadInfo, ...args: any[]): void {
        this.resMgr.loadTexture(path, loadInfo, this.loadTextureResult, this, path, callback, target, ...args);
    }

    private loadTextureResult(e: Error, texture: ITexture2DEx, loadInfo: LoadInfo, path: string, callback: CompleteCallback<cc.SpriteFrame>, target: object, ...args: any[]) {
        let spriteFrame: ISpriteFrameEx;
        if (!e) {
            spriteFrame = this.getCache(path);
            if (!spriteFrame) {
                spriteFrame = new cc.SpriteFrame();
                spriteFrame.setTexture(texture);
                texture.setWrapMode(cc.Texture2D.WrapMode.CLAMP_TO_EDGE, cc.Texture2D.WrapMode.CLAMP_TO_EDGE);
                spriteFrame._uuid = texture._uuid;
                this.addCache(path, spriteFrame);
            } else {
                this.resMgr.decRef(texture);
            }
        }
        this.doCallback(e, spriteFrame, callback, target, loadInfo, ...args);
    }
}
