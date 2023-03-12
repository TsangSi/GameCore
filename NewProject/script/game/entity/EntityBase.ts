/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-sparse-arrays */
/* eslint-disable dot-notation */
/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
/*
 * @Author: hrd
 * @Date: 2022-05-12 16:59:40
 * @FilePath: \SanGuo2.4\assets\script\game\entity\EntityBase.ts
 * @Description:
 *
 */
import {
    ACTION_DIRECT, ANIM_TYPE, ACTION_TYPE, EPlayState,
} from '../base/anim/AnimCfg';

import AnimCom from '../base/anim/AnimCom';
import { UtilCocos } from '../../app/base/utils/UtilCocos';
import { EntityAnimName, IEntitySkin } from './EntityConst';
import UtilTitle from '../base/utils/UtilTitle';
import MapCfg from '../map/MapCfg';
import { Config } from '../base/config/Config';
import { ConfigConst } from '../base/config/ConfigConst';
import { ConfigGradeSkinIndexer } from '../base/config/indexer/ConfigGradeSkinIndexer';
import { ConfigRoleSkinIndexer } from '../base/config/indexer/ConfigRoleSkinIndexer';
import ModelMgr from '../manager/ModelMgr';
import { EntityAnimState } from './ai/EntityAnimState';

export default class EntityBase extends cc.Node {
    /** 动画容器 */
    private roleNode: cc.Node = new cc.Node('roleNode');
    /** 身体 */
    private _body: AnimCom = null;
    /** 武器 */
    private _weapon: AnimCom = null;
    /** 坐骑 */
    private _horse: AnimCom = null;
    /** 坐骑头 */
    private _horseHead: AnimCom = null;
    /** 翅膀 */
    private _wing: AnimCom = null;
    /** 称号 */
    private _title: cc.Node = null;
    /** 影子 */
    private _ShadowNode: cc.Node = null;

    /** 动作状态 */
    public mAnimState: EntityAnimState = null;

    /** 动画容器 */
    private _animaDict: { [key: string]: AnimCom } = cc.js.createMap(true);

    /** 保存记录各部位的resId，在异步加载完成后做校验等工作 */
    private _bodyResId: number | string = 0;
    private _weaponResId: number = 0;
    private _horseResId: number = 0;
    private _wingResId: number = 0;

    /** 角色方向 */
    private _actorDir: number = ACTION_DIRECT.RIGHT_DOWN;
    /** 当前动画类型 */
    private _actionType: ACTION_TYPE = null;
    /** 资源类型 */
    private _resType: ANIM_TYPE = null;
    /** 是否是战斗里（其动画的播放速率会不同） */
    private _isFightAnim: boolean = false;
    /** 透明度 */
    private _alpha: number = 1;

    /** 坐骑y偏移（进阶皮肤表坐骑部分）影响模型的整体y偏移 */
    private _entityOffX: number = 0;
    private _entityOffY: number = 0;
    /** 人物高度（时装皮肤表）的y偏移影响模型头顶的组件y偏移，如称号 */
    private _roleSkinOffX: number = 0;
    private _roleSkinOffY: number = 0;
    /** 不同方向的动画显示顺序 */
    private readonly ANIM_ZINDEX_DIR = [
        // 上 0
        [EntityAnimName.HORSE_HEAD, EntityAnimName.HORSE, EntityAnimName.BODY, EntityAnimName.WEAPON, EntityAnimName.WING],
        // 右上 1
        [EntityAnimName.HORSE_HEAD, EntityAnimName.HORSE, EntityAnimName.BODY, EntityAnimName.WEAPON, EntityAnimName.WING],
        // 右 2
        [EntityAnimName.WING, EntityAnimName.HORSE, EntityAnimName.BODY, EntityAnimName.WEAPON, EntityAnimName.HORSE_HEAD],
        // 右下 3
        [EntityAnimName.WING, EntityAnimName.HORSE, EntityAnimName.BODY, EntityAnimName.WEAPON, EntityAnimName.HORSE_HEAD],
        // 下 4
        [EntityAnimName.WING, EntityAnimName.HORSE, EntityAnimName.BODY, EntityAnimName.WEAPON, EntityAnimName.HORSE_HEAD],
        // 左下 5
        [EntityAnimName.WING, EntityAnimName.HORSE, EntityAnimName.BODY, EntityAnimName.WEAPON, EntityAnimName.HORSE_HEAD],
        // 左 6
        [EntityAnimName.WING, EntityAnimName.HORSE, EntityAnimName.BODY, EntityAnimName.WEAPON, EntityAnimName.HORSE_HEAD],
        // 左上 7
        [EntityAnimName.HORSE_HEAD, EntityAnimName.HORSE, EntityAnimName.BODY, EntityAnimName.WEAPON, EntityAnimName.WING],
    ];

