/* eslint-disable max-len */
/*
 * @Author: hrd
 * @Date: 2022-06-21 14:39:46
 * @FilePath: \SanGuo2.4\assets\script\game\battle\effect\SkillEffect.ts
 * @Description:
 *
 */

import { UtilString } from '../../../app/base/utils/UtilString';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { ACTION_DIRECT, ANIM_TYPE, ACTION_TYPE } from '../../base/anim/AnimCfg';
import AnimCom from '../../base/anim/AnimCom';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import SpineBase from '../../base/spine/SpineBase';
import { BattleMgr } from '../BattleMgr';
import { UtilBattle } from '../util/UtilBattle';
import { TargerPosType } from '../WarConst';

enum SkillAnimType {
    /** 序列帧 动画 */
    Normal = 0,
    /** cocos 动画 */
    CocosAnim = 1,
    /** spine 动画 */
    SpineAnim = 2,
}

export class SkillEffect {
    /** 循环播放 999999 */
    public static NoDelay = 999999;
    // private _effComPools = new Pool(() => new AnimCom(), 20);
    private static Instance: SkillEffect;
    public static get I(): SkillEffect {
        if (!this.Instance) {
            this.Instance = new SkillEffect();
        }
        return this.Instance;
    }

    public sceneShake(target: cc.Node): void {
        target.setPosition(cc.v2(0, 0));
        const t1 = cc.tween(target).by(0.05, { x: -14, y: -14 });
        const t2 = cc.tween(target).by(0.05, { x: 14, y: 14 });
        cc.tween(target).sequence(t1, t2).repeat(3).start();
    }

