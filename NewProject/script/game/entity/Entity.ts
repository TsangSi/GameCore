/*
 * @Author: hrd
 * @Date: 2022-05-12 16:59:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-28 14:57:50
 * @FilePath: \SanGuo2.4\assets\script\game\entity\Entity.ts
 * @Description:
 *
 */

import { ACTION_DIRECT, ANIM_TYPE, ACTION_TYPE } from '../base/anim/AnimCfg';
import { ResMgr } from '../../app/core/res/ResMgr';
import { UI_PATH_ENUM } from '../const/UIPath';
import ActorNickBox from './ActorNickBox';
import EntityBase from './EntityBase';
import ActorBloodBox from './ActorBloodBox';
import ActorChallenge from './ActorChallenge';
import { UtilGame } from '../base/utils/UtilGame';
import { EntityChallengeState } from './EntityConst';

export default class Entity extends EntityBase {
    /** 场景角色预制 */
    private _playerNode: cc.Node = null;
    /** 昵称 */
    private _nickBoxCom: ActorNickBox = null;
    /** 血槽 */
    private _bloodBoxCom: ActorBloodBox = null;
    /** 喊话气泡框 */
    private _sprChat: cc.Node = null;
    /** 挑战及复活 */
    private _ndChallenge: cc.Node = null;

    public constructor(
        resId: number | string,
        resType: ANIM_TYPE,
        dir: ACTION_DIRECT = ACTION_DIRECT.DOWN,
        actType: ACTION_TYPE = ACTION_TYPE.STAND,
        wrapMode: number = cc.WrapMode.Loop,
        isFight: boolean = false,
    ) {
        super(resId, resType, dir, actType, wrapMode, isFight);
        this.name = 'Entity';
        this.initPlayerPrefab();
    }

    private initPlayerPrefab() {
        ResMgr.I.showPrefab(UI_PATH_ENUM.player, null, (err: any, node: cc.Node) => {
            if (err) {
                //
            } else if (this.isValid) {
                this._playerNode = node;
                this.addChild(node);
                this.initLayout();
                // 点击实体
                if (this._needClick) {
                    const NdClick = this._playerNode.getChildByName('NdClick');
                    NdClick.targetOff(this);
                    UtilGame.Click(NdClick, this._addChallenge, this);
                }
            } else {
                node.destroy();
                console.warn('加载完player后，其父节点已被移除了');
            }
        });
    }

    private initLayout() {
        const nickBox = this._playerNode.getChildByName('ActorNickBox');
        this._nickBoxCom = nickBox.getComponent(ActorNickBox);

        const bloodBox = this._playerNode.getChildByName('ActorBloodBox');
        this._bloodBoxCom = bloodBox.getComponent(ActorBloodBox);

        const bodyShadow = this._playerNode.getChildByName('BodyShadow');
        bodyShadow.active = this._showShadow;

        this._sprChat = this._playerNode.getChildByName('SprChat');
        this._sprChat.active = false;

        this.setShadow();
    }

    /** 获取动作的长度 */
    public getActionLength(actioname: string): number {
        return this.getBodyFrameLength(actioname);
    }

    /** 设置名字 */
    public setName(v: string, hideName: boolean = false): void {
        if (this._nickBoxCom && !hideName) {
            this._nickBoxCom.node.active = true;
            this._nickBoxCom.setName(v);
        }
    }

    /** 显示身体剪影 */
    private _showShadow: boolean = false;
    public showbodyShadow(v: boolean): void {
        this._showShadow = v;
        if (this._playerNode) {
            const bodyShadow = this._playerNode.getChildByName('BodyShadow');
            if (bodyShadow) bodyShadow.active = v;
        }
    }