    private readonly ANIM_ZINDEX_UI = [EntityAnimName.WING, EntityAnimName.HORSE, EntityAnimName.WEAPON, EntityAnimName.BODY, , EntityAnimName.HORSE_HEAD];

    public constructor(
        resId: number | string,
        resType: ANIM_TYPE,
        dir: ACTION_DIRECT = ACTION_DIRECT.DOWN,
        actType: ACTION_TYPE = ACTION_TYPE.STAND,
        wrapMode: number = cc.WrapMode.Loop,
        isFight: boolean = false,
    ) {
        super();

        this.name = 'EntityBase';
        this.addChild(this.roleNode);

        this._bodyResId = resId;
        if (dir < 0) {
            this._actionType = ACTION_TYPE.UI;
        } else {
            this._actionType = actType;
        }
        this.setDir(dir);
        this._isFightAnim = isFight;
        this._resType = resType;

        this.setBodyAnim(resId, resType, actType, wrapMode);
        this.initAnimState();
    }

    public initAnimState(): void {
        if (this.mAnimState) return;
        this.mAnimState = new EntityAnimState();
        this.mAnimState.init(this);
    }

    /** 设置实体对象的坐骑、武器、光翼等 */
    public initAnimData(skinInfo: IEntitySkin, hideTitle: boolean = false): void {
        if (!skinInfo) return;
        this.setHorseAnim(skinInfo.horseResID);
        this.setWeaponAnim(skinInfo.weaponResID);
        this.setWingAnim(skinInfo.wingResID);
        if (!hideTitle) {
            this.setTitleAnim(skinInfo.titleResID, skinInfo.titleScale);
        }
        this.refreshLayer();
    }

    /**
     * 换装接口
     */
    public changeAnimData(skinInfo: IEntitySkin, resType: ANIM_TYPE, actType: ACTION_TYPE): void {
        if (!skinInfo) return;
        // console.warn('换装', skinInfo.bodyResID, resType, actType, '马', skinInfo.horseResID, skinInfo.weaponResID, skinInfo.wingResID);
        this.setBodyAnim(skinInfo.bodyResID, resType, actType);
        this.setHorseAnim(skinInfo.horseResID);
        this.setWeaponAnim(skinInfo.weaponResID);
        this.setWingAnim(skinInfo.wingResID);
        this.refreshLayer();
    }

    /** 重新播放 */
    public resume(): void {
        if (this._body && this._body.isValid) this._body.resume();
        if (this._horse && this._horse.isValid) this._horse.resume();
        if (this._horseHead && this._horseHead.isValid) this._horseHead.resume();
        if (this._weapon && this._weapon.isValid) this._weapon.resume();
        if (this._wing && this._wing.isValid) this._wing.resume();
        if (this._title && this._title.isValid && this._title['titleId']) this.setTitleAnim(this._title['titleId'], this._title['titleScale'] || 1);
    }

    /** 显示影子 */
    public showShadow(v: boolean): void {
        if (this._ShadowNode) this._ShadowNode.active = v;
    }

    public setShadow(): void {
        if (!this._ShadowNode) {
            this._ShadowNode = new cc.Node();
            this._ShadowNode.name = 'shadow';
            const spr = this._ShadowNode.addComponent(cc.Sprite);
            UtilCocos.LoadSpriteFrame(spr, 'texture/player/shadow_1');
            this.insertChild(this._ShadowNode, 0);
        }
    }

    /** 设置模型各个部件的显示隐藏 */
    public setEntityAnimActive(name: EntityAnimName, visible: boolean): void {
        switch (name) {
            case EntityAnimName.BODY:
                if (this._body && this._body.isValid) this._body.active = visible;
                break;
            case EntityAnimName.HORSE:
            case EntityAnimName.HORSE_HEAD:
                if (this._horse && this._horse.isValid) this._horse.active = visible;
                if (this._horseHead && this._horseHead.isValid) this._horseHead.active = visible;
                break;
            case EntityAnimName.WEAPON:
                if (this._weapon && this._weapon.isValid) this._weapon.active = visible;
                break;
            case EntityAnimName.WING:
                if (this._wing && this._wing.isValid) this._wing.active = visible;
                break;
            case EntityAnimName.TITLE:
                if (this._title && this._title.isValid) this._title.active = visible;
                break;
            default:
                break;
        }
    }

