/* eslint-disable consistent-return */
/* eslint-disable dot-notation */
/* eslint-disable no-lonely-if */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/*
 * @Author: kexd
 * @Date: 2022-04-24 11:51:31
 * @Description: 动画基类
 * @FilePath: \SanGuo\assets\script\game\base\anim\AnimBase.ts
 */
import { ResMgr } from '../../../app/core/res/ResMgr';
import AnimCfg, {
    ACTION_DIRECT, ANIM_TYPE, ACTION_TYPE, IAnimInfo, EPlayState,
} from './AnimCfg';
import { AnimCmp } from './AnimCmp';
import { CreateAnimaForSheet } from '../../../app/core/res/CreateAnimaForSheet';
import { AssetType } from '../../../app/core/res/ResConst';
import { UtilTime } from '../../../app/base/utils/UtilTime';

export default class AnimBase extends cc.Node {
    /** 动画资源ID  */
    private _resourceID: number | string;

    /** 动画资源类型 */
    private _resourceType: ANIM_TYPE;

    /** 动画资源方向 */
    private _resourceDirect: ACTION_DIRECT;

    /** 动画资源动作类型 */
    private _resourceAction: ACTION_TYPE;

    /** 编辑的动作名称（主要是技能动画用） */
    private _editorActionName: string;

    /** 播放模式 */
    private _wrapMode: cc.WrapMode;

    /** 速率(帧/秒)，对应底层里的frameRate（或sample） */
    protected frameRateNum: number = AnimCfg.I.ACTION_FRAMERATE;

    /** 设置倍率 对应底层里的speed */
    private _frameSetRate: number = 1;

    /** 延时加载图片 */
    private _delayLoadTexture: Function = null;

    /** 动画剪辑 */
    protected clipBody: cc.Animation = null;

    /** 上一个动作类型 */
    private _prevAction: ACTION_TYPE = null;

    /** 当前正在加载的对象 */
    protected _loadingPath: string;

    /** 是否禁止且销毁加载 */
    protected _cleanAndRefuse: boolean = false;

    /** AnimCmp */
    private _animCmp: AnimCmp;

    /** 强制播放 */
    public forcePlay: boolean = false;

    /** 对象是否在使用 */
    private _isUsed: boolean = false;
    public set isUsed(_v: boolean) {
        this._isUsed = _v;
        if (this._isUsed === false) {
            this.cleanSP();
        }
    }
    public get isUsed(): boolean {
        return this._isUsed;
    }

    public get resourceID(): number | string {
        return this._resourceID;
    }
    public set resourceID(resID: number | string) {
        if (this._resourceID !== resID) {
            this.release();
        }
        this._resourceID = resID;
    }

    public get resourceType(): ANIM_TYPE {
        return this._resourceType;
    }
    public set resourceType(resType: ANIM_TYPE) {
        if (this._resourceType !== resType) {
            this._resourceType = resType;
        }
    }

    public get resourceDirect(): ACTION_DIRECT {
        return this._resourceDirect;
    }
    public set resourceDirect(resDirect: ACTION_DIRECT) {
        if (this._resourceDirect !== resDirect) {
            this._resourceDirect = resDirect;
        }
    }

    public get resourceAction(): ACTION_TYPE {
        return this._resourceAction;
    }
    public set resourceAction(resAction: ACTION_TYPE) {
        if (resAction && this._resourceAction !== resAction) {
            this._resourceAction = resAction;
        }
    }

    private _cleanPreRes: boolean = false;
    public setCleanPreRes(isClean: boolean) {
        this._cleanPreRes = isClean;
    }

    private _destroyOther: boolean = false;
    public set destroyOther(destroy: boolean) {
        this._destroyOther = destroy;
    }
    public get destroyOther() {
        return this._destroyOther;
    }

