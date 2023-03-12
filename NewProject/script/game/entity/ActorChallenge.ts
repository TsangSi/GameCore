/*
 * @Author: kexd
 * @Date: 2022-11-01 17:08:12
 * @FilePath: \SanGuo2.4\assets\script\game\entity\ActorChallenge.ts
 * @Description: 挑战 及 状态
 *
 */

import BaseCmp from '../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../base/utils/UtilGame';
import { EntityChallengeState } from './EntityConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ActorChallenge extends BaseCmp {
    @property(cc.Node)
    private BtnSure: cc.Node = null;
    @property(cc.Node)
    private BtnCancel: cc.Node = null;
    @property(cc.Node)
    private NdState: cc.Node = null;

    private _uuid: number = 0;
    private _state: EntityChallengeState = EntityChallengeState.Normal;
    private _isChallenge: boolean = false;
    private _callback: (uuid: number) => void = null;

    protected start(): void {
        super.start();

        UtilGame.Click(this.BtnSure, () => {
            if (this._callback) {
                this._callback.call(this, this._uuid);
            }
        }, this);

        UtilGame.Click(this.BtnCancel, () => {
            this.setChallenge(false);
        }, this);
    }

    /**
     *
     * @param uuid 实体id
     * @param isRelive 是否复活中
     * @param callback 点击按钮的回调
     */
    public setData(uuid: number, isChallenge: boolean, callback: (uuid: number) => void = null): void {
        this._uuid = uuid;
        this.setChallenge(isChallenge);
        if (callback) {
            this._callback = callback;
        }
    }

    public setState(state: EntityChallengeState): void {
        if (state === EntityChallengeState.Die) {
            console.log('---死亡');
        } else {
            console.log('---复活');
        }

        this._state = state;
        // 死亡状态下就显示复活中
        this.NdState.active = state === EntityChallengeState.Die;
    }

    public setChallenge(isChallenge: boolean): void {
        this._isChallenge = isChallenge;
        // 挑战状态下就显示按钮
        this.BtnSure.active = isChallenge;
        this.BtnCancel.active = isChallenge;
    }
}