    /** 坐骑y偏移（进阶皮肤表坐骑部分）影响模型的整体y偏移 */
    private HorseOffset(horseResID: number) {
        const indexer: ConfigGradeSkinIndexer = Config.Get(ConfigConst.Cfg_GradeSkin);
        const horseOffset = indexer.getHorseOffset(horseResID);
        if (horseOffset) {
            this._entityOffX = horseOffset.x;
            this._entityOffY = horseOffset.y;
            this.roleNode.x = this._entityOffX;
            this.roleNode.y = this._entityOffY;
        }
    }

    /** 时装皮肤y偏移（时装皮肤表）影响时装头顶组件的偏移，如称号 */
    private getRoleOffset(roleResID: number | string): { x: number, y: number } {
        let resId: number = 0;
        if (typeof roleResID === 'string') {
            resId = +roleResID;
        } else {
            resId = roleResID;
        }
        const indexer: ConfigRoleSkinIndexer = Config.Get(ConfigConst.Cfg_RoleSkin);
        const roleOffset = indexer.getRoleOffset(resId);
        if (roleOffset) {
            this._roleSkinOffX = roleOffset.x;
            this._roleSkinOffY = roleOffset.y;
            return roleOffset;
        }
        return { x: 0, y: 0 };
    }

    public set forcePlay(forcePlay: boolean) {
        if (this._body) {
            this._body.forcePlay = forcePlay;
        }
    }

    public setCleanPreRes(isClean: boolean): void {
        if (this._body) {
            this._body.setCleanPreRes(isClean);
        }
    }

    /**
     * 模型的时装资源id
     */
    public bodyRes(): number | string {
        return this._bodyResId;
    }

    private checkLoaded(name: EntityAnimName): boolean {
        let isLoaded: boolean = false;
        if (this._animaDict[name]) {
            isLoaded = this._animaDict[name].isLoaded();
        }
        return isLoaded;
    }

    /** 设置角色身体动画 */
    public setBodyAnim(BodyResId: number | string, resType: ANIM_TYPE, actType?: ACTION_TYPE, wrapMode: number = cc.WrapMode.Loop): void {
        if (!BodyResId) return;
        this._bodyResId = BodyResId;
        this._body = this._initAnimCom(this._body, BodyResId, resType, EntityAnimName.BODY, actType, wrapMode, null, () => {
            if (!this._bodyResId) {
                if (this._body && this._body.isValid) {
                    this._body.release(true);
                    this._body = null;
                }
            }
            this.rePlay();
        });
    }

    /** 设置角色坐骑动画 */
    public setHorseAnim(horseResId: number): void {
        // console.log('--------------setHorseAnim-----------', this.isDirDown(this.getDir()));
        // if (this._horse && this._horse.isValid) console.log('this._horse 非空');
        // if (this._horseHead && this._horseHead.isValid) console.log('this._horseHead 非空');

        this._horseResId = horseResId;
        this.setHorseBodyAnim(horseResId);
        const dir = this.getDir();

        if (this.isDirDown(dir)) {
            this.setHorseHeadAnim(horseResId);
        } else if (this._horseHead && this._horseHead.isValid) {
            this._horseHead.release(true);
            this._horseHead = null;
            // console.log('清除 this._horseHead ---------', dir);
        }
        // 模型偏移
        this.HorseOffset(this._horseResId);
    }

