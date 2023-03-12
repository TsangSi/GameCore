/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: zs
 * @Date: 2022-04-07 18:21:34
 * @FilePath: \SanGuo2.4\assets\script\game\manager\EffectMgr.ts
 * @Description:
 *
 */
/* eslint-disable camelcase */
/* eslint-disable max-len */

import { AnimFrameEvent } from '../base/components/AnimFrameEvent';
import { CreateAnimaForSheet } from '../../app/core/res/CreateAnimaForSheet';
import { AssetType } from '../../app/core/res/ResConst';
import { ResMgr } from '../../app/core/res/ResMgr';
import { UtilColor } from '../../app/base/utils/UtilColor';

const { ccclass } = cc._decorator;

interface INodeEffectEx extends cc.Node {
    /** 路径标记 */
    _curLoadPath?: string
}
@ccclass('EffectMgr')
export class EffectMgr {
    /** 地图上及UI展示中动画播放帧率 */
    private readonly ACTION_FRAMERATE: number = 10;

    private _isLoading: boolean = false;

    private static _I: EffectMgr = null;
    public static get I(): EffectMgr {
        if (this._I == null) {
            this._I = new EffectMgr();
        }
        return this._I;
    }

    /**
     *
     * @param path 动画路径
     * @param node 节点
     * @param callback 开始播放的回调
     * @param target 上下文
     * @param wrapMode 播放模式
     * @param finishCallback 播完的回调
     * @param speed 播放帧率
     * @param repeatCount 重复次数
     * @param grayscale 是否灰
     */
    private showAnima(
        path: string,
        node: INodeEffectEx,
        callback: (node: INodeEffectEx) => void,
        target: any,
        wrapMode: cc.WrapMode,
        finishCallback: (node: INodeEffectEx) => void,
        speed: number = 10,
        repeatCount: number = 0,
        grayscale: boolean = false,
    ) {
        this._isLoading = true;
        if (node) {
            node._curLoadPath = path;
        }
        ResMgr.I.loadRemote(path, AssetType.SpriteAtlas_json, (err, loadFrames: cc.SpriteAtlas) => {
            if (err || (node && !node.isValid)) { return; }
            // eslint-disable-next-line dot-notation
            if (node && node._curLoadPath !== path) {
                // 不一样
                // RemoveSpriteAtlas(loadFrames);
                return;
            }
            const animaNode: INodeEffectEx = node || new cc.Node(path);
            animaNode._curLoadPath = path;
            // if (!animaNode.getComponent(UITransform)) {
            //     animaNode.addComponent(UITransform);
            // }
            let ex: CreateAnimaForSheet = animaNode.getComponent(CreateAnimaForSheet);
            if (!ex) {
                ex = animaNode.addComponent(CreateAnimaForSheet);
            }
            let sprite: cc.Sprite = animaNode.getComponent(cc.Sprite);
            if (!sprite) {
                sprite = animaNode.addComponent(cc.Sprite);
                sprite.trim = false;
                sprite.sizeMode = cc.Sprite.SizeMode.RAW;
                // sprite.grayscale = grayscale;
                UtilColor.setGray(sprite.node, grayscale);
            }
            // eslint-disable-next-line dot-notation
            sprite['DA'] = '--';

            ex.addRef(loadFrames);

            let _speed = this.ACTION_FRAMERATE;
            if (speed) {
                _speed = speed;
            }
            const clip: cc.AnimationClip = cc.AnimationClip.createWithSpriteFrames(loadFrames.getSpriteFrames(), _speed);
            clip.wrapMode = wrapMode;
            clip.name = 'default';
            let animation = animaNode.getComponent(cc.Animation);
            if (!animation) {
                animation = animaNode.addComponent(cc.Animation);
            }
            animation.playOnLoad = false;
            // const animState = animation.createState(clip, 'default');
            const animState = animation.addClip(clip);
            animation.play('default');
            if (wrapMode === cc.WrapMode.Loop && repeatCount > 0) {
                animState.repeatCount = repeatCount;
            }

            callback.call(target, animaNode);
            if (!animaNode.parent) {
                // animation.removeState('default');
                animation.removeClip(clip, true);
                animaNode.destroy();
            }
            if (finishCallback) {
                animation.targetOff(this);
                animation.on(cc.Animation.EventType.FINISHED, () => {
                    finishCallback.call(target, animaNode);
                    animation.targetOff(this);
                    finishCallback = null;
                }, target);
            }
            this._isLoading = false;
        });
    }