    /**
     * 动画对象的构造函数，只处理数据的初始化，也可以把数据初始化在initAnimData里调用实现，或者单独赋值。
     * 这里不会执行PlayAction，需调用才会加载及播放.
     * @param info IAnimInfo
     */
    public constructor(info?: IAnimInfo) {
        super();
        this.isUsed = true;
        this._cleanPreRes = false;
        this._animCmp = this.addComponent(AnimCmp);
        const sp = this.addComponent(cc.Sprite);
        sp.trim = false;
        sp.sizeMode = cc.Sprite.SizeMode.RAW;
        if (!this.clipBody) {
            this.clipBody = this.addComponent(cc.Animation);
        }
        // eslint-disable-next-line dot-notation
        sp['DA'] = '--';
        this.clipBody.playOnLoad = false;
        this.addComponent(CreateAnimaForSheet);

        // 攻击一次后返回待机
        // eslint-disable-next-line dot-notation
        this.clipBody['attackFrameEvent'] = () => {
            // console.log('----------------+ 攻击一次后返回待机 +--------------------');
            // if (this._prevAction == null || this._prevAction === ACTION_TYPE.RUN || this._prevAction === ACTION_TYPE.ATTACK) {
            this._prevAction = ACTION_TYPE.STAND;
            // }
            // if (this._prevAction) {
            this.playAction(this._prevAction);
            // }
        };

        if (info) {
            this.initAnimData(info);
        }
    }

    /**
     * 减少在构造函数里的参数传递后，初始化主要在这里实现，也可以单独给其他变量赋值。
     * resAction 和 resDir 不要在PlayAction前赋值，否则会有可能被return掉
     */
    public initAnimData(info: IAnimInfo) {
        if (info.resId) this._resourceID = info.resId;
        if (info.resType) this._resourceType = info.resType;
        if (info.isFight) {
            this.frameRateNum = AnimCfg.I.ACTION_FRAMERATE_OTHER;
        } else {
            this.frameRateNum = AnimCfg.I.ACTION_FRAMERATE;
        }
    }