    public setHorseBodyAnim(horseResId: number): void {
        // console.log('setHorseBodyAnim-----------', horseResId);
        const actionType: ACTION_TYPE = this._actionType;
        this._horse = this._initAnimCom(this._horse, horseResId, ANIM_TYPE.HORSE, EntityAnimName.HORSE, actionType, cc.WrapMode.Loop, null, () => {
            // console.log('-------setHorseBodyAnim加载完---------');
            if (!this._horseResId) {
                if (this._horse && this._horse.isValid) {
                    this._horse.release(true);
                    this._horse = null;
                }
                if (this._horseHead && this._horseHead.isValid) {
                    this._horseHead.release(true);
                    this._horseHead = null;
                }
            } else {
                this.rePlay();

                if (this.isDirDown(this.getDir())) {
                    if (this._horse && this._horse.isValid && this._horseHead && this._horseHead.isValid) {
                        const alpha = this.checkLoaded(EntityAnimName.HORSE_HEAD) ? 255 : 0;
                        this._horse.alpha = alpha;
                        this._horseHead.alpha = alpha;
                    }
                } else {
                    if (this._horse && this._horse.isValid) {
                        this._horse.alpha = 255;
                    }
                }

                // console.log('HorseBodyAnim加载完---------alpha=', this._horse.alpha);
            }
        });
        if (this.isDirDown(this.getDir())) {
            if (this._horse && this._horse.isValid && this._horseHead && this._horseHead.isValid) {
                const alpha = this.checkLoaded(EntityAnimName.HORSE) && this.checkLoaded(EntityAnimName.HORSE_HEAD) ? 255 : 0;
                this._horse.alpha = alpha;
                this._horseHead.alpha = alpha;
                // console.log('setHorseBodyAnim---------alpha=', alpha);
            }
        } else {
            if (this._horse && this._horse.isValid) {
                this._horse.alpha = 255;
            }
        }
    }

    public setHorseHeadAnim(horseResId: number | string): void {
        // console.log('setHorseHeadAnim-----------', horseResId);
        const actionType: ACTION_TYPE = this._actionType;
        const dir = this.getDir();
        this._horseHead = this._initAnimCom(this._horseHead, horseResId, ANIM_TYPE.HORSE_HEAD, EntityAnimName.HORSE_HEAD, actionType, cc.WrapMode.Loop, null, () => {
            if (!this._horseResId) {
                if (this._horse && this._horse.isValid) {
                    this._horse.release(true);
                    this._horse = null;
                }
                if (this._horseHead && this._horseHead.isValid) {
                    this._horseHead.release(true);
                    this._horseHead = null;
                }
            } else if (this.isDirDown(dir)) {
                if (this._horseHead && this._horseHead.isValid) this._horseHead.active = true;
                this.rePlay();
                if (this._horse && this._horse.isValid && this._horseHead && this._horseHead.isValid) {
                    const alpha = this.checkLoaded(EntityAnimName.HORSE) ? 255 : 0;
                    this._horse.alpha = alpha;
                    this._horseHead.alpha = alpha;
                    // console.log('HorseHeadAnim加载完---------alpha=', alpha);
                }
                // console.log('*****++ 加载完坐骑头了，当前是向下的，需要显示坐骑头 ++*****');
            } else {
                if (this._horseHead && this._horseHead.isValid) this._horseHead.active = false;
                // console.log('***** 加载完坐骑头了，但是当前是向上的，不需要显示坐骑头 *****');
            }
        });

        if (this.isDirDown(this.getDir())) {
            if (this._horse && this._horse.isValid && this._horseHead && this._horseHead.isValid) {
                const alpha = this.checkLoaded(EntityAnimName.HORSE) && this.checkLoaded(EntityAnimName.HORSE_HEAD) ? 255 : 0;
                this._horse.alpha = alpha;
                this._horseHead.alpha = alpha;
                // console.log('*setHorseHeadAnim---------alpha=', alpha);
            }
        } else {
            if (this._horseHead && this._horseHead.isValid) {
                this._horseHead.active = false;
            }
        }
    }

    /** 设置角色武器动画 */
    public setWeaponAnim(weaponResId: number): void {
        this._weaponResId = weaponResId;
        this._weapon = this._initAnimCom(this._weapon, weaponResId, ANIM_TYPE.WEAPON, EntityAnimName.WEAPON, null, cc.WrapMode.Loop, null, () => {
            if (!this._weaponResId) {
                if (this._weapon && this._weapon.isValid) {
                    this._weapon.release(true);
                    this._weapon = null;
                }
            }
        });
    }

    /** 设置角色翅膀动画 */
    public setWingAnim(wingResId: number): void {
        this._wingResId = wingResId;
        this._wing = this._initAnimCom(this._wing, wingResId, ANIM_TYPE.WING, EntityAnimName.WING, null, cc.WrapMode.Loop, null, () => {
            if (!this._wingResId) {
                if (this._wing && this._wing.isValid) {
                    this._wing.release(true);
                    this._wing = null;
                }
            }
        });
        if (this._wing) {
            this._wing.active = ModelMgr.I.SettingModel.getBeiShi();
        }
    }

