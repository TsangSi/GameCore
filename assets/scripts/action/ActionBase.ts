/* eslint-disable max-len */
import {
 Animation, AnimationClip, AnimationState, Node, Sprite, SpriteAtlas, UIOpacity, UITransform,
} from 'cc';
import { CreateAnimaForSheet } from '../common/CreateAnimaForSheet';
import { ResManager } from '../common/ResManager';
import { AssetType, WarpMode } from '../global/GConst';
import ActionConfig, { ACTION_DIRECT, ACTION_RES_TYPE, ACTION_STATUS_TYPE } from './ActionConfig';

export default class ActionBase extends Node {
    /**  */
    public isUsed = true;
    private state;
    public resID: number | string = undefined;
    public resType: ACTION_RES_TYPE = ACTION_RES_TYPE.MapRole;
    public resDirect = -1;
    public resAction: ACTION_STATUS_TYPE;
    private anim: Animation = undefined;
    // public constructor() {
    //     super();
    // }

    private UIOpacity: UIOpacity = undefined;
    private _opacity = 255;
    /** 透明度 */
    public get opacity(): number {
        return this._opacity;
    }

    public set opacity(o: number) {
        if (!this.UIOpacity) {
            this.UIOpacity = this.addComponent(UIOpacity);
        }
        this._opacity = o;
        this.UIOpacity.opacity = o;
    }

    private startCallback: () => void = undefined;
    public setStartCallback(callback: () => void): void {
        this.startCallback = callback;
    }

    private finishCallback: () => void = undefined;
    public setFinishCallback(callback: () => void): void {
        this.finishCallback = callback;
    }

    public updateShow(resID: number | string, resType: ACTION_RES_TYPE, resDirect = -1, resAction = ACTION_STATUS_TYPE.Stand, wardMode: WarpMode = AnimationClip.WrapMode.Loop): void {
        this.resID = resID;
        this.resType = resType;
        this.addComponent(UITransform);
        const sp = this.addComponent(Sprite);
        sp.trim = false;
        sp.sizeMode = Sprite.SizeMode.RAW;
        // this.addComponent(UIOpacity);

        this.anim = this.addComponent(Animation);
        this.anim.playOnLoad = false;
        this.playAction(resAction, resDirect, wardMode);
    }

    public updateShowAndPlay(resID: number | string, resType: ACTION_RES_TYPE, resDirect = -1, resAction = ACTION_STATUS_TYPE.Stand, wardMode: WarpMode = AnimationClip.WrapMode.Loop): void {
        this.updateShow(resID, resType, resDirect, resAction, wardMode);
        this.play();
    }

    // /** 变身前的resid */
    // private transformBeforResID = undefined;
    // /** 变身显示 */
    // public transformShow(resID: number | string, resType: string, resDirect = -1, resAction = ACTION_STATUS_TYPE.Stand, wardMode: WarpMode = AnimationClip.WrapMode.Loop): void {
    //     this.transformBeforResID = this.resID;
    //     this.updateShowAndPlay(resID, resType, resDirect, resAction, wardMode);
    // }

//     public transformRemove(resID: number | string, resType: string, resDirect = -1, resAction = ACTION_STATUS_TYPE.Stand, wardMode: WarpMode = AnimationClip.WrapMode.Loop): void {
// //
//     }

    public play(): void {
        this.anim.play();
    }