    /**
     * 展示动画
     * @param path 路径
     * @param onShow 开始播放时候的回调
     * @param wrapMode 播放模式
     * @param onEnd 播完的回调
     * @param grayscale 是否展示灰色的动画
     */
    public showAnim(
        path: string,
        onShow?: (n: cc.Node) => void,
        wrapMode: cc.WrapMode = cc.WrapMode.Loop,
        onEnd: (n: cc.Node) => void = null,
        grayscale: boolean = false,
    ): void {
        this.showAnima(path, null, (node) => {
            if (node._curLoadPath !== path) {
                // 不一样
                return;
            }
            if (onShow) onShow(node);
        }, this, wrapMode, (node) => {
            if (onEnd) onEnd(node);
            if (wrapMode === cc.WrapMode.Normal) {
                node.destroy();
            }
        }, this.ACTION_FRAMERATE, 0, grayscale);
    }

    /** 修改动画的灰 */
    public grayscale(node: cc.Node, grayscale: boolean = false): void {
        if (node) {
            const sp = node.getComponent(cc.Sprite);
            if (sp) {
                // sp.grayscale = grayscale;
                UtilColor.setGray(sp.node, grayscale);
            }
        }
    }

    // eslint-disable-next-line default-param-last
    public showEffect(path: string, parentNode: cc.Node, wrapMode: cc.WrapMode = cc.WrapMode.Loop, onShow?: (n: cc.Node) => void, onEnd?: (n: cc.Node) => void): void {
        this.showAnima(path, null, (node) => {
            if (parentNode && parentNode.isValid && cc.isValid(parentNode)) {
                if (node._curLoadPath !== path) {
                    // 不一样
                    return;
                }
                const old = parentNode.getChildByName(node.name);
                if (old) {
                    old.destroy();
                    parentNode.removeChild(old);
                }
                parentNode.addChild(node);
                // const tr = parentNode.getComponent(UITransform);
                // if (tr) {
                // node.setPosition(parentNode.width * 0.5 - parentNode.anchorX * parentNode.width, parentNode.height * 0.5 - parentNode.anchorY * parentNode.height);
                node.x = parentNode.width * 0.5 - parentNode.anchorX * parentNode.width;
                node.y = parentNode.height * 0.5 - parentNode.anchorY * parentNode.height;
                // }
            }
            if (onShow) onShow(node);
        }, this, wrapMode, (node) => {
            if (onEnd) onEnd(node);
            if (wrapMode === cc.WrapMode.Normal) {
                node.destroy();
            }
        });
    }

    public delEffect(path: string, parentNode: cc.Node): void {
        const node = parentNode?.getChildByName(path);
        if (node && node.isValid) {
            node.destroy();
            parentNode.removeChild(node);
        }
    }

    // eslint-disable-next-line default-param-last
    public showEffectBySelf(path: string, node: cc.Node, wrapMode: cc.WrapMode = cc.WrapMode.Loop, onShow?: (n: cc.Node) => void, onEnd?: (n: cc.Node) => void): void {
        this.showAnima(path, node, (node) => {
            if (onShow) onShow(node);
        }, this, wrapMode, (node) => {
            if (onEnd) onEnd(node);
            if (wrapMode === cc.WrapMode.Normal) {
                node.destroy();
            }
        });
    }

