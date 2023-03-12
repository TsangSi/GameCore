/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/*
 * @Author: hrd
 * @Date: 2022-12-30 12:16:16
 * @Description: 角色实体动画状态类
 *
 */

import { ACTION_DIRECT, ACTION_TYPE } from '../../base/anim/AnimCfg';
import { AnimCmp } from '../../base/anim/AnimCmp';
import EntityBase from '../EntityBase';
import { AtkActionFrame, EntityAcionName } from '../EntityConst';

export class EntityAnimState {
    private mEntity: EntityBase = null;

    public init(entity: EntityBase): void {
        this.mEntity = entity;
    }

    /** 跑动 */
    public run(dir?: ACTION_DIRECT): void {
        this.mEntity.playAction(ACTION_TYPE.RUN, dir);
    }

    /** 待机 */
    public stand(dir?: ACTION_DIRECT): void {
        this.mEntity.playAction(ACTION_TYPE.STAND, dir);
    }

    /** 受击 */
    public hit(): void {
        const bodyAnim = this.mEntity.getBodyAnim();
        const currAct: ACTION_TYPE = bodyAnim.resourceAction;
        // bodyAnim.gotoAndStop(ACTION_TYPE.ATTACK, AtkActionFrame.Hit, () => {
        //     const cmp = bodyAnim.getComponent(AnimCmp);
        //     if (cmp) {
        //         cmp.scheduleOnce(() => {
        //             bodyAnim.playAction(currAct);
        //         }, 0.2);
        //     }
        // }, this);

        this.mEntity.playAction(ACTION_TYPE.ATTACK, null, null, () => {
            // 编辑的技能播放完先切回待机动画
            const cmp = bodyAnim.getComponent(AnimCmp);
            if (cmp) {
                cmp.scheduleOnce(() => {
                    this.stand();
                }, 0.2);
            }
        }, this, null, EntityAcionName.hit);
    }

    /** 死亡 */
    public die(cb: () => void = null, ctx: any = null, isBlink: boolean = false): void {
        const bodyAnim = this.mEntity.getBodyAnim();
        bodyAnim.gotoAndStop(ACTION_TYPE.ATTACK, AtkActionFrame.Die, () => {
            // if (isBlink) {
            //     const t1 = cc.tween(bodyAnim)
            //         .hide()
            //         .delay(0.2)
            //         .show()
            //         .delay(0.2)
            //         .union()
            //         .repeat(2);
            //     const t2 = cc.tween(bodyAnim).call(() => {
            //         if (cb) {
            //             cb.call(ctx);
            //         }
            //     });
            //     cc.tween(bodyAnim).sequence(t1, t2).start();
            // }
        }, this);

        // this.mEntity.playAction(ACTION_TYPE.ATTACK, null, null, () => {
        //     // 编辑的技能播放完先切回待机动画
        //     if (isBlink) {
        //         const t1 = cc.tween(bodyAnim)
        //             .hide()
        //             .delay(0.2)
        //             .show()
        //             .delay(0.2)
        //             .union()
        //             .repeat(2);
        //         const t2 = cc.tween(bodyAnim).call(() => {
        //             if (cb) {
        //                 cb.call(ctx);
        //             }
        //         });
        //         cc.tween(bodyAnim).sequence(t1, t2).start();
        //     }
        // }, this, null, EntityAcionName.die);
    }

    /**
     * 攻击
     * @param dir 方向
     * @param endCB 攻击结束回调
     * @param ctx 回调上下文
     */
    public attack(dir?: ACTION_DIRECT, endCB?: () => void, ctx?: any): void {
        this.mEntity.playAction(ACTION_TYPE.ATTACK, dir, null, () => {
            if (endCB) {
                endCB.call(ctx);
            }
        });
    }

    /** 技能动作 */
    public skill(atkName: string, dir?: ACTION_DIRECT, endCB?: () => void, ctx?: any): void {
        this.mEntity.playAction(ACTION_TYPE.ATTACK, dir, null, () => {
            // 编辑的技能播放完先切回待机动画
            this.stand();
            if (endCB) {
                endCB.call(ctx);
            }
        }, this, null, atkName);
    }
}