    /**
     * @param resAction 动作,纯展示可不填 ACTION_TYPE
     * @param resDirect 方向,纯展示可不填 ACTION_DIRECT
     * @param wrapMode 播放模式 WrapMode
     * @param endCB 播放完的回调
     * @param context 上下文
     * @param starCB 开始播放的回调
     */
    public playAction(
        resAction: ACTION_TYPE,
        resDirect: ACTION_DIRECT = null,
        wrapMode: number = cc.WrapMode.Loop,
        endCB: () => void = null,
        context: any = null,
        starCB: () => void = null,
        editorActionName: string = null,
    ): EPlayState {
        if (this.isValid === false) return;

        if (!this._resourceID) {
            console.warn('resourceID不能为空');
            return EPlayState.ERR_ResId;
        }

        if (!this._resourceType) {
            console.warn('resourceType不能为空');
            return EPlayState.ERR_ResId;
        }

        this.cleanSP();

        if (!this.clipBody) {
            this.clipBody = this.addComponent(cc.Animation);
        }

        // 坐骑只有s和r，没有a
        if (resAction === ACTION_TYPE.ATTACK
            && (this._resourceType === ANIM_TYPE.HORSE || this._resourceType === ANIM_TYPE.HORSE_HEAD)) {
            resAction = ACTION_TYPE.STAND;
        }
        // 羽翼只有s，没有a和r
        if (this._resourceType === ANIM_TYPE.WING && (resAction === ACTION_TYPE.ATTACK || resAction === ACTION_TYPE.RUN)) {
            resAction = ACTION_TYPE.STAND;
        }

        // 攻击等动作就只播放一次，就返回待机。这个看下是否要添加添加
        if (resAction === ACTION_TYPE.ATTACK
            && this._resourceType !== ANIM_TYPE.HORSE
            && this._resourceType !== ANIM_TYPE.HORSE_HEAD) {
            wrapMode = cc.WrapMode.Normal;
        } else if (!this.forcePlay) {
            if (this._resourceAction === resAction && this._resourceDirect === resDirect) {
                // console.log('正在播放了，return', this._resourceDirect, this._resourceAction);
                return EPlayState.EQU_ActionAndDir;
            }
            if (resAction == null && this._resourceDirect === resDirect) {
                // console.log('正在播放了，return', this._resourceDirect, this._resourceAction);
                return EPlayState.EQU_Action;
            }
            if (resDirect == null && this._resourceAction === resAction) {
                // console.log('正在播放了，return', this._resourceDirect, this._resourceAction);
                return EPlayState.EQU_Dir;
            }
        }

        if (!resAction) {
            if (!this._resourceAction) {
                console.warn('resAction和this._resourceAction参数不能全为空');
                return EPlayState.ERR_ResAction;
            }
            resAction = this._resourceAction;
        }

        if (resDirect == null) {
            if (this._resourceDirect == null) {
                console.warn('resDirect 和 this._resourceDirect 参数不能全为空');
                return EPlayState.ERR_ResDir;
            }
            resDirect = this._resourceDirect;
        }

        if (resAction != null) {
            this._prevAction = this._resourceAction;
            this._resourceAction = resAction;
        }

        if (resDirect != null) {
            this._resourceDirect = resDirect;
        }

        this._editorActionName = editorActionName;

        // 动画左右翻转
        if (this._resourceDirect > ACTION_DIRECT.DOWN) {
            if (this.scaleX > 0) {
                const scaleX = this.scaleX;
                this.scaleX = scaleX * -1;
            }
        } else if (this.scaleX < 0) {
            const scaleX = this.scaleX;
            this.scaleX = scaleX * -1;
        }

        // 设置了不展示动画就不去加载了
        if (this._cleanAndRefuse) {
            if (this.clipBody && this.clipBody.isValid) this.clipBody.stop();
            return EPlayState.Refuse;
        }

        const currPath: string = AnimCfg.I.getActionResPath(this._resourceID, this._resourceType, this.realDirct, this._resourceAction);

        // 已经在加载中
        if (this._loadingPath === currPath) {
            console.warn('当前资源正在加载中，不需重复加载');
            return EPlayState.Loading;
        }
        this._loadingPath = currPath;

        if (this._delayLoadTexture) {
            this._animCmp.unschedule(this._delayLoadTexture);
            this._delayLoadTexture = null;
        }

        this._delayLoadTexture = () => {
            // 延后一帧再去判断是否直接播放还是加载资源;
            // console.log('======= 延后一帧再去判断是否直接播放还是加载资源 =========', actName, currPath);
            if (this.isValid === false) return EPlayState.Isvalid;
            if (this._cleanAndRefuse) {
                if (this.clipBody && this.clipBody.isValid) this.clipBody.stop();
            } else {
                this.judgePlay(wrapMode, endCB, context, starCB, editorActionName);
            }
        };

        this._animCmp.scheduleOnce(this._delayLoadTexture, 0);

        return EPlayState.Normal;
    }

    /** 主要用于界面disanble后，动画停止播放，重新enable后，需要调用resume接口来播放（试了下调用resume好像不行，改为用play吧） */
    public resume(): void {
        if (this.clipBody) {
            const clip = this.getAnimaState();
            if (clip) {
                this.clipBody.play(clip.name);
            }
        }
    }

    /** 重新播放动画 */
    public rePlay(): void {
        if (this.clipBody) {
            const clip = this.getAnimaState();
            if (clip) {
                // 看了下底层的实现，当前动画在播放中再调用play会不做任何事情，故这里先stop再play（不需resume）
                this.clipBody.stop();
                this.clipBody.play(clip.name);
            }
        }
    }

    /** 暂定播放动画 */
    public pause(): void {
        if (this.clipBody) {
            const clip = this.getAnimaState();
            if (clip) {
                this.clipBody.pause(clip.name);
            }
        }
    }

    /**
     * 是否已经加载过了
     */
    public isLoaded(): boolean {
        return this.clipBody && !!this.getAnimaState();
    }

    public getCurAnimState(): cc.AnimationState {
        const actName = AnimCfg.I.getActionName(this._resourceDirect, this._resourceAction, this._editorActionName);
        if (this.clipBody) {
            const aState = this.clipBody['_nameToState'];
            for (const i in aState) {
                if (aState[i].name === actName) {
                    return aState[i] as cc.AnimationState;
                }
            }
        }
        return null;
    }

