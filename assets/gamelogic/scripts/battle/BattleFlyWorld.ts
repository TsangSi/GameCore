/* eslint-disable dot-notation */
/* eslint-disable indent */
/* eslint-disable max-len */
import { Animation, AnimationClip, Font, js, Label, Node, NodePool, v2, Vec2 } from 'cc';
import { DEBUG } from 'cc/env';
import ActionConfig from '../../../scripts/action/ActionConfig';
import { FightEntity } from '../../../scripts/action/FightEntity';
import { EffectManager } from '../../../scripts/common/EffectManager';
import { Executor } from '../../../scripts/common/Executor';
import { PlayerInfo } from '../../../scripts/common/PlayerInfo';
import { ResManager } from '../../../scripts/common/ResManager';
import { Config } from '../../../scripts/config/Config';
import { BundleType, CLIENT_SHOW_TYPE, UNIT_TYPE } from '../../../scripts/global/GConst';
import EntityManager from '../../../scripts/map/EntityManager';
import UIManager from '../../../scripts/ui/UIManager';
import Utils from '../../../scripts/utils/Utils';
import UtilsCC from '../../../scripts/utils/UtilsCC';
import { BattleBase } from './base/BattleBase';
import { BattleManager } from './BattleManager';

interface MarkRes {
    prefabPath: string,
    fontPath: string,
    bjFontPath: string,
    markPath: string,
    idDefault: boolean;
}

/** [飞龙在天，龙战在野，冰封千里，暴风雪，生生不息，泽被万物] */
const skillNames = [
    { name: 'sl_font_flzt', bg: 'sl_img_flzt' },
    { name: 'sl_font_lzyy', bg: 'sl_img_lzyy' },
    { name: 'sl_font_bfql', bg: 'sl_img_bfql' },
    { name: 'sl_font_bfx', bg: 'sl_img_bfx' },
    { name: 'sl_font_ssbx', bg: 'sl_img_ssbx' },
    { name: 'sl_font_zbww', bg: 'sl_img_zbww' },
];

export class BattleFlyWorld extends BattleBase {
    private target: FightEntity;
    private m_str = '';
    private m_hurtType: CLIENT_SHOW_TYPE = CLIENT_SHOW_TYPE.DEFAULT_ATTACK;
    private m_offset: Vec2 = v2(0, 0);
    private m_callback: () => void;
    private m_ctx: any = null;
    private m_force = false;
    private m_hlID = 0;
    private m_alienResID = 0;
    private m_currAtkType = -1;
    private m_otherData: any = null;
    private m_isZhongQuanBJ = false;
    // private mTime: number = 500
    /**
     *
     * @param tPos 目标站位
     * @param str 内容
     * @param hurtType 伤害类型
     * @param offset 偏移坐标
     * @param ctx 回调实例对象
     * @param force 是否强制执行 callback
     * @param hlID 幻灵ID
     * @param alienResID 异兽资源id
     * @param currAtkType 战斗单位类型 UNIT_TYPE.
     * @param otherData 其它数据传参
     * @param otherData 其它数据传参
     * @param isZhongQuanBJ //重拳/重击暴击
     * @returns
     */
    public static Create(target: FightEntity, str: string, hurtType: number, offset?: Vec2,
        ctx?: any, force?: boolean, hlID?: number, alienResID?: number,
        currAtkType?: number, otherData: any = null, isZhongQuanBJ = false): BattleFlyWorld {
        const action = new BattleFlyWorld();
        action.target = target;
        action.m_str = str;
        action.m_hurtType = hurtType;
        action.m_offset = offset;
        action.m_ctx = ctx;
        action.m_force = force;
        action.m_hlID = hlID;
        action.m_alienResID = alienResID;
        action.m_otherData = otherData;
        action.m_isZhongQuanBJ = isZhongQuanBJ;
        if (currAtkType) {
            action.m_currAtkType = currAtkType;
        }
        return action;
    }

    onEnter() {
        this.Show(this.target, this.m_str, this.m_hurtType, this.m_offset, undefined, this.m_hlID, this.m_alienResID, this.m_currAtkType, this.m_otherData, this.m_isZhongQuanBJ);
    }

    public riseArray: { [name: string]: NodePool; } = {};
    private getStrByHurtType(hurtType: number, str: string) {
        switch (hurtType) {
            case CLIENT_SHOW_TYPE.ReduceBlood:
            case CLIENT_SHOW_TYPE.DEFAULT_ATTACK:
            case CLIENT_SHOW_TYPE.CRIT:
            case CLIENT_SHOW_TYPE.BeSwallow:
            case CLIENT_SHOW_TYPE.Swallow:
            case CLIENT_SHOW_TYPE.ContinueDropHp:
            case CLIENT_SHOW_TYPE.TianFa:
                if (str === '0' || str === 'undefined' || str === 'null') {
                    // 吞噬，吐出,直接掉血,暴击，普攻。
                    // 如果没有伤害，就不飘字
                    return undefined;
                }
                break;
            default:
                break;
        }
        return str;
    }