    public getTitleOff(titleId: number): { x: number, y: number } {
        const cfgTitle: Cfg_Title = Config.Get(Config.Type.Cfg_Title).getValueByKey(titleId);

        /** 称号的基础偏移 */
        const offX: number = 15;
        const titleOffY: number = 230;
        const titleStandOffY: number = 360;
        let uisetY: number = 0;
        let mapSetY: number = 0;
        if (cfgTitle) {
            uisetY = cfgTitle.UISetY;
            mapSetY = cfgTitle.MapSetY;
        }

        let offY: number = titleOffY + uisetY;
        if (this._body && (this._body.resourceAction === ACTION_TYPE.UI || this._body.resourceAction === ACTION_TYPE.UI_SHOW)) {
            offY = titleStandOffY + mapSetY;
        }
        const roleOff = this.getRoleOffset(this._bodyResId);
        return { x: roleOff.x + offX, y: roleOff.y + offY };
    }

    /** 设置称号动画 */
    public setTitleAnim(titleId: number, scale: number = 1): void {
        if (!titleId) {
            if (this._title) {
                this._title.destroyAllChildren();
                this._title.removeAllChildren();
                this._title['titleRes'] = null;
                this._title['titleId'] = null;
            }
            return;
        }
        const off = this.getTitleOff(titleId);

        if (!this._title) {
            this._title = new cc.Node();
            this.roleNode.addChild(this._title);
        }
        this._title.setPosition(off.x, off.y, 0);

        this._title['titleId'] = titleId;
        this._title['titleScale'] = scale;

        UtilTitle.setTitle(this._title, titleId, true, scale);
    }

    /** 单独设置称号节点的缩放比例 */
    public setTitleScale(scale: number = 1): void {
        this._title?.setScale(scale, scale, scale);
    }

    /** 在哪个格子 */
    public get cellSerial(): cc.Vec2 {
        return cc.v2(Math.floor(this.position.x / MapCfg.I.cellWidth), Math.floor(this.position.y / MapCfg.I.cellHeight));
    }

    /** 是否向下 */
    public isDirDown(dir: ACTION_DIRECT): boolean {
        if (dir != null && dir >= 0) {
            return dir >= ACTION_DIRECT.RIGHT && dir <= ACTION_DIRECT.LEFT;
        }
        return false;
    }

    /** 获取方向 */
    public getDir(): number {
        return this._actorDir;
    }

    /** 设置方向 */
    public setDir(value: number): void {
        if (this._actorDir !== value) {
            this._actorDir = value;
        }
    }

    public get alpha(): number {
        return this._alpha;
    }
    public set alpha(value: number) {
        if (this._alpha !== value) {
            this._alpha = value;
            this.opacity = Math.floor(255 * (value / 1));
        }
    }

    /**
     * 播放角色动作
     * @param actionType 动作类型
     * @param dir 方向
     * @param wrapMode 播放模式
     * @param endCB 动作结束回调
     * @param context 回调函数上下文
     * @param starCB 开始播放的回调
     */
    public playAction(
        actionType: ACTION_TYPE,
        dir: ACTION_DIRECT = null,
        wrapMode: number = cc.WrapMode.Loop,
        endCB: () => void = null,
        context: any = null,
        starCB: () => void = null,
        editorActionName: string = null,
    ): void {
        if (dir == null) {
            dir = this._actorDir;
        }
        this.setDir(dir);
        this._actionType = actionType;
        this._playAction(actionType, dir, wrapMode, endCB, context, starCB, editorActionName);

        this.refreshLayer();
    }