    // public showGIF(path: string, parentNode: cc.Node, onShow?: (n: cc.Node) => void, onEnd?: (n: cc.Node) => void): void {
    //     this.loadGif(path, parentNode, null, onShow, onEnd);
    // }
    // private loadGif(path: string, parentNode: cc.Node, node: cc.Node, onShow?: (n: cc.Node) => void, onEnd?: (n: cc.Node) => void) {
    //     GIFCache.I.do();
    //     const url = `${RES_ENUM.Chat_Emoji}${path}`;
    //     ResMgr.I.loadRemote(url, AssetType.Gif, (err, data) => {
    //         console.log(err, data, '  data');
    //         if (err) {
    //             return;
    //         }
    //         const anyData: any = data;
    //         const gifData: GIF = anyData;
    //         const sAtlas = new cc.SpriteAtlas();
    //         let length = 0;
    //         gifData.spriteFrames.forEach((f, i) => {
    //             sAtlas.spriteFrames[i] = f;
    //             length = i;
    //         });
    //         sAtlas._uuid = url;
    //         // eslint-disable-next-line dot-notation
    //         const info: { header: string } = data['_info'];
    //         sAtlas.name = info.header;
    //         const animaNode: cc.Node = node || new cc.Node(sAtlas.name);
    //         if (!animaNode.getComponent(UITransform)) {
    //             animaNode.addComponent(UITransform);
    //         }

    //         let ex: CreateAnimaForSheet = animaNode.getComponent(CreateAnimaForSheet);
    //         if (!ex) {
    //             ex = animaNode.addComponent(CreateAnimaForSheet);
    //         }
    //         let sprite = animaNode.getComponent(cc.Sprite);
    //         if (!sprite) {
    //             sprite = animaNode.addComponent(cc.Sprite);
    //             sprite.trim = false;
    //             sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    //         }
    //         ex.addRef(sAtlas);
    //         const _speed = gifData.delays[0] ? length / gifData.delays[0] : length;
    //         const clip: cc.AnimationClip = cc.AnimationClip.createWithSpriteFrames(sAtlas.getSpriteFrames(), _speed);
    //         clip.wrapMode = cc.WrapMode.Loop;
    //         clip.name = 'default';
    //         let animation = animaNode.getComponent(AnimationComponent);
    //         if (!animation) {
    //             animation = animaNode.addComponent(AnimationComponent);
    //         }
    //         animation.playOnLoad = false;
    //         const animState = animation.createState(clip, 'default');
    //         animState.play();
    //         if (parentNode && cc.isValid(parentNode)) {
    //             const old = parentNode.getChildByName(animaNode.name);
    //             if (old) { old.destroy(); }
    //             parentNode.addChild(animaNode);
    //         }
    //         if (onShow) onShow(animaNode);

    //         if (onEnd) {
    //             animation.targetOff(this);
    //             animation.on(AnimationComponent.EventType.FINISHED, () => {
    //                 onEnd.call(this, animaNode);
    //                 animation.targetOff(this);
    //                 onEnd = null;
    //             }, this);
    //         }
    //         if (!animaNode.parent) {
    //             animation.removeState('default');
    //             animaNode.destroy();
    //         }
    //     });
    // }
    // public showGIFBySelf(path: string, node: cc.Node, onShow?: (n: cc.Node) => void, onEnd?: (n: cc.Node) => void): void {
    //     this.loadGif(path, undefined, node, onShow, onEnd);
    // }

    /**
     *  播放cocos动画
     * @param path 预制路径
     * @param parent 父节点
     * @param callBack 事件帧回调函数 param 回调参数 nd 挂载动画节点
     * @param playIndex 播放动画的索引(animaation clips中的位置)
     */
    public static PlayCocosAnim(path: string, parent: cc.Node, callBack?: (param: unknown, nd?: cc.Node) => void, playIndex: number = 0, playEndDestroy: boolean = true, finishCallback: Function = null): void {
        ResMgr.I.showPrefabAsync(path, parent).then((_node) => {
            const com = _node.getComponent(AnimFrameEvent);
            if (com) {
                com.callBack = callBack;
            }
            const anim = _node.getComponent(cc.Animation);
            if (anim && anim.getClips()[playIndex]) {
                anim.play(anim.getClips()[playIndex].name);
            }
            anim.once(cc.Animation.EventType.FINISHED, () => {
                if (playEndDestroy) {
                    _node.destroy();
                }
                if (finishCallback) {
                    finishCallback();
                }
                //
            }, _node);
        }).catch((err) => {
            console.log(err);
        });
    }
}