    /** 角色喊话 */
    public setChat(strArr: string[]): void {
        if (!strArr.length) return;
        if (this._sprChat.getChildByName('Label') == null) return;
        this.showChat(strArr);
    }
    private autoSetSayChatDir() {
        const tempPos: cc.Vec2 = new cc.Vec2();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, dot-notation
        this._playerNode['getWorldPosition'](tempPos);

        const s = cc.view.getDesignResolutionSize();
        if (tempPos.x > s.width * 0.5) { // 右边
            this._sprChat.scaleX = 1;
            this._sprChat.x *= -1;
            this._sprChat.getChildByName('Label').scaleX = 1;
        } else { // 左边
            this._sprChat.scaleX = -1;
            this._sprChat.getChildByName('Label').scaleX = -1;
            this._sprChat.x = Math.abs(this._sprChat.x);
        }
    }
    private showChat(strArr: string[]): void {
        const lbl: cc.Label = this._sprChat.getChildByName('Label').getComponent(cc.Label);
        const str = strArr.shift();
        lbl.string = str;
        this._sprChat.active = false;
        const t1 = cc.tween(this._sprChat).delay(0.8);
        const t2 = cc.tween(this._sprChat).call(() => {
            this._sprChat.active = true;
            this.autoSetSayChatDir();
        });
        cc.tween(this._sprChat).sequence(t1, t2).start();
        this._nickBoxCom.scheduleOnce(() => {
            if (strArr.length === 0) {
                this._sprChat.active = false;
            } else {
                this.showChat(strArr);
            }
        }, 4);
    }

    public getBloodBoxCom(): cc.Node {
        if (this._bloodBoxCom) {
            return this._bloodBoxCom.node;
        }
        return null;
    }

    /** 显示血条 */
    public showBloodBox(v: boolean): void {
        if (this._bloodBoxCom) this._bloodBoxCom.node.active = v;
    }

    public setHpBar(v: number): void {
        if (this._bloodBoxCom) {
            this._bloodBoxCom.setHpBar(v);
        }
    }

    public getBuffLayer(): cc.Layout {
        if (!this._bloodBoxCom) {
            return null;
        }
        return this._bloodBoxCom.getBuffLayer();
    }

    public setUserId(userId: number): void {
        this._userId = userId;
    }

    /** 动态加载挑战及复活节点 */
    private _userId: number = 0;
    private _state: EntityChallengeState = EntityChallengeState.Normal;
    private _isChallenge: boolean = false;
    private _needClick: boolean = false;

    private _callback: (uuid: number) => void = null;
    public showChallenge(userId: number, state: EntityChallengeState, callback: (uuid: number) => void = null): void {
        this._userId = userId;
        this._state = state;
        this._needClick = true;
        if (callback) {
            this._callback = callback;
        }

        this._addChallenge();

        if (this._playerNode) {
            const NdClick = this._playerNode.getChildByName('NdClick');
            NdClick.targetOff(this);
            UtilGame.Click(NdClick, () => {
                this._isChallenge = true;
                this._addChallenge();
            }, this);
        } else {
            console.log('预制还没加载完');
        }
    }

    /** 改变其死亡还是复活状态 */
    public setState(state: EntityChallengeState): void {
        if (this._ndChallenge) {
            this._ndChallenge.getComponent(ActorChallenge).setState(state);
        }
    }

    /** 改变是否显示挑战按钮状态 */
    public setChallenge(isChallenge: boolean): void {
        if (this._ndChallenge) {
            this._ndChallenge.getComponent(ActorChallenge).setChallenge(isChallenge);
        }
    }

    private _addChallenge() {
        if (this._playerNode) {
            if (this._ndChallenge) {
                this._ndChallenge.getComponent(ActorChallenge).setData(this._userId, this._isChallenge, (uuid: number) => {
                    if (this._callback) {
                        this._callback.call(this, this._userId);
                    }
                });
            } else {
                ResMgr.I.showPrefabOnce(UI_PATH_ENUM.ActorChallenge, this._playerNode, (err, node) => {
                    this._ndChallenge = node;
                    node.getComponent(ActorChallenge).setData(this._userId, this._isChallenge, (uuid: number) => {
                        if (this._callback) {
                            this._callback.call(this, this._userId);
                        }
                    });
                });
            }
        }
    }

    /**
     * 销毁
     */
    public release(): void {
        super.release(true);
        this._playerNode?.destroy();
        this._sprChat?.destroy();
        this._ndChallenge?.destroy();
        if (this.isValid) {
            this.destroy();
        }
    }
}
