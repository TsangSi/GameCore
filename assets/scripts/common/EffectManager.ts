/* eslint-disable camelcase */
/* eslint-disable max-len */
import {
 _decorator, __private, Animation, AnimationClip, Sprite, SpriteAtlas, isValid, Node, UITransform,
} from 'cc';
import { AssetType } from '../global/GConst';
import { CreateAnimaForSheet } from './CreateAnimaForSheet';
import { ResManager } from './ResManager';

const { ccclass } = _decorator;

// class loadInfo {
//     path: string;
//     type: __private._cocos_core_asset_manager_shared__AssetType;
//     callback: (object: __private._cocos_core_asset_manager_shared__AssetType, customData: any) => void;
//     fail_callback: (path: string, customData: any) => void;
//     target: Record<string, unknown>;
//     customData: any;
//     priority = 0;
// }

type WrapMode = __private._cocos_core_animation_types__WrapMode;

@ccclass('EffectManager')
export class EffectManager {
    /** 地图上及UI展示中动画播放帧率 */
    public readonly ACTION_FRAMERATE: number = 10;
    /** 战斗中动画播放帧率 */
    public readonly ACTION_FRAMERATE_OTHER: number = 12;
    /** 动画播放加速倍率 */
    public SPEED = 0.75;
    /** 受击倒数第2帧 */
    public readonly SUFFER_ATTACK_FRAME: number = -2;
    /** 死亡倒数第1帧 */
    public readonly DEATH_FRAME: number = -1;

    private static _I: EffectManager = null;
    public static get I(): EffectManager {
        if (this._I == null) {
            this._I = new EffectManager();
        }
        return this._I;
    }

    private showAnima(path: string, callback: (node: Node) => void, target: any, warpMode: WrapMode, finishCallback: (node: Node) => void, speed = 10, repeatCount = 0) {
        ResManager.I.loadRemote(path, AssetType.SpriteAtlas, (err, loadFrames: SpriteAtlas) => {
            if (err) { return; }
            const animaNode: Node = new Node();
            animaNode.addComponent(UITransform);
            const ex = animaNode.addComponent(CreateAnimaForSheet);
            ex.addRef(loadFrames);
            const s = animaNode.addComponent(Sprite);
            s.trim = false;
            s.sizeMode = Sprite.SizeMode.RAW;
            // s.isAnima = true;
            // s.DA = '--';

            let _speed = this.ACTION_FRAMERATE;
            if (speed) {
                _speed = speed;
            }
            const clip: AnimationClip = AnimationClip.createWithSpriteFrames(loadFrames.getSpriteFrames(), _speed);
            clip.wrapMode = warpMode;
            clip.name = 'default';
            animaNode.name = loadFrames.name;
            const a = animaNode.addComponent(Animation);
            a.playOnLoad = false;
            const animState = a.createState(clip, 'default');
            animState.play();
            // a.play('default');
            // let animState = a.getState("default");
            if (warpMode === AnimationClip.WrapMode.Loop && repeatCount > 0) {
                animState.repeatCount = repeatCount;
            }

            // let _scale = this.getAinScale(path);
            // if (_scale) {
            //     let _scaleX = animaNode.scaleX, _scaleY = animaNode.scaleY;
            //     _scaleX = (_scaleX < 0 ? (0 - _scale) : _scale);
            //     _scaleY = (_scaleY < 0 ? (0 - _scale) : _scale);
            //     animaNode.scaleX = _scaleX;
            //     animaNode.scaleY = _scaleY;
            // }

            callback.call(target, animaNode);
            if (!animaNode.parent) {
                a.removeState('default');
                ex.decRef();
                animaNode.destroy();
            }
            if (finishCallback) {
                a.on(Animation.EventType.FINISHED, () => {
                    finishCallback.call(target, animaNode);
                    a.off(Animation.EventType.FINISHED);
                    finishCallback = null;
                }, target);
            }
        }, this);
    }

    public showEffect(path: string, parentNode: Node, wrapMode: WrapMode, onShow?: (n: Node) => void, onEnd?: (n: Node) => void): void {
        this.showAnima(path, (node) => {
            if (parentNode && isValid(parentNode)) {
                const old = parentNode.getChildByName(node.name);
                if (old) { old.destroy(); }
                parentNode.addChild(node);
            }
            if (onShow) onShow(node);
        }, this, wrapMode, (node) => {
            if (onEnd) onEnd(node);
            if (wrapMode === AnimationClip.WrapMode.Normal) {
                node.destroy();
            }
        });
    }

    // onLoadResResult(node: Node, target: Node, wrap: number) {
    //     if (target && isValid(target)) {
    //         let old = target.getChildByName()
    //     }
    //     console.log('1111111111');
    // }
}