    private _playAction(
        actionType: ACTION_TYPE,
        dir: ACTION_DIRECT = null,
        wrapMode: number = cc.WrapMode.Loop,
        endCB: () => void = null,
        context: any = null,
        starCB: () => void = null,
        editorActionName: string = null,
    ): void {
        if (dir == null) {
            dir = this._actorDir;
        }
        if (this.isDirDown(dir)) {
            if (!this._horseHead) {
                if (this._horse) {
                    this.setHorseHeadAnim(this._horse.resourceID);
                }
            } else {
                this._horseHead.active = true;
                // console.log('EntityBase._playAction------向下，显示----', actionType, dir);
            }
        } else if (this._horseHead) {
            this._horseHead.active = false;
            // console.log('EntityBase._playAction------向上，隐藏----', actionType, dir);
        }

        for (const key in this._animaDict) {
            const anim = this._animaDict[key];
            if (anim && anim.isValid) {
                if (key === EntityAnimName.BODY) {
                    anim.playAction(actionType, dir, wrapMode, endCB, context, () => {
                        if (this._body && this._body.isValid) {
                            this.rePlay();
                            if (starCB) {
                                starCB.call(this);
                            }
                        }
                    }, editorActionName);
                } else if (key === EntityAnimName.HORSE) {
                    const state: EPlayState = anim.playAction(actionType, dir, wrapMode, null, this, () => {
                        if (this._horse && this._horse.isValid) {
                            this.rePlay();
                        }
                        if (this.isDirDown(dir)) {
                            if (this._horse && this._horse.isValid && this._horseHead && this._horseHead.isValid) {
                                const alpha = this.checkLoaded(EntityAnimName.HORSE_HEAD) ? 255 : 0;
                                this._horse.alpha = alpha;
                                this._horseHead.alpha = alpha;
                            }
                        } else {
                            if (this._horse && this._horse.isValid) {
                                this._horse.alpha = 255;
                            }
                        }
                        // console.log('_playAction 播放回调 坐骑身 ---------alpha=', this._horse.alpha);
                    });
                    if ([5, 6, 7, 9].indexOf(state) >= 0) {
                        if (this.isDirDown(dir)) {
                            if (this._horse && this._horse.isValid && this._horseHead && this._horseHead.isValid) {
                                const alpha = this.checkLoaded(EntityAnimName.HORSE) && this.checkLoaded(EntityAnimName.HORSE_HEAD) ? 255 : 0;
                                this._horse.alpha = alpha;
                                this._horseHead.alpha = alpha;
                            }
                        } else {
                            if (this._horse && this._horse.isValid) {
                                this._horse.alpha = 255;
                            }
                        }
                        // console.log('_playAction 播放没有回调的情况 坐骑身 ---------alpha=', this._horse.alpha);
                    }
                } else if (key === EntityAnimName.HORSE_HEAD) {
                    if (this.isDirDown(dir)) {
                        const state = anim.playAction(actionType, dir, wrapMode, null, this, () => {
                            if (this._horseHead && this._horseHead.isValid) {
                                const isShow: boolean = this.isDirDown(dir);
                                this._horseHead.active = isShow;
                                this.rePlay();
                            }
                            if (this._horse && this._horse.isValid && this._horseHead && this._horseHead.isValid) {
                                const alpha = this.checkLoaded(EntityAnimName.HORSE) ? 255 : 0;
                                this._horse.alpha = alpha;
                                this._horseHead.alpha = alpha;
                                // console.log('_playAction 坐骑头 加载完 ---------alpha=', alpha);
                            }
                            // console.log('*****++ playAction 开始播放的回调 ++*****', dir, isShow);
                        });
                        if ([5, 6, 7, 9].indexOf(state) >= 0 && this._horse && this._horse.isValid && this._horseHead && this._horseHead.isValid) {
                            const alpha = this.checkLoaded(EntityAnimName.HORSE) && this.checkLoaded(EntityAnimName.HORSE_HEAD) ? 255 : 0;
                            this._horse.alpha = alpha;
                            this._horseHead.alpha = alpha;
                            // console.log('_playAction 坐骑头 ---------alpha=', alpha);
                        }
                    } else {
                        if (this._horse && this._horse.isValid) {
                            this._horse.alpha = 255;
                        }
                    }
                } else {
                    anim.playAction(actionType, dir, wrapMode);
                }
            }
        }
    }

    /**
     * rePlay
     */
    public rePlay(): void {
        for (const key in this._animaDict) {
            const anim = this._animaDict[key];
            if (anim && anim.isValid && anim.active) {
                anim.rePlay();
            }
        }
    }

    /** 暂定播放 */
    public pausePlay(): void {
        for (const key in this._animaDict) {
            const anim = this._animaDict[key];
            if (anim && anim.isValid && anim.active) {
                anim.pause();
            }
        }
    }