    public getAnimaState(): cc.AnimationState {
        const actName = AnimCfg.I.getActionName(this._resourceDirect, this._resourceAction, this._editorActionName);
        let animaState: cc.AnimationState = null;
        if (this.clipBody) {
            const aState: { [name: string]: cc.AnimationState; } = this.clipBody['_nameToState'];
            animaState = aState[actName];
        }
        // 当前动画是否已经加载过了
        let clickValid = animaState && animaState['curves'] && animaState['curves'][0] && animaState['curves'][0]['values'] && animaState['curves'][0]['values'][0];
        if (clickValid) {
            clickValid = false;
            const _sp = animaState['curves'][0]['values'][0] as cc.SpriteFrame;
            const _texture = _sp.getTexture();
            if (_texture && _texture.isValid && _texture.refCount > 0) {
                let path: string = _texture['_uuid'];
                let index = path.indexOf('.png');
                if (index >= 0) {
                    path = path.slice(0, index);
                } else {
                    index = path.indexOf('.astc');
                    if (index >= 0) {
                        path = path.slice(0, index);
                        path = path.replace('action_astc', 'action');
                    }
                }
                index = path.lastIndexOf('action/');
                if (index >= 0) {
                    path = path.slice(index);
                }
                const currPath: string = AnimCfg.I.getActionResPath(this._resourceID, this._resourceType, this.realDirct, this._resourceAction);
                clickValid = path === currPath;
            }
        }
        if (clickValid) {
            return animaState;
        }
        return null;
    }

    /** 原来对于已缓存的动画就直接播放，否则就一帧后再去加载。这里改为都是一帧后再判断是否直接播放还是加载 */
    private judgePlay(
        wrapMode: number = cc.WrapMode.Loop,
        endCB: () => void = null,
        context: any = null,
        starCB: () => void = null,
        editorActionName: string = null,
    ) {
        const _animaState = this.getAnimaState();
        if (_animaState) {
            // console.log('当前资源已存在了，直接播放', AnimCfg.I.getActionResPath(this._resourceID, this._resourceType, this.realDirct, this._resourceAction));
            _animaState.wrapMode = wrapMode;
            const animaState: cc.AnimationState = this.clipBody.getAnimationState(_animaState.name);
            if (animaState) {
                animaState.speed = this._frameSetRate;
            } else {
                console.log(' ----------------- animaState=null ----------------');
            }
            this.clipBody.play(_animaState.name);
            this._addClipBodyEvent(endCB, context, starCB, animaState.clip);
        } else {
            const currPath: string = AnimCfg.I.getActionResPath(this._resourceID, this._resourceType, this.realDirct, this._resourceAction);
            ResMgr.I.loadRemote(currPath, AssetType.SpriteAtlas_mergeJson, (err, loadFrames: cc.SpriteAtlas, fData: any) => {
                this._loadCallback(err, loadFrames, fData);
            }, { customData: [this._resourceDirect, this._resourceAction, wrapMode, endCB, context, starCB, currPath, editorActionName] });
        }
    }

    private _loadCallback(err, loadFrames: cc.SpriteAtlas, fData: any) {
        if (err) {
            // console.log('加载错误-------------------', loadFrames);
            // 这里不需要了，资源管理器那边做了
            // if (loadFrames) {
            //     Removecc.SpriteAtlas(loadFrames);
            //     loadFrames = null;
            // }
            return;
        }
        if (!this.isValid) {
            // console.warn('当前节点已被释放');
            // 这里不需要了，资源管理器那边做了
            // if (loadFrames) {
            //     Removecc.SpriteAtlas(loadFrames);
            //     loadFrames = null;
            // }
            return;
        }
        if (loadFrames) {
            // 下面这行不要加上，会影响到坐骑头和坐骑身同步显示
            // this.active = true;

            const curPath = AnimCfg.I.getActionResPath(this._resourceID, this._resourceType, this.realDirct, this._resourceAction);

            // console.log('_loadCallback----', curPath, fData[6]);
            // 加载完成的动画对象是否是要播放的动画1
            if (curPath === fData[6] && this.isValid) {
                const clipName = AnimCfg.I.getActionName(fData[0], fData[1]);
                const c: cc.AnimationClip = this._loadClip(loadFrames, clipName, fData[1], fData[2], fData[7]);
                this._addClipBodyEvent(fData[3], fData[4], fData[5], c);
                if (this._destroyOther
                    || (this._cleanPreRes && this._prevAction && this._prevAction === ACTION_TYPE.UI_SHOW)) {
                    this.getComponent(CreateAnimaForSheet).decRef();
                    this._destroyOther = false;

                    if (!this._animCmp.enabledInHierarchy) {
                        this.getComponent(cc.Sprite).spriteFrame = null;
                    }
                }
                this.getComponent(CreateAnimaForSheet).addRef(loadFrames);
            } else {
                // console.log('加载完的资源对象和请求的对象对不上', fData[6], curPath);
                // 这里不需要了，资源管理器那边做了
                // if (loadFrames) {
                //     Removecc.SpriteAtlas(loadFrames);
                //     loadFrames = null;
                // }
            }
        }
    }