    public playAction(resAction: ACTION_STATUS_TYPE, dir = undefined, wardMode: WarpMode = AnimationClip.WrapMode.Loop): void {
        // if (this.resType === ACTION_RES_TYPE.HORSE_HEAD) {
        //     if (dir < 0 || dir >= ACTION_DIRECT.RIGHT && dir <= ACTION_DIRECT.LEFT) {
        //         this.active = true;
        //     } else {
        //         this.active = false;
        //     }
        // }
        if (this.resAction === resAction && this.resDirect === dir) {
            return;
        }
        // console.log('resAction, dir,this.resAction,this.resDirect=', this.parent?.parent?.name, resAction, dir, this.resAction, this.resDirect);
        if (resAction === null && this.resDirect === dir) {
            return;
        }
        if (dir === null && this.resAction === resAction) {
            return;
        }
        // if (this.resType === ACTION_RES_TYPE.HORSE) {
        //     console.log('resAction, dir=', resAction, dir);
        // }
        // const clips = this.anim.clips;
        // let clip: AnimationClip;
        if (resAction != null) {
            this.resAction = resAction;
        }
        if (dir != null) {
            this.resDirect = dir;
        }
        // console.log('this.resAction,this.resDirect=', this.parent?.parent?.name, this.resAction, this.resDirect);
        if (this.resDirect === ACTION_DIRECT.LEFT_DOWN || this.resDirect === ACTION_DIRECT.LEFT || this.resDirect === ACTION_DIRECT.LEFT_UP) {
            this.setScale(-1, this.scale.y, this.scale.z);
        } else {
            this.setScale(1, this.scale.y, this.scale.z);
        }

        // for (let i = 0; i < clips.length; i++) {
        //     if (clips[i].name === ActionConfig.I.getActionName(this.resDirect, resAction)) {
        //         clip = clips[i];
        //         break;
        //     }
        // }
        const pathDir = ActionConfig.I.getRealDir(dir);
        const path = ActionConfig.I.getActionResPath(this.resID, this.resType, pathDir, resAction);
        // console.log()
        // console.log('path=', this.parent?.parent?.name, path);
        ResManager.I.loadRemote(path, AssetType.SpriteAtlas, (err, loadFrames: SpriteAtlas, customData: any[]) => {
            if (loadFrames) {
                if (customData[1] !== this.resAction || customData[0] !== this.resDirect) {
                    console.log('已经换了动作、或者换了方向');
                    return;
                }
                if (!this.isValid) { return; }
                // console.log('path=', this.parent?.parent?.name, loadFrames);
                const clipName = ActionConfig.I.makeActionName(customData[0], customData[1]);
                const duration = this.loadClip(loadFrames, clipName, customData[0], customData[1], customData[2]);
                // const clip = AnimationClip.createWithSpriteFrames(loadFrames.getSpriteFrames(), ActionConfig.I.ACTION_FRAMERATE);
                // clip.wrapMode = AnimationClip.WrapMode.Loop;
                // clip.name = clipName;
                // try {
                    // const animaState = this.anim.createState(clip, clipName);
                    // if (this.resAction === customData[1] && this.resDirect === customData[0]) {
                    //     animaState.speed = ActionConfig.I.ACTION_FRAMERATE;
                    //     animaState.play();
                    // }
                // } catch (e: unknown) {
                //     clip = null;
                //     // eslint-disable-next-line dot-notation
                //     console.error(`loadClip 发生错误:${e['stack'] as string}`);
                // }
                let ex = this.getComponent(CreateAnimaForSheet);
                if (!ex) {
                    ex = this.addComponent(CreateAnimaForSheet);
                }
                ex.addRef(loadFrames);
                this.addClipBodyEvent(this.finishCallback, this, this.startCallback, duration);
            }
        }, this, [this.resDirect, this.resAction, wardMode, this.finishCallback, this, this.startCallback]);
    }

    private loadClip(loadFrames: SpriteAtlas, clipName: string, clipDirect: number, clipAction: string, warpMode = AnimationClip.WrapMode.Loop) {
        // let clip: AnimationClip = null;
        let animaState: AnimationState;
        if (loadFrames && loadFrames.getSpriteFrames) {
            try {
                animaState = this.anim.getState(clipName);
                if (!animaState) {
                    const clip = AnimationClip.createWithSpriteFrames(loadFrames.getSpriteFrames(), ActionConfig.I.ACTION_FRAMERATE);
                    clip.wrapMode = warpMode;
                    clip.name = clipName;
                    animaState = this.anim.createState(clip, clipName);
                }
                if (this.resAction === clipAction && this.resDirect === clipDirect) {
                    animaState.speed = ActionConfig.I.ACTION_FRAMERATE;
                    // animaState.play();
                }
                this.anim.play(clipName);
            } catch (e: unknown) {
                // clip = null;
                // eslint-disable-next-line dot-notation
                console.error(`loadClip 发生错误:${e['stack'] as string}`);
            }
        }
        return animaState.duration;
        // return clip;
    }

    // 动画播放事件
    public addClipBodyEvent(callback: () => void, context: any, callbackPlay: () => void, duration: number): void {
        if (callbackPlay) {
            // 开始播放
            callbackPlay();
        }
        if (callback) {
            // 播放完成
            setTimeout(() => {
                if (callback) {
                    callback();
                }
            }, duration * 1000 / ActionConfig.I.ACTION_FRAMERATE);
        }
    }

    public release(): void {
        if (this.anim) {
            // eslint-disable-next-line dot-notation
            for (const name in this.anim['_nameToState']) {
                this.anim.removeState(name);
            }
        }
        this.destroy();
    }

    protected onDestroy(): void {
        if (this.anim) {
            console.log('----------------', this.anim);
        }
    }
}