    /**
     *
     * @param anim AnimCom
     * @param resId 资源id
     * @param resType 动画类型 role pet ...
     * @param AnimName 动画名字
     * @param action 动作类型 s a r
     * @param wrapMode 播放类型
     * @param endCB 播放完的回调
     * @param starCB 开始播放的回调
     * @returns
     */
    private _initAnimCom(
        anim: AnimCom,
        resId: number | string,
        resType: ANIM_TYPE,
        AnimName: EntityAnimName,
        action?: ACTION_TYPE,
        wrapMode: number = cc.WrapMode.Loop,
        endCB: () => void = null,
        starCB: () => void = null,
    ): AnimCom {
        let actionType = this._actionType;
        if (action) {
            actionType = action;
        }
        const dir = this.getDir();
        if (resId) {
            if (anim) {
                anim.reset(resId, resType, dir, actionType, wrapMode, endCB, this, starCB);
            } else {
                anim = new AnimCom();
                anim.initAnimData({
                    resId,
                    resType,
                    isFight: this._isFightAnim,
                });
                const state = anim.playAction(actionType, dir, wrapMode, endCB, this, starCB);
                if (state > 0) {
                    console.log(resId, 'playAction返回：', state);
                }
                this.roleNode.addChild(anim);
            }
            anim.name = AnimName;
            this._animaDict[AnimName] = anim;
        } else if (anim) {
            anim.release(true);
            anim = null;
        }
        return anim;
    }

    /** 刷新动画挂件层级 */
    private refreshLayer() {
        const dir = this.getDir();
        let zIndexArr: string[] = [];
        if (dir === ACTION_DIRECT.SHOW) {
            zIndexArr = this.ANIM_ZINDEX_UI;
        } else {
            zIndexArr = this.ANIM_ZINDEX_DIR[dir];
        }
        if (!zIndexArr) return;
        for (let i = 0; i < zIndexArr.length; i++) {
            const z = 1 + i;
            const name = zIndexArr[i];
            const anim = this._animaDict[name];
            if (anim) { anim.setSiblingIndex(z); }
        }

        this.refreshOffset();
    }

    /** 刷新动画挂件偏移 */
    private refreshOffset() {
        const map = this._animaDict;
        for (const key in map) {
            const anim = map[key];
            if (!anim || !cc.isValid(anim)) {
                continue;
            }
            const scaleX = UtilCocos.GetScaleX(anim);
            if (anim.resourceDirect > ACTION_DIRECT.DOWN) {
                if (scaleX > 0) UtilCocos.SetScaleX(anim, scaleX * -1);
            } else if (scaleX < 0) UtilCocos.SetScaleX(anim, scaleX * -1);
        }
    }

    public release(isDestory: boolean = true): void {
        this._ShadowNode?.destroy();
        const map = this._animaDict;
        for (const key in map) {
            const anim = map[key];
            if (!anim || !anim.isValid) {
                continue;
            }
            anim.release(isDestory);
        }
        this._animaDict = {};
    }

    /** 设置动画播放速度 */
    public setPlaySpeed(speed: number): void {
        if (!speed) return;
        if (this._body) this._body.changeSpeed(speed);
        if (this._weapon) this._weapon.changeSpeed(speed);
        if (this._horse) this._horse.changeSpeed(speed);
        if (this._horseHead) this._horseHead.changeSpeed(speed);
        if (this._wing) this._wing.changeSpeed(speed);
        // if (this._title) this._title.changeSpeed(speed);
    }

    public getBodyFrameLength(actioname: string): number {
        return this._body.getActionFrameLength(actioname);
    }

    public getBodySpriteFrame(): cc.SpriteFrame {
        let sp: cc.SpriteFrame = null;
        const currentClip = this._body.getComponent(cc.Animation).currentClip;
        if (currentClip) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            sp = currentClip.curveData.comps['cc.Sprite'].spriteFrame[0].value;
        }
        return sp;
    }

    public getBodyScaleX(): number {
        return this._body.scaleX;
    }

    public getBodyAnim(): AnimCom {
        return this._body;
    }

    public cloneEntity(): EntityBase {
        const entity = new EntityBase(this._bodyResId, this._resType, this._actorDir, this._actionType, cc.WrapMode.Loop, this._isFightAnim);
        entity.setHorseAnim(this._horseResId);
        entity.setWeaponAnim(this._weaponResId);
        entity.setWingAnim(this._wingResId);
        entity.refreshLayer();
        return entity;
    }

    public setEntityScale(v: number): void {
        this.roleNode.scale = v;
    }

    public getEntityScale(): number {
        return this.roleNode.scale;
    }
}