    // 动画播放事件
    private _addClipBodyEvent(endCB: () => void, context: any, starCB: () => void, clip: cc.AnimationClip): void {
        if (starCB) {
            // 开始播放
            starCB.call(context, clip);
        }

        if (endCB) {
            // 播放完成
            this._animCmp.scheduleOnce(() => {
                if (endCB) {
                    endCB.call(context);
                }
            }, clip.duration / this._frameSetRate);
        }
    }

    public getActionFrameLength(actioname: string): number {
        const currPath: string = AnimCfg.I.getActionResPath(this._resourceID, this._resourceType, this.realDirct, this._resourceAction);
        const skillFrames = ResMgr.I.getEditorSkillFrame(currPath, actioname);
        if (!skillFrames) {
            console.warn('拿不到编辑的序列帧数据', currPath);
            return 0;
        }
        return skillFrames.length;
    }

    private _loadClip(
        loadFrames: cc.SpriteAtlas,
        clipName: string,
        clipAction: ACTION_TYPE,
        wrapMode: number = cc.WrapMode.Loop,
        editorActionName: string = null,
    ) {
        let clip: cc.AnimationClip = null;
        if (loadFrames && loadFrames.getSpriteFrames) {
            const frames = loadFrames.getSpriteFrames();
            if (!editorActionName) {
                clip = this.createClip(frames, clipName, clipAction, wrapMode, true);
                this.clipBody.play(clipName);
            } else {
                const currPath: string = AnimCfg.I.getActionResPath(this._resourceID, this._resourceType, this.realDirct, this._resourceAction);
                let newFrames = [];
                let editorName: string = '';
                const skillFrames = ResMgr.I.getEditorSkillFrame(currPath, this._editorActionName);
                if (skillFrames && skillFrames.length > 0) {
                    for (let i = 0; i < skillFrames.length; i++) {
                        if (frames[skillFrames[i]]) {
                            newFrames.push(frames[skillFrames[i]]);
                        } else {
                            console.warn('编辑的技能帧数据不在范围内', skillFrames[i]);
                        }
                    }
                    editorName = AnimCfg.I.getActionName(this._resourceDirect, this._resourceAction, this._editorActionName);
                } else {
                    if (clipAction === ACTION_TYPE.ATTACK) {
                        const end = frames.length > 2 ? frames.length - 2 : 1;
                        newFrames = frames.slice(0, end);
                    } else {
                        newFrames = frames;
                    }
                    editorName = AnimCfg.I.getActionName(this._resourceDirect, this._resourceAction);

                    console.log('没有该技能的编辑数据，请查看下技能编辑', currPath);
                }

                clip = this.createClip(newFrames, editorName, clipAction, wrapMode);
                this.clipBody.play(editorName);
            }
        }
        return clip;
    }