    private Show(target: FightEntity, str: string, hurtType = CLIENT_SHOW_TYPE.DEFAULT_ATTACK, offset = v2(0, 0), excutor: Executor = undefined, hlID = 0, alienResID = 0, currAtkType = -1, otherData: any = null,
        isZhongQuanBJ = false) {
        console.log('飘字');
        if (currAtkType === UNIT_TYPE.Alien && +str < 2) {
            // 低伤害量的异兽不飘字
            return;
        }
        str = this.getStrByHurtType(hurtType, str);
        if (str === undefined) {
            return;
        }
        if (hurtType === CLIENT_SHOW_TYPE.TianFa) {
            otherData = null;
            currAtkType = null;
            hurtType = CLIENT_SHOW_TYPE.DEFAULT_ATTACK;
            str = `-${str}`;
        }
        const cfg_client_skill: Cfg_ClientSkill = Config.getI(Config.T.Cfg_ClientSkill).getDataByKey(hurtType.toString());
        if (target === undefined) {
            if (Utils.isNullOrUndefined(cfg_client_skill)) {
                if (DEBUG) {
                    console.log(`飘字异常：${hurtType}`);
                }
                if (excutor) {
                    excutor.invoke();
                }
                return;
            }
        }
        if (Utils.isNullOrUndefined(this.riseArray[hurtType])) {
            this.riseArray[hurtType] = new NodePool();
        }
        let riseNode: Node;
        riseNode = this.riseArray[hurtType].get();
        if (riseNode === null || riseNode.isValid === false) {
            riseNode = new Node();
            riseNode.name = `riseNode_${hurtType}`;
            switch (hurtType) {
                case CLIENT_SHOW_TYPE.SKILL_ATTACK:
                    // 显示技能名字
                    this.showSkillName(target, riseNode, hurtType, currAtkType, offset, str, hlID, otherData);
                    break;
                case CLIENT_SHOW_TYPE.DIZZINESS:
                    this.showXuanYun(target, riseNode, offset);
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/xuanyun0', target, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.SLEEP:
                    this.showSleep(target, offset);
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/hunshui0', target, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.BROKEN_DEFENSE:
                    // str = "破防" + str;
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/pofang', target, hurtType, offset, str, 'zi/breakDefFont');
                    break;
                case CLIENT_SHOW_TYPE.DOUBLE_HIT:
                    // str = "连击" + str;
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/lianji', target, hurtType, offset, str, 'wenzishuzi/combFont');
                    break;
                case CLIENT_SHOW_TYPE.ADD_ATTACK:
                    // 增加攻击
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/jiagongji', target, hurtType, offset, str, 'wenzishuzi/buffFont');
                    break;
                case CLIENT_SHOW_TYPE.TAKE_BLOOD:
                    // str = "吸血" + str;
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/xixue', target, hurtType, offset, str, 'wenzi/restoreFont');
                    break;
                case CLIENT_SHOW_TYPE.UN_HURT:
                    // str = "反伤" + str;
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/fanshang', target, hurtType, offset, str, 'wenzishuzi/combFont');
                    break;
                case CLIENT_SHOW_TYPE.REVIVE:
                    // str = "复活" + str;
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/fuhuo', target, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.KILL:
                    // 秒杀;
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/miaosha', target, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.BACK_BLOOD:
                    // 回血
                    // str = "+" + str;
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/huixue', target, hurtType, offset, str, 'wenzi/restoreFont');
                    break;
                case CLIENT_SHOW_TYPE.REVENGE:
                    // str = "复仇";
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/fuchou', target, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.PURIFY:
                    // str = "净化";
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/jinghua', target, hurtType, offset, str);
                    if (target.flagCharm) {
                        // 如果有魅惑,清理一下
                        if (target.keepNode && target.keepNode.isValid) {
                            target.keepNode.destroy();
                        }
                        target.flagCharm = false;
                    }
                    break;
                case CLIENT_SHOW_TYPE.GOD_HIT:
                    // str = "仙" + str;
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/jinghua', target, hurtType, offset, str, 'New Node/bjZiFont');
                    break;
                case CLIENT_SHOW_TYPE.BeSwallow:
                case CLIENT_SHOW_TYPE.Swallow:
                case CLIENT_SHOW_TYPE.ReduceBlood:
                case CLIENT_SHOW_TYPE.DEFAULT_ATTACK:
                case CLIENT_SHOW_TYPE.CRIT:
                case CLIENT_SHOW_TYPE.ZhongQuan:
                case CLIENT_SHOW_TYPE.ContinueDropHp:
                case CLIENT_SHOW_TYPE.SubSpeed:
                case CLIENT_SHOW_TYPE.Freeze:
                    this.showMark(hurtType, currAtkType, target, riseNode, str, offset, otherData, isZhongQuanBJ);
                    break;
                case CLIENT_SHOW_TYPE.SOUL_BLOW:
                    // str = "致命一击" + str;
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/zhimingyiji', target, hurtType, offset, str, 'New Node/bjZiFont');
                    break;
                case CLIENT_SHOW_TYPE.DUCK:
                    // str = "闪避";
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/shanbi', target, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.DEFENES:
                    // 防御
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/jiajianshang', target, hurtType, offset, str, 'wenzishuzi/buffFont');
                    break;
                case CLIENT_SHOW_TYPE.HURT:
                    // 伤害
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/jiashanghai', target, hurtType, offset, str, 'wenzishuzi/buffFont');
                    break;
                case CLIENT_SHOW_TYPE.SHIELD_HURT:
                    this.showShieldHurt(target, riseNode, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.IceShieldUse:
                    this.showShieldHurt(target, riseNode, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.PARRY:
                    // 招架
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/zhaojia', target, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.PETA_GRAD:
                    // str = "天仙守护";
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/tianxianjuexing', target, hurtType, offset, str, 'New Node/txjxFont', 1, (n) => {
                        const rm: PlayerInfo = target.Info;
                        let skinID = 'img_tianxian1';
                        if (Config.getI(Config.T.Cfg_PetAMerge).getDataByKey(rm.Show_PetAId.toString())) {
                            // 是合体天仙
                            if (rm.Show_MergePetA_Skin) {
                                // 并且幻化
                                const key = rm.Show_MergePetA_Skin.toString();
                                skinID = Config.getI(Config.T.Cfg_Skin).selectByKey(key, 'HeadPic');
                                skinID = skinID || Config.getI(Config.T.Cfg_SkinGrade).selectByKey(key, 'HeadPic');
                            }
                        }
                        UtilsCC.setSprite('New Node/img_tianxian1', n, `prefabs/e/zhandoupiaozi/zhandouimg/${skinID}`);
                    });
                    break;
                case CLIENT_SHOW_TYPE.Charm:
                    // str = "魅惑";
                    EffectManager.I.showEffect('e/fight/ui_5108', target, AnimationClip.WrapMode.Loop, (n) => {
                        if (target.keepNode && target.keepNode.isValid) {
                            target.keepNode.destroy();
                        }
                        const healthBar: Node = UtilsCC.getNodeAttr(target, 'healthBar');
                        const pz = n;
                        const x = offset.x;
                        const y = healthBar.position.y - 10 + offset.y;
                        pz.setPosition(x, y);
                        pz.name = 'Charm';
                        target.keepNode = pz;
                    });
                    // str = "魅惑";
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/meihuo', target, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.TogeterAtk:
                    // str = "合击";
                    offset.y += 35;
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/heji', target, hurtType, offset, str, 'wenzishuzi/combFont');
                    break;
                case CLIENT_SHOW_TYPE.FEISHENG_JM:
                    // str = "飞升伤害";
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/fsshanghaijianmian', target, hurtType, offset, str, 'wenzishuzi/buffFont');
                    break;
                case CLIENT_SHOW_TYPE.CHASE:
                    // str = "追击";
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/zhuiji', target, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.HERO_WORLD:
                    // str = "英雄技能";
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/zz_ani_t', target, hurtType, offset, str, '', 1, (n) => {
                        const heroInfo = str.split(':');
                        UtilsCC.setSprite('font_cygq', n, `prefabs/e/zhandoupiaozi/zhandouimg/zz_font_0${heroInfo[0]}`);
                        UtilsCC.setSprite('cygq', n, `prefabs/e/zhandoupiaozi/zhandouimg/zz_font_0${heroInfo[0]}`);
                        UtilsCC.setSprite('img_cygqdi', n, `prefabs/e/zhandoupiaozi/zhandouimg/zz_img_0${heroInfo[0]}`);
                        UtilsCC.setSprite('img_hl01', n, `prefabs/e/zhandoupiaozi/zhandouimg/zz_mesh_0${heroInfo[1]}`);
                    });
                    break;
                case CLIENT_SHOW_TYPE.UnDeath:
                    // str = "免死";
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/ms_ani', target, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.ForceKill:
                    // str = "斩杀";
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/zhansha', target, hurtType, offset, str, 'New Node/bjZiFont');
                    break;
                case CLIENT_SHOW_TYPE.ChangeToAlien:
                    // 异兽变身
                    this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/ys_bsj', target, hurtType, offset, str, undefined, undefined, (n) => {
                        UtilsCC.setSprite('New Node/img_tianxian1', n, `prefabs/e/zhandoupiaozi/zhandouimg/ys_mesh_${alienResID}`);
                    });
                    break;
                case CLIENT_SHOW_TYPE.DeathHit:
                    // 致命一击
                    if (str.indexOf('%') < 0) {
                        str = `+${str}%`;
                    }
                    if (hurtType === CLIENT_SHOW_TYPE.DeathHit) {
                        const dtwz_node: Node = UtilsCC.getNodeAttr(riseNode, 'dtwz');
                        const dtpz_node: Node = UtilsCC.getNodeAttr(riseNode, 'dtpz');
                        this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/sl_zmyj_buff', target, hurtType, offset, str, 'wenzishuzi/buffFont', undefined, (n, l) => {
                            l.active = true;
                            riseNode['dtwz'] = dtwz_node;
                            riseNode['dtpz'] = dtpz_node;
                        });
                    }
                    break;
                case CLIENT_SHOW_TYPE.JiLi:
                case CLIENT_SHOW_TYPE.TianQian:
                case CLIENT_SHOW_TYPE.SHOW_BOOLD:
                    break;
                default:
                    this.riseNow(target, riseNode, hurtType, str, undefined, offset);
                    break;
            }
        } else {
            const label = UtilsCC.getNodeAttr(riseNode, 'dtwz');
            switch (hurtType) {
                case CLIENT_SHOW_TYPE.HURT:
                    // 伤害
                    if (str.indexOf('%') < 0) {
                        str += '%';
                    }
                    if (str.indexOf('+') < 0) {
                        str = `+${str}`;
                    }
                    this.riseNow(target, riseNode, hurtType, str, label, offset);
                    break;
                case CLIENT_SHOW_TYPE.SLEEP:
                    this.showSleep(target, offset);
                    this.riseNow(target, riseNode, hurtType, str, label, offset);
                    break;
                case CLIENT_SHOW_TYPE.DIZZINESS:
                    EffectManager.I.showEffect('e/fight/ui_5106', target, AnimationClip.WrapMode.Loop, (n) => {
                        if (target.keepNode && target.keepNode.isValid) {
                            target.keepNode.destroy();
                        }
                        const pz = n;
                        const healthBar: Node = UtilsCC.getNodeAttr(target, 'healthBar');
                        const x = offset.x;
                        const y = healthBar.position.y - 10 + offset.y;
                        pz.setPosition(x, y);
                        pz.name = 'DIZZINESS';
                        target.keepNode = pz;
                        this.riseNow(target, riseNode, hurtType, str, label, offset);
                    });
                    break;
                case CLIENT_SHOW_TYPE.Charm:
                    EffectManager.I.showEffect('e/fight/ui_5108', target, AnimationClip.WrapMode.Loop, (n) => {
                        if (target.keepNode) {
                            target.keepNode.destroy();
                        }
                        const pz = n;
                        const healthBar: Node = UtilsCC.getNodeAttr(target, 'healthBar');
                        const x = offset.x;
                        const y = healthBar.position.y - 10 + offset.y;
                        pz.setPosition(x, y);
                        pz.name = 'Charm';
                        target.keepNode = pz;
                        this.riseNow(target, riseNode, hurtType, str, label, offset);
                    });
                    break;
                case CLIENT_SHOW_TYPE.SHIELD_HURT:
                    this.showShieldHurt(target, riseNode, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.IceShieldUse:
                    this.showShieldHurt(target, riseNode, hurtType, offset, str);
                    break;
                case CLIENT_SHOW_TYPE.HERO_WORLD:
                    if (hurtType === CLIENT_SHOW_TYPE.HERO_WORLD) {
                        const heroInfo = str.split(':');
                        UtilsCC.setSprite('dh/font_cygq', riseNode, `prefabs/e/zhandoupiaozi/zhandouimg/zz_font_0${heroInfo[0]}`);
                        UtilsCC.setSprite('dh/cygq', riseNode, `prefabs/e/zhandoupiaozi/zhandouimg/zz_font_0${heroInfo[0]}`);
                        UtilsCC.setSprite('dh/img_cygqdi', riseNode, `prefabs/e/zhandoupiaozi/zhandouimg/zz_img_0${heroInfo[0]}`);
                        UtilsCC.setSprite('dh/img_hl01', riseNode, `prefabs/e/zhandoupiaozi/zhandouimg/zz_mesh_0${heroInfo[1]}`);
                        this.riseNow(target, riseNode, hurtType, str, label, offset);
                        this.setStr(label, str);
                        riseNode.setPosition(0, riseNode.position.y);
                    }
                    break;
                default:
                    this.riseNow(target, riseNode, hurtType, str, label, offset);
                    this.setStr(label, str);
                    break;
            }
        }
    }

    private setStr(outlabel: Node, str: string) {
        if (outlabel && outlabel.isValid) {
            outlabel.active = true;
            if (str === '0') {
                outlabel.active = false;
            }
            const lb_class = outlabel.getComponent(Label);
            lb_class.string = str;
        }
    }

    private riseNow(target: FightEntity, riseNode: Node, hurtType: number, str: string, outlabel?: Node, offset: Vec2 = v2(0, 0)) {
        this.setStr(outlabel, str);
        UtilsCC.setAnchorPoint(riseNode, 0.5);
        hurtType = hurtType || 0;
        const hlID = 0;
        if (target && target.isValid) {
            if (hlID === 0) {
                const x = target.position.x - UtilsCC.getWidth(riseNode) / 2;
                let y = target.position.y;
                riseNode.setPosition(target.position.x - UtilsCC.getWidth(riseNode) / 2, target.position.y);

                const BeginY: number = Config.getI(Config.T.Cfg_ClientSkill).selectByKey(hurtType.toString(), 'BeginY');
                if (!Utils.isNullOrUndefined(BeginY)) {
                    y += BeginY;
                }
                riseNode.setPosition(x, y);
            }
            // 断网的时候,此处会出现一个错误
            if (target.parent == null) {
                this.riseArray[hurtType].put(riseNode);
                return;
            }
            target.parent.addChild(riseNode);
        }
        const dh: Node = riseNode.getChildByName('dh');
        if (riseNode.isValid && dh && dh.isValid) {
            dh.setPosition(offset.x, offset.y);
            const anim = dh.getComponent(Animation);
            if (anim && anim.isValid) {
                if (anim.defaultClip) {
                    anim.defaultClip.wrapMode = AnimationClip.WrapMode.Normal;
                }
                try {
                    anim.once(Animation.EventType.FINISHED, () => {
                        this.animationFinishedHandle(hurtType, riseNode);
                    }, this);
                    anim.play();
                } catch (e) {
                    console.error(e.stack);
                }
            }
        } else {
            this.animationFinishedHandle(hurtType, riseNode);
        }
    }

    /** 动画播放完的回调 */
    animationFinishedHandle(hurtType: number, riseNode: Node) {
        switch (hurtType) {
            case CLIENT_SHOW_TYPE.ReduceBlood:
            case CLIENT_SHOW_TYPE.DEFAULT_ATTACK:
            case CLIENT_SHOW_TYPE.CRIT:
            case CLIENT_SHOW_TYPE.SKILL_ATTACK:
            case CLIENT_SHOW_TYPE.BeSwallow:
            case CLIENT_SHOW_TYPE.Swallow:
            case CLIENT_SHOW_TYPE.ContinueDropHp:
                // // 类型复杂，所以不复用

                for (let i = 0, n = riseNode.children[0].children.length; i < n; i++) {
                    let node = riseNode.children[0].children[i];
                    node.destroyAllChildren();
                    node.destroy();
                }
                riseNode.destroyAllChildren();
                riseNode.destroy();
                break;
            default:
                if (this.riseArray[hurtType] == null) {
                    this.riseArray[hurtType] = new NodePool();
                }
                this.riseArray[hurtType].put(riseNode);
                break;
        }
    }

    private getSkillNameRes(skillid: number) {
        if (skillid <= 14100 || skillid >= 14159) {
            return undefined;
        }
        const num = skillid - 14100;
        const s = num % 10;
        if (s !== 9) {
            const i = Math.floor(num / 10);
            return skillNames[i];
        }
        return undefined;
    }

    private initPrefab(initNode: Node, riseNode: Node, offset: Vec2, labelname?: string, scale = 1) {
        const pz: Node = initNode;
        pz.name = 'dh';
        pz.setPosition(offset.x, offset.y);
        let label: Node;
        if (labelname) {
            label = UtilsCC.getNode(labelname, pz);
            if (label) {
                label.active = false;
                riseNode['dtwz'] = label;
            }
        }
        // riseNode.addChild(pz);
        riseNode['dtpz'] = pz;
        pz.setScale(scale, scale);
        return label;
    }

    /** 显示眩晕效果 */
    private showXuanYun(target: FightEntity, riseNode: Node, offset: Vec2) {
        EffectManager.I.showEffect('e/fight/ui_5106', target, AnimationClip.WrapMode.Loop, (n) => {
            const old_n: Node = UtilsCC.getNodeAttr(target, 'keepNode');
            if (old_n) {
                old_n.destroy();
            }
            n.setPosition(offset.x, offset.y);
            n.name = 'DIZZINESS';
            target.keepNode = n;
            target.addChild(n);
        });
    }

    /** 昏睡 */
    private showSleep(target: FightEntity, offset: Vec2) {
        let keepNode: Node = UtilsCC.getNodeAttr(target, 'keepNode');
        if (keepNode) {

            keepNode = undefined;
        }
        if (Number(target.name.split('_')[1]) < 11) {
            UIManager.I.showPrefab(target, 'prefabs/e/zhandoupiaozi/hunshui', BundleType.gamelogic, (e, n) => {
                n.setPosition(offset.x, offset.y + 100);
                n.name = 'SLEEP';
                target.keepNode = n;
            }, this);
        } else {
            UIManager.I.showPrefab(target, 'prefabs/e/zhandoupiaozi/hunshui1', BundleType.gamelogic, (e, n) => {
                n.setPosition(offset.x, offset.y + 100);
                n.name = 'SLEEP';
                target.keepNode = n;
            }, this);
        }
    }

    /** 显示mark资源 */
    private showMark(hurtType: number, currAtkType: number, target: FightEntity, riseNode: Node, str: string, offset: Vec2, otherData: any, isZhongQuanBJ = false) {
        let data: MarkRes = js.createMap(true);
        switch (hurtType) {
            case CLIENT_SHOW_TYPE.BeSwallow:
            case CLIENT_SHOW_TYPE.Swallow:
            case CLIENT_SHOW_TYPE.ReduceBlood:
            case CLIENT_SHOW_TYPE.DEFAULT_ATTACK:
            case CLIENT_SHOW_TYPE.CRIT:
                data = this.getAttackMarkResData(currAtkType, otherData, hurtType === CLIENT_SHOW_TYPE.CRIT);
                break;
            case CLIENT_SHOW_TYPE.ContinueDropHp:
                data.fontPath = 'prefabs/e/zhandoupiaozi/zhuoShaoFont';
                data.prefabPath = 'prefabs/e/zhandoupiaozi/diaoxue_ts';
                data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/img_zhuoshao';
                data.idDefault = true;
                break;
            case CLIENT_SHOW_TYPE.SubSpeed:
                data.prefabPath = 'prefabs/e/zhandoupiaozi/diaoxue_ts';
                data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/img_jiansu';
                data.idDefault = true;
                break;
            case CLIENT_SHOW_TYPE.Freeze:
                data.prefabPath = 'prefabs/e/zhandoupiaozi/diaoxue_ts';
                data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/img_bingdong';
                data.idDefault = true;
                break;
            case CLIENT_SHOW_TYPE.ZhongQuan:
                if (isZhongQuanBJ) {
                    // 暴击
                    data.bjFontPath = 'prefabs/e/zhandoupiaozi/zhandouimg/baoji_zhongq';
                    data.prefabPath = 'prefabs/e/zhandoupiaozi/baoji_ts';
                } else {
                    // 普通
                    data.bjFontPath = undefined;
                    data.prefabPath = 'prefabs/e/zhandoupiaozi/diaoxue_ts';
                }
                data.fontPath = 'prefabs/e/zhandoupiaozi/zhongQFont';
                data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/pg_zhongq';
                data.idDefault = !isZhongQuanBJ;
                break;
            default:
                break;
        }

        this.setMark(riseNode, data.prefabPath, offset, data.fontPath, (label) => {
            this.riseNow(target, riseNode, hurtType, str, label, offset);
        }, data.bjFontPath, data.markPath, data.idDefault);
    }

    /** 是否天仙升仙 */
    private isShengXian(otherData: any) {
        if (otherData) {
            const playerinfo = ActionConfig.I.getUser(otherData);
            if (playerinfo && (playerinfo.Show_PetASX_Grade > 0 || playerinfo.Show_PetASX_Level > 0)) {
                return true;
            }
        }
        return false;
    }

    /** 是否战神星变 */
    private isXBActive(otherData: any) {
        if (otherData) {
            const playerinfo = ActionConfig.I.getUser(otherData);
            if (playerinfo && playerinfo.Cur_WarriorGC_Active) {
                return true;
            }
        }
        return false;
    }

    /** 是否仙童潜能 */
    private isCNActive(otherData: any) {
        if (otherData) {
            const playerinfo = ActionConfig.I.getUser(otherData);
            if (playerinfo && (playerinfo.Cur_KidsQN_Active || playerinfo.Cur_KidsQN_Girl_Active)) {
                return true;
            }
        }
        return false;
    }

    /** 偃甲是否铸造 */
    private isZhuZao(otherData: any) {
        if (otherData) {
            const playerinfo = ActionConfig.I.getUser(otherData);
            if (playerinfo && (playerinfo.Cur_KidsQN_Active || playerinfo.Cur_KidsQN_Girl_Active)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取攻击mark资源数据
     * @param currAtkType 攻击类型
     * @param otherData 玩家数据
     * @param isCrit 是否暴击类型CLIENT_SHOW_TYPE.CRIT
     * @returns object 资源路径数据
     */
    private getAttackMarkResData(currAtkType: number, otherData: any, isCrit = false) {
        const data: MarkRes = js.createMap(true);
        switch (currAtkType) {
            case UNIT_TYPE.Pet:
                data.fontPath = 'prefabs/e/zhandoupiaozi/chongFont';
                data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/pg_chong';
                data.bjFontPath = 'prefabs/e/zhandoupiaozi/zhandouimg/baoji_chong';
                break;
            case UNIT_TYPE.PetA:
                if (this.isShengXian(otherData)) {
                    data.fontPath = 'prefabs/e/zhandoupiaozi/sxbjFont';
                    data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/font_shengxian';
                    data.bjFontPath = 'prefabs/e/zhandoupiaozi/zhandouimg/baoji_shengxian';
                } else {
                    data.fontPath = 'prefabs/e/zhandoupiaozi/xianFont';
                    data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/pg_xian';
                    data.bjFontPath = 'prefabs/e/zhandoupiaozi/zhandouimg/baoji_xian';
                }
                break;
            case UNIT_TYPE.Warrior:
                if (this.isXBActive(otherData)) {
                    data.fontPath = 'prefabs/e/zhandoupiaozi/marsSBFont';
                    data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/font_xingbian';
                    data.bjFontPath = 'prefabs/e/zhandoupiaozi/zhandouimg/font_baoji2';
                } else {
                    data.fontPath = 'prefabs/e/zhandoupiaozi/bjZiFont';
                    data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/pg_zhan';
                }
                break;
            case UNIT_TYPE.SoulBoy:
                if (this.isCNActive(otherData)) {
                    data.fontPath = 'prefabs/e/zhandoupiaozi/baoJiTFont';
                    data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/pg_tongq';
                } else {
                    data.fontPath = 'prefabs/e/zhandoupiaozi/tongFont';
                    data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/pg_tong';
                }
                data.bjFontPath = 'prefabs/e/zhandoupiaozi/zhandouimg/baoji_tong';
                break;
            case UNIT_TYPE.YanJia:
                if (this.isZhuZao(otherData)) {
                    data.fontPath = 'prefabs/e/zhandoupiaozi/zjbjFont';
                    data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/font_zhujia';
                    data.bjFontPath = 'prefabs/e/zhandoupiaozi/zhandouimg/baoji_zhujia';
                } else {
                    data.fontPath = 'prefabs/e/zhandoupiaozi/yanFont';
                    data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/pg_yan';
                    data.bjFontPath = 'prefabs/e/zhandoupiaozi/zhandouimg/baoji_yan';
                }
                break;
            case UNIT_TYPE.Hero:
                data.fontPath = 'prefabs/e/zhandoupiaozi/yingFont';
                data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/pg_ying';
                data.bjFontPath = 'prefabs/e/zhandoupiaozi/zhandouimg/baoji_ying';
                break;
            case UNIT_TYPE.Alien:
                data.fontPath = 'prefabs/e/zhandoupiaozi/yiFont';
                data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/pg_yi';
                data.bjFontPath = 'prefabs/e/zhandoupiaozi/zhandouimg/baoji_yi';
                break;
            case UNIT_TYPE.Dragon:
                data.fontPath = 'prefabs/e/zhandoupiaozi/slFont';
                data.markPath = 'prefabs/e/zhandoupiaozi/zhandouimg/pg_long';
                data.bjFontPath = 'prefabs/e/zhandoupiaozi/zhandouimg/baoji_long';
                break;
            default:
                data.fontPath = 'prefabs/e/zhandoupiaozi/attackFont';
                if (isCrit) {
                    data.prefabPath = 'prefabs/e/zhandoupiaozi/baoji';
                } else {
                    data.prefabPath = 'prefabs/e/zhandoupiaozi/diaoxue';
                }
                break;
        }
        if (isCrit) {
            data.idDefault = false;
            data.prefabPath = data.prefabPath || 'prefabs/e/zhandoupiaozi/baoji_ts';
        } else {
            data.idDefault = true;
            data.bjFontPath = undefined;
            data.prefabPath = data.prefabPath || 'prefabs/e/zhandoupiaozi/diaoxue_ts';
        }
        return data;
    }

    private setMark(riseNode: Node, prefabPath: string, offset: Vec2, fontPath: string, callback: (label) => void, bjFontPath: string, markPath: string, idDefault = false) {
        UIManager.I.showPrefab(riseNode, prefabPath, BundleType.gamelogic, (e, n) => {
            let label: Node;
            if (idDefault) {
                label = this.initPrefab(n, riseNode, offset, 'attackFont/ziti');
            } else {
                label = this.initPrefab(n, riseNode, offset, 'New Node/bjZiFont');
            }

            ResManager.I.load(fontPath, Font, (e, f: Font) => {
                if (label) {
                    label.active = true;
                    UtilsCC.setFont(label, f);
                    callback.call(this, label);
                }
            }, this, undefined, BundleType.gamelogic);
            const dtpz: Node = UtilsCC.getNodeAttr(riseNode, 'dtpz');
            if (bjFontPath) {
                UtilsCC.setSprite('New Node/font_baoji', dtpz, bjFontPath);
            }
            if (dtpz && markPath) {
                if (idDefault) {
                    UtilsCC.setSprite('attackFont/zi', dtpz, markPath, () => {
                        if (fontPath) {
                            callback.call(this);
                        }
                    });
                } else {
                    UtilsCC.setSprite('New Node/pg_zhan', dtpz, markPath, () => {
                        if (fontPath) {
                            callback.call(this);
                        }
                    });
                }
            }
        }, this);
    }

    /** 显示文字prefab */
    private showStrPrefab(riseNode: Node, path: string, target: FightEntity, hurtType: number, offset: Vec2, str: string, labelname?: string, scale = 1, callback?: (n: Node, l?: Node) => void) {
        UIManager.I.showPrefab(riseNode, path, BundleType.gamelogic, (e, n) => {
            let label: Node;
            if (Utils.isNullOrUndefined(labelname)) {
                n.name = 'dh';
                n.setPosition(offset.x, offset.y);
            } else {
                label = this.initPrefab(n, riseNode, offset, labelname, scale);
            }
            if (callback) {
                callback(n, label);
            }
            this.riseNow(target, riseNode, hurtType, str, label, offset);
            if (hurtType === CLIENT_SHOW_TYPE.HERO_WORLD) {
                riseNode.setPosition(0, riseNode.position.y);
            }
        }, this);
    }

    /** 幻灵技能额外设置 */
    private hlSkillNameEx(n: Node, hlID: number) {
        let url = `prefabs/e/zhandoupiaozi/zhandouimg/hl_mesh_${hlID < 10 ? `0${hlID}` : hlID}`;
        UtilsCC.setSpriteLocal('img_hl01', n, url, undefined, BundleType.gamelogic);
        url = `prefabs/e/zhandoupiaozi/zhandouimg/hl_font_0${hlID > 5 ? hlID - 5 : hlID}`;
        UtilsCC.setSpriteLocal('cygq', n, url, (sp) => {
            UtilsCC.setSpriteFrame('font_cygq', n, sp.spriteFrame);
        }, BundleType.gamelogic);
        url = `prefabs/e/zhandoupiaozi/zhandouimg/hl_bg_0${hlID > 5 ? hlID - 5 : hlID}`;
        UtilsCC.setSpriteLocal('img_cygqdi', n, url, undefined, BundleType.gamelogic);
    }

    private getNormallSkillPrefab() {
        let sexPath = 'prefabs/e/zhandoupiaozi/jinengNan';
        if (EntityManager.I.getPlayerAvatar().Info.Sex === 2) {
            sexPath = 'prefabs/e/zhandoupiaozi/jinengNv';
        }
        return sexPath;
    }

    /** 显示技能名字 */
    private showSkillName(target: FightEntity, riseNode: Node, hurtType: number, currAtkType: number, offset: Vec2, str, hlID: number, otherData: any) {
        if (hlID) {
            this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/hl_ani_t', target, hurtType, offset, str, undefined, undefined, (n) => {
                this.hlSkillNameEx(n, hlID);
            });
        } else if (currAtkType === UNIT_TYPE.Dragon) {
            offset.x = 195;
            if (target.position.y < 0) {
                offset.x = -220;
            }
            this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/sl_skill', target, hurtType, offset, str, '', 1, (n, l) => {
                this.dragonSkillNameEx(riseNode, otherData);
            });
        } else {
            this.showStrPrefab(riseNode, this.getNormallSkillPrefab(), target, hurtType, offset, str, 'New Node/sklNamFont', 1.2);
        }
    }

    private dragonSkillNameEx(riseNode: Node, otherData: any) {
        const slSkill: Node = riseNode['dtpz'];
        if (otherData) {
            const skill: Cfg_Skill = otherData[0];
            const unitDat: FightUnit = otherData[1];
            const isDBTX = otherData[2];
            let skillHead: string;
            let skillName: string;
            let skillBg: string;
            if (skill) {
                const skill_name_res = this.getSkillNameRes(skill.SkillId);
                if (skill_name_res) {
                    skillName = skill_name_res.name;
                    skillBg = skill_name_res.bg;
                }
                if (isDBTX) {
                    skillName = 'sl_font_dbtx';
                }
                if (skillName) {
                    UtilsCC.setSpriteAndEnable('cygq', slSkill, `prefabs/e/zhandoupiaozi/zhandouimg/${skillName}`);
                    UtilsCC.setSpriteAndEnable('font_cygq', slSkill, `prefabs/e/zhandoupiaozi/zhandouimg/${skillName}`);
                    UtilsCC.setSpriteAndEnable('img_cygqdi', slSkill, `prefabs/e/zhandoupiaozi/zhandouimg/${skillBg}`);
                }
            }
            if (unitDat) {
                const playerinfo = ActionConfig.I.getUser(unitDat);
                if (playerinfo.Show_SL_Skin) {
                    const skin = playerinfo.Show_SL_Skin.toString();
                    let animid: number = Config.getI(Config.T.Cfg_Skin).selectByKey(skin, 'AnimId');
                    animid = animid || Config.getI(Config.T.Cfg_SkinGrade).selectByKey(skin, 'AnimId');
                    skillHead = `prefabs/e/zhandoupiaozi/zhandouimg/sl_mesh_${animid}`;
                } else {
                    let animid: number = Config.getI(Config.T.Cfg_SL).selectByKey(playerinfo.SL_Grade.toString(), 'AnimId');
                    const sl_animid_str = animid.toString();
                    animid = Config.getI(Config.T.Cfg_Skin).selectByKey(sl_animid_str, 'AnimId');
                    animid = animid || Config.getI(Config.T.Cfg_SkinGrade).selectByKey(sl_animid_str, 'AnimId');
                    skillHead = `prefabs/e/zhandoupiaozi/zhandouimg/sl_mesh_${animid}`;
                }
                UtilsCC.setSprite('img_hl01', slSkill, skillHead);
            }
        }
    }

    /** 显示护盾伤害 */
    private showShieldHurt(target: FightEntity, riseNode: Node, hurtType: number, offset: Vec2, str: string) {
        // 一个类型，两种表现，只能重置了
        for (let i = 0, n = riseNode.children[0].children.length; i < n; i++) {
            let node = riseNode.children[0].children[i];
            node.destroyAllChildren();
            node.destroy();
        }
        riseNode.destroyAllChildren();
        riseNode.destroy();
        // let outLabel = null;
        // 蛋壳防御飘字,吸收和抵抗
        if (Number(str) > 0) {
            // 吸收
            this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/xishou', target, hurtType, offset, str, 'wenzishuzi/combFont');
        } else {
            // 抵抗
            this.showStrPrefab(riseNode, 'prefabs/e/zhandoupiaozi/dikangshanghai', target, hurtType, offset, str);
        }
    }
}