    private isShaked: boolean = false;
    /** 屏幕抖动 */
    public doSceneShake(target: cc.Node): void {
        if (this.isShaked === true) {
            return;
        }
        this.isShaked = true;
        SkillEffect.I.sceneShake(target);
        let timer = setTimeout(() => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            this.isShaked = false;
        }, 0.11);
    }

    public clearAll(): void {
        //
    }

    /**
     * 取到一个技能Spine动画
     * @param resID 资源ID
     * @param _actionName 动作名
     * @param delay 播放时长
     * @param speed 速度
     * @returns
     */
    private _getSkillSpine(resID: number | string, _actionName: string, direct: ACTION_DIRECT, delay: number = 0, speed: number = 0): cc.Node {
        let isKeep = false;
        if (delay > 0) {
            isKeep = true;
        }

        const spinePath = SpineBase.getSpineResPath(resID, ANIM_TYPE.SKILL, direct, ACTION_TYPE.ATTACK);
        const result = new SpineBase({
            path: spinePath,
            actionName: _actionName,
            loop: isKeep,
            callback: () => {
                // console.log('加载完');
            },
            endCallback: () => {
                // console.log('播放完');
                if (result && cc.isValid(result)) {
                    result.destroy();
                }
            },
        });

        if (isKeep && delay < SkillEffect.NoDelay) {
            const time = delay / 1000;
            result.setScheduleOnce(() => {
                if (result && result.isValid) {
                    result.active = false;
                    result.destroy();
                }
            }, this, time);
        }
        return result;
    }

    /**
     * 取到一个技能序列帧动画
     * @param resID 资源ID
     * @param isKeep 是否保持效果，并循环播放
     * @param direct 方向
     */
    private _getSkillAnimCom(resID: number | string, actionName: string, direct: ACTION_DIRECT, delay: number = 0, speed: number = 0): cc.Node {
        let result: AnimCom = null;
        let isKeep = false;
        if (delay > 0) {
            isKeep = true;
        }
        result = new AnimCom();
        result.initAnimData({
            resId: resID,
            resType: ANIM_TYPE.SKILL,
            isFight: true,
        });

        if (isKeep) {
            result.playAction(ACTION_TYPE.ATTACK, direct, cc.WrapMode.Loop, null, null, null, actionName);
        } else {
            result.playAction(ACTION_TYPE.ATTACK, direct, cc.WrapMode.Normal, () => {
                result.active = false;
                result.isUsed = false;
                result.destroy();
            }, this, null, actionName);
        }
        result.changeSpeed(speed);
        result.active = true;
        result.isUsed = true;
        if (isKeep && delay < SkillEffect.NoDelay) {
            const time = delay / 1000;
            const spr = result.getComponent(cc.Sprite);
            if (spr) {
                spr.scheduleOnce(() => {
                    if (result && result.isValid) {
                        result.active = false;
                        result.isUsed = false;
                        result.destroy();
                    }
                }, time);
            }
        }
        return result;
    }

    /**
     *  获取移到技能cocos动画
     * @returns
     */
    private _getSkillPrefab(resID: number | string, delay: number = 0): cc.Node {
        const preNode = new cc.Node();
        // const prefabPath = 'animPrefab/battlt/skill/action_70021/jn_fhlt';
        const prefabPath = `animPrefab/battle/skill/skill_${resID}/skill_${resID}`;
        ResMgr.I.showPrefabAsync(prefabPath).then((_node) => {
            if (!(preNode && cc.isValid(preNode))) {
                _node.destroy();
                return;
            }
            preNode.addChild(_node);
            const anim = _node.getComponent(cc.Animation);
            // if (anim.defaultClip) anim.defaultClip.speed = BattleMgr.I.getWarSpeed() || 1;

            const clip = anim.getClips()[0];
            if (!clip) {
                // 找不到飘字
                return;
            }
            const name = clip.name;
            const animState = anim.getAnimationState(name);
            if (animState) animState.speed = BattleMgr.I.getWarSpeed() || 1;

            if (delay > 0) {
                clip.wrapMode = cc.WrapMode.Loop;
                anim.scheduleOnce(() => {
                    if (!(preNode && cc.isValid(preNode))) {
                        return;
                    }
                    preNode.destroy();
                }, delay);
            } else {
                clip.wrapMode = cc.WrapMode.Default;
                anim.once(cc.Animation.EventType.FINISHED, () => {
                    preNode.destroy();
                }, preNode);
            }

            anim.play(clip.name);
        }).catch((err) => {
            console.log(err);
        });

        return preNode;
    }

    /**
     * 取到一个技能
     * @param resID 资源ID
     * @param isKeep 是否保持效果，并循环播放
     * @param direct 方向
     */
    private getSkill(resID: number | string, direct: number, effId: number, delay: number = 0, isHide: boolean = false): cc.Node {
        if (!resID || resID === 0 || resID === '0') {
            const stack = new Error().stack;
            console.warn('resID=0', stack);
        }
        const speed = BattleMgr.I.getWarSpeed();
        let result: cc.Node = null;
        if (isHide) {
            return new cc.Node();
        }
        const animType = this.getAnimType(effId);
        if (animType === SkillAnimType.Normal) {
            const actionName = this.getEffActionName(effId);
            result = this._getSkillAnimCom(resID, actionName, direct, delay, speed);
        } else if (animType === SkillAnimType.CocosAnim) {
            result = this._getSkillPrefab(resID, delay);
        } else if (animType === SkillAnimType.SpineAnim) {
            const actionName = this.getEffActionName(effId) || 'animation';
            result = this._getSkillSpine(resID, actionName, direct);
        }

        return result;
    }

    /** 获取特效动画名字 */
    private getEffActionName(effId: number): string {
        const effCfg: Cfg_SkillEffect = Config.Get(ConfigConst.Cfg_SkillEffect).getValueByKey(effId);
        if (!effCfg) return null;
        return effCfg.AnimName;
    }

    private IsCocosAnim(effId: number): boolean {
        // return true;
        const effCfg: Cfg_SkillEffect = Config.Get(ConfigConst.Cfg_SkillEffect).getValueByKey(effId);
        if (!effCfg) return false;
        return effCfg.IsCocosAnim === 1;
    }

    private getAnimType(effId: number): SkillAnimType {
        const effCfg: Cfg_SkillEffect = Config.Get(ConfigConst.Cfg_SkillEffect).getValueByKey(effId);
        if (!effCfg) return SkillAnimType.Normal;
        return effCfg.IsCocosAnim;
    }

    private getEffResName(effId: number): string {
        return `${effId}`;
    }

    private getEffDirect(effId: number, isDown: boolean = false): number {
        const effCfg: Cfg_SkillEffect = Config.Get(ConfigConst.Cfg_SkillEffect).getValueByKey(effId);
        let dir: ACTION_DIRECT = ACTION_DIRECT.RIGHT_DOWN; // 1 带方向特效
        if (effCfg && effCfg.Dir && !isDown) {
            // 技能朝下
            dir = effCfg.Dir;
            dir = ACTION_DIRECT.RIGHT_UP;
        }
        return dir;
    }

    private getScaleVal(effId: number): number {
        const effCfg: Cfg_SkillEffect = Config.Get(ConfigConst.Cfg_SkillEffect).getValueByKey(effId);
        let val = 1;
        if (effCfg && effCfg.Scale) {
            val = effCfg.Scale / 100;
        }
        return val;
    }

    /**
     * 设置翻转
     *  Transform 值为
     *   0不翻转
     *   1-绕Y轴旋转90度，再水平翻转
     *   2-垂直翻转，以X轴为对称轴R
     *   3-水平翻转，以Y轴为对称轴
     * @param effAnim
     * @param effId
     * @param isDown true 技能朝下
     * @returns
     */
    private setEffTransform(effAnim: cc.Node, effId?: number, isDown: boolean = false) {
        const effCfg: Cfg_SkillEffect = Config.Get(ConfigConst.Cfg_SkillEffect).getValueByKey(effId);
        if (!effCfg) return;
        const transform = effCfg.Transform;
        if (transform === 1) {
            // 是否需要旋转
            if (isDown) { //  技能朝上
                effAnim.scaleY = effAnim.scaleY > 0 ? -effAnim.scaleY : effAnim.scaleY;
                effAnim.angle = 90;
            } else {
                effAnim.scaleY = effAnim.scaleY < 0 ? -effAnim.scaleY : effAnim.scaleY;
                effAnim.angle = 0;
            }
        } else if (transform === 2) {
            if (isDown) {
                // X轴左右翻转
                effAnim.scaleX = effAnim.scaleX > 0 ? -effAnim.scaleX : effAnim.scaleX;
            } else {
                //
            }
        } else if (transform === 3) {
            if (isDown) {
                // Y轴上下翻转
                effAnim.scaleY = effAnim.scaleY > 0 ? -effAnim.scaleY : effAnim.scaleY;
            } else {
                //
            }
        } else {
            effAnim.angle = 0;
        }
        // return transform;
    }

    /** 解析特效id和挂载类型 */
    public getEffIdAndTargerPosType(effValStr: string): { effId: number, posType: number } {
        const arr = UtilString.SplitToArray(effValStr)[0];
        const _effId = +arr[0];
        const _targerPos = +arr[1];
        return { effId: _effId, posType: _targerPos };
    }

    /** 获取挂载节点 */
    public getEffPosAndZOrder(targerPos: number, tagPos: number): { p: cc.Vec2, nd: cc.Node } {
        let ndLayer = BattleMgr.I.SkillLayer2;
        let effPos: cc.Vec2 = cc.v2(0, 0);
        const curWar = BattleMgr.I.getCurWar();
        if (targerPos === TargerPosType.TargerBody) {
            const tagEntity = curWar.getEntity(tagPos);
            if (tagEntity && cc.isValid(tagEntity)) {
                ndLayer = tagEntity;
                effPos = cc.v2(0, 0);
            }
        } else if (targerPos === TargerPosType.TargerFloor) {
            const tagEntity = curWar.getEntity(tagPos);
            if (tagEntity && cc.isValid(tagEntity)) {
                effPos = tagEntity.getPosition();
                ndLayer = BattleMgr.I.SkillLayer1;
            }
        } else if (targerPos === TargerPosType.SceneCentre) {
            effPos = cc.v2(0, 0);
        } else if (targerPos === TargerPosType.CampCentre) {
            effPos = UtilBattle.DownCompCentrePos;
            if (UtilBattle.I.isUpCamp(tagPos)) {
                effPos = UtilBattle.UpCompCentrePos;
            }
        } else if (targerPos === TargerPosType.TargerPos) {
            const tagEntity = curWar.getEntity(tagPos);
            if (tagEntity && cc.isValid(tagEntity)) {
                effPos = tagEntity.getPosition();
                ndLayer = BattleMgr.I.SkillLayer2;
            }
        }
        return { p: effPos, nd: ndLayer };
    }

    /** 播放受击特效 */
    public PlayHitEff(parentNode: cc.Node, effId: number, offPos: cc.Vec2, isHide: boolean = false): void {
        if (!(parentNode && cc.isValid(parentNode))) {
            return;
        }
        const direct = this.getEffDirect(effId);
        const resName = this.getEffResName(effId);
        const eff = this.getSkill(resName, direct, effId, 0, isHide);
        const scaleVal = this.getScaleVal(effId);
        UtilBattle.I.setNodeScale(eff, scaleVal);
        this.setEffTransform(eff);
        parentNode.addChild(eff);
        eff.setPosition(offPos);
        // eff.position = v3(eff.position.x, eff.position.y + 50);
    }

    /**
     * 播放定点特效
     * @param pos 坐标位置
     * @param parentNode 父节点
     * @param effId 特效id
     * @param isDown 特效是否方向向下
     * @param delay 延迟时间
     * @param zOrder 深度值
     * @returns
     */
    public PlayEffByPos(pos: cc.Vec2, parentNode: cc.Node, effId: number, isDown: boolean = false, delay: number = 0, isHide: boolean = false): cc.Node {
        if (!(parentNode && cc.isValid(parentNode))) {
            return null;
        }
        const direct = this.getEffDirect(effId, isDown);
        const resName = this.getEffResName(effId);
        const eff = this.getSkill(resName, direct, effId, delay, isHide);
        const scaleVal = this.getScaleVal(effId);
        UtilBattle.I.setNodeScale(eff, scaleVal);
        this.setEffTransform(eff, effId, isDown);
        if (parentNode.isValid) {
            parentNode.addChild(eff);
        }
        eff.setPosition(pos);
        return eff;
    }

    /**
     * 播放施法特效
     * @param parentNode 父节点
     * @param effId 特效id
     * @param isDown 特效是否方向向下
     * @returns
     */
    public PlayCastEff(parentNode: cc.Node, effId: number, isDown: boolean = false, isHide: boolean = false): cc.Node {
        if (!(parentNode && cc.isValid(parentNode))) {
            return null;
        }
        const direct = this.getEffDirect(effId, isDown);
        const resName = this.getEffResName(effId);
        const eff = this.getSkill(resName, direct, effId, 0, isHide);
        const scaleVal = this.getScaleVal(effId);
        UtilBattle.I.setNodeScale(eff, scaleVal);
        this.setEffTransform(eff, effId, isDown);
        eff.position = cc.v3(0, 0);
        if (parentNode.isValid) {
            parentNode.insertChild(eff, 200);
        }

        return eff;
    }

    /**
     * 飞行特效
     * @param pos 坐标位置
     * @param parentNode 父节点
     * @param effId 特效id
     * @param isDown 特效是否方向向下
     * @param delay 延迟时间
     * @param zOrder 深度值
     * @returns
     */
    public PlayEffByFly(pos: cc.Vec2, parentNode: cc.Node, effId: number, isDown: boolean = false, delay: number = 0, isHide: boolean = false): cc.Node {
        if (!(parentNode && cc.isValid(parentNode))) {
            return null;
        }
        const direct = this.getEffDirect(effId, isDown);
        const resName = this.getEffResName(effId);
        const eff = this.getSkill(resName, direct, effId, delay, isHide);
        const scaleVal = this.getScaleVal(effId);
        UtilBattle.I.setNodeScale(eff, scaleVal);
        this.setEffTransform(eff, effId, isDown);
        eff.setPosition(pos);
        if (parentNode.isValid) {
            parentNode.insertChild(eff, 200);
        }
        return eff;
    }

    public PlayBuffEff(effId: number, delay: number = 0, isHide: boolean = false, isDown: boolean = false): cc.Node {
        const direct = this.getEffDirect(effId, isDown);
        const resName = this.getEffResName(effId);
        const eff = this.getSkill(resName, direct, effId, delay, isHide);
        const scaleVal = this.getScaleVal(effId);
        UtilBattle.I.setNodeScale(eff, scaleVal);
        this.setEffTransform(eff, effId, isDown);
        return eff;
    }
}
