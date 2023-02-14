import {
 AnimationClip, Tween, tween, Vec3,
} from 'cc';
import ActionBase from './ActionBase';
import { ACTION_TYPE } from './ActionConfig';
import Avatar from './MapAvatar';

export class FightEntity extends Avatar {
    /** 是否保护者 */
    public isProtect = false;
    /** 外部遮罩，暂时异兽用到 */
    public otherMask: ActionBase;
    /** 怒气值 */
    private curAnger = 0;
    /** 吞噬死亡状态 */
    public ghostPart: FightEntity;
    /** 战斗中的I */
    public fightI = 0;
    /** 保护者记录 原来的坐标 */
    public protectXY: Vec3;
    /** 被保护者记录 保护者P位置 */
    public protectPos = 0;

    public isUsed = false;

    getResID() {
        if (this.Body) {
            return this.Body.resID.toString();
        }
        return '';
    }

    initAnim(resID, resType: string, dir?: number) {
        if (!this.Body) {
            this.Body = new ActionBase(resID, resType, dir);
            this.Body.play();
            this.Body.layer = this.layer;
            this.Body.name = 'Monster';
            this.addChild(this.Body);
        } else {
            this.Body.updateShowAndPlay(resID, resType, dir);
        }
    }

    eatName(value?: string) {
        if (value) {
            console.log('吞噬实体:', value);
        }
    }

    addOtherMask(b = false) {
        if (this.otherMask && this.otherMask.isValid) {
            if (!this.otherMask.parent) {
                this.addChild(this.otherMask);
            }
            this.otherMask.active = b;
        }
    }

    setOtherMask(ab: ActionBase) {
        if (!this.otherMask || this.otherMask.isValid) {
            this.otherMask = ab;
        }
    }

    /**
     * 设置怒气值
     * @param value 当前怒气值
     * @param max 最大值,默认5
     */
    setAnger(value: number, max: number) {
        // let sheildBar = this.roleAttr.getChildByName("SheildBar");
        // if (!sheildBar) return;
        // let width = sheildBar.width / max;
        // let sheild = this.roleAttr.getChildByName("Sheild");
        // if (!value || !max) {
        //     this.curAnger = 0;
        //     sheildBar.active = false;
        //     sheild.active = false;
        //     return;
        // }
        this.curAnger = value;
        console.log('this.curAnger, value怒气值=', this.curAnger, value);
        // let tempBar = sheild.getChildByName("bar");
        // if (!tempBar) return;
        // tempBar.width = width;
        // // }, 200);
        // sheild.active = true;
        // sheildBar.active = true;
        // if (sheild.active) {
        //     for (let i = 1; i < max; i++) {
        //         let bar = sheild.getChildByName("bar" + i);
        //         if (value > i) {
        //             if (bar) {
        //                 bar.opacity = 255;
        //             } else {
        //                 bar = instantiate(tempBar);
        //                 sheild.addChild(bar, i);
        //                 bar.name = 'bar' + i;
        //             }
        //         } else {
        //             if (!bar) {
        //                 bar = instantiate(tempBar);
        //                 sheild.addChild(bar, i);
        //                 bar.name = 'bar' + i;
        //             }
        //             bar.opacity = 0;
        //         }
        //         if (bar) {
        //             bar.width = width;
        //         }
        //     }
        // }
    }

    /**
     * 添加战斗中吞噬死亡状态
     * @param isShow 是否显示灵魂态，默认显示
     */
    addAiaGhost(isShow = true) {
        if (!this.ghostPart || !this.ghostPart.isValid) {
            return;
        }
        if (isShow) {
            // this.setAnimaArray(false);
            if (this.ghostPart) {
                if (!this.ghostPart.parent) {
                    this.parent.addChild(this.ghostPart);
                }
                this.ghostPart.active = true;
                this.active = false;
            } else {
                return;
            }
        } else {
            // this.setAnimaArray(true);
            if (this.ghostPart) {
                this.ghostPart.active = false;
                this.active = true;
            }
            return;
        }

        this.ghostPart.hidePart = true;
        this.ghostPart.setPosition(this.position.x, this.position.y);
        // this.ghostPart.zIndex = this.zIndex;

        // if (this.role.resourceDirect > 5) {
        //     this.ghostPart.zIndex = this.zIndex
        //     // this.ghostPart.x = this.lenX
        //     // this.ghostPart.y = -this.lenY
        // } else {
        //     this.ghostPart.zIndex = 0
        //     // this.ghostPart.x = -this.lenX
        //     // this.ghostPart.y = this.lenY
        // }
    }

    set hidePart(isHide: boolean) {
        if (isHide) {
            this.setHealthBarActive(false);
            this.setNameActive(false);
        } else {
            this.setHealthBarActive(true);
            this.setNameActive(true);
        }
    }

    setDeath(callback: () => void, target: any) {
        this.Body.playAction(ACTION_TYPE.ATTACK, undefined, AnimationClip.WrapMode.Normal);
        this.Body.setStartCallback(() => {
            // eslint-disable-next-line dot-notation
            tween(this.Body).delay(0.2).to(0.6, { opacity: 3 }).call(() => {
                if (this.Body) {
                    Tween.stopAllByTarget(this.Body);
                    this.active = false;
                    if (callback) {
                        callback.call(target);
                    }
                }
                // eslint-disable-next-line newline-per-chained-call
            }).start();
            tween(this.Body).delay(0.133).by(2, { opacity: 0 }).start();
        });
    }

    setSufferAttack() {
        let currAct: ACTION_TYPE = null;
        let nextAct: ACTION_TYPE = null;
        // if (this.isRide) {
        //     currAct = ACTION_TYPE.RIDE_ATTACK;
        //     nextAct = ACTION_TYPE.RIDE_STAND;
        // } else {
        currAct = ACTION_TYPE.ATTACK;
        nextAct = ACTION_TYPE.STAND;
        // }
        this.Body.playAction(currAct);
        this.Body.setStartCallback(() => {
            setTimeout(() => {
                if (this.Body && this.Body.isValid) {
                    this.Body.playAction(nextAct);
                }
            }, 600);
        });
    }

    cloneAia(): FightEntity {
        const myAia = new FightEntity(10001);
        myAia.initAnim(this.Body.resID, this.Body.resType, this.Body.resDirect);
        // this.role.resourceID, this.role.resourceType, this.role.resourceDirect, this.role.resourceAction

        // const data: { weaponResID?: number, horseResID?: number, circleResID?: number, wingResID?: number, preciousResID?: number; } = {};

        // data.weaponResID = this.weapon ? Number(this.weapon.resourceID) : 0;
        // data.horseResID = this.horse ? Number(this.horse.resourceID) : 0;
        // data.circleResID = this.circle ? Number(this.circle.resourceID) : 0;
        // data.wingResID = this.wing ? Number(this.wing.resourceID) : 0;
        // data.preciousResID = this.trump ? Number(this.trump.resourceID) : 0;

        // myAia.initAnimaData(data);
        return myAia;
    }
}