    private createClip(
        sframes: cc.SpriteFrame[],
        clipName: string,
        clipAction: ACTION_TYPE,
        wrapMode: number = cc.WrapMode.Loop,
        needEvent: boolean = false,
    ): cc.AnimationClip {
        const clip: cc.AnimationClip = cc.AnimationClip.createWithSpriteFrames(sframes, this.frameRateNum);
        clip.wrapMode = wrapMode;
        clip.name = clipName;
        clip.speed = this._frameSetRate;

        if (needEvent) {
            // 动画剪辑添加事件，播放攻击帧后进入attackFrameEvent（坐骑等不需）
            if (this._resourceType !== ANIM_TYPE.HORSE
                && this._resourceType !== ANIM_TYPE.HORSE_HEAD
                && clipAction === ACTION_TYPE.ATTACK
                && this._resourceType !== ANIM_TYPE.SKILL) {
                if (clip.events.length === 0) {
                    let atkPoint = clip.duration + (AnimCfg.I.DEATH_FRAME - 2) / this.frameRateNum;
                    if (this._resourceDirect < 0) {
                        atkPoint = clip.duration;
                    }
                    clip.events.push({
                        frame: atkPoint, // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
                        func: 'attackFrameEvent', // 回调函数名称
                        params: [`${clip.duration}`], // 回调参数
                    });
                }
            }
        }
        // addClip
        const animaState: cc.AnimationState = this.clipBody.addClip(clip, clipName);
        this.clipBody.defaultClip = animaState.clip;
        if (animaState) {
            animaState.speed = this._frameSetRate;
        }
        return clip;
    }

    /**
     * 改变动画播放倍率
     * @param rate
     */
    public changeSpeed(rate: number): void {
        // if (rate > 1) {
        //     console.log('改变动画播放倍率----------------', rate);
        // }
        if (rate > 0) {
            this._frameSetRate = rate;
        }
    }

    /**
     * 获取资源的下标：017是背面资源用1；23456是正面，资源用3
     */
    protected get realDirct(): ACTION_DIRECT {
        if (this._resourceDirect >= ACTION_DIRECT.RIGHT && this._resourceDirect <= ACTION_DIRECT.LEFT) {
            return ACTION_DIRECT.RIGHT_DOWN;
        } else if (this._resourceDirect >= 0) {
            return ACTION_DIRECT.RIGHT_UP;
        }
        return this._resourceDirect;
    }

    private _alpha: number = 255;
    public get alpha(): number {
        return this._alpha;
    }
    public set alpha(value: number) {
        if (this._alpha !== value) {
            this._alpha = value;
            this.opacity = Math.floor(255 * (value / 1));
        }
    }

    /** 调试用的接口：查看动画中心位置点 */
    public showCenterPoint(color: cc.Color) {
        const n: cc.Node = new cc.Node();
        const g: cc.Graphics = n.addComponent(cc.Graphics);
        g.circle(0, 0, 10);
        g.fillColor = color;
        g.fill();
        this.addChild(n);
        n.setPosition(0, 0);
    }

    /** isDestory为false的时候只是清了动画剪辑数据，真正的纹理需要destroy才会被释放（触发 */
    public release(isDestory: boolean = false): void {
        // console.log('AnimBase.release------------------------');
        if (this._delayLoadTexture) {
            this._animCmp.unschedule(this._delayLoadTexture);
            this._delayLoadTexture = null;
        }

        // if (this.clipBody && this.clipBody.isValid) {
        //     const aState = this.clipBody['_nameToState'];
        //     for (const i in aState) {
        //         this.clipBody.removeState(i);
        //     }

        //     this.clipBody.removeAll(this);
        // }
        if (this.clipBody) {
            const clips: cc.AnimationClip[] = this.clipBody.getClips();
            if (clips) {
                let num = clips.length;
                while (num > 0) {
                    const clip = clips[0];
                    this.clipBody.removeClip(clip, true);
                    clip.destroy();
                    num--;
                }
                if (this.clipBody.currentClip) {
                    if (this.clipBody.currentClip.isValid) {
                        this.clipBody.removeClip(this.clipBody.currentClip, true);
                        // console.warn('================release===currentClip=========');
                    }
                    this.clipBody.currentClip = null;
                }
            }
        }

        this.cleanSP();

        if (isDestory && this.isValid) {
            this.destroy();
        }
    }

    public destroy(): boolean {
        this.release();
        return super.destroy();
    }

    public cleanSP(): void {
        this._loadingPath = null;
    }
}
