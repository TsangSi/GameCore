/*
 * @Author: hrd
 * @Date: 2022-11-02 16:20:29
 * @Description: 残影动画
 *
 */

import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import EntityBase from '../../entity/EntityBase';

const { ccclass, property } = cc._decorator;

@ccclass
export class GhostAnim extends BaseCmp {
    private NdGhostList: cc.Node[] = [];
    private NdTarget: cc.Node = null;
    private CameraGhost: cc.Camera = null;
    private count: number = 5;

    protected onLoad(): void {
        // this.CameraGhost = new cc.Camera();
        this.schedule(this.ghostFollow, 0.1, cc.macro.REPEAT_FOREVER);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.unschedule(this.ghostFollow);
    }

    public init(targetNode: cc.Node, sf: cc.SpriteFrame, scaleX: number): void {
        this.NdTarget = targetNode;
        if (!this.NdGhostList.length) {
            for (let i = 0; i < this.count; i++) {
                const ghost: cc.Node = new cc.Node();
                this.NdTarget.parent.addChild(ghost);
                const spr = ghost.addComponent(cc.Sprite);
                spr.trim = false;
                spr.sizeMode = cc.Sprite.SizeMode.RAW;
                spr.spriteFrame = sf;
                ghost.zIndex = this.NdTarget.zIndex - i;
                // ghost.scaleY = -1;
                ghost.opacity = 100 - i * 15;
                this.NdGhostList.push(ghost);
                ghost.active = false;
                ghost.position = this.NdTarget.position;
                ghost.scaleX = scaleX;
            }
        } else {
            for (let i = 0; i < this.count; i++) {
                const ghost: cc.Node = this.NdGhostList[i];
                const spr = ghost.addComponent(cc.Sprite);
                spr.spriteFrame = sf;
                ghost.zIndex = this.NdTarget.zIndex - i;
                ghost.active = false;
                ghost.position = this.NdTarget.position;
            }
        }
    }

    public init2(targetNode: EntityBase): void {
        this.NdTarget = targetNode;
        if (!this.NdGhostList.length) {
            for (let i = 0; i < this.count; i++) {
                const ghost = targetNode.cloneEntity();
                ghost.pausePlay();
                this.NdTarget.parent.addChild(ghost);
                ghost.zIndex = this.NdTarget.zIndex - i;
                ghost.opacity = 200 - i * 15;
                ghost.active = false;
                ghost.position = this.NdTarget.position;
                ghost.scaleX = targetNode.getBodyScaleX();
                this.NdGhostList.push(ghost);
            }
        }
    }

    public upEntityGhost(sf: cc.SpriteFrame): void {
        for (let i = 0; i < this.count; i++) {
            const ghost: cc.Node = this.NdGhostList[i];
            const spr = ghost.addComponent(cc.Sprite);

            spr.spriteFrame = sf;
            ghost.zIndex = this.NdTarget.zIndex - i;
            ghost.active = false;
            ghost.position = this.NdTarget.position;
        }
    }

    public clearGhost(): void {
        this.NdGhostList.forEach((ghost, i) => {
            ghost.destroy();
        });
        this.NdGhostList = [];
    }

    private ghostFollow() {
        if (!cc.isValid(this.NdTarget)) return;
        let sss = false;
        this.NdGhostList.forEach((ghost, i) => {
            const dis = ghost.position.sub(this.NdTarget.position).mag();
            if (dis < 0.5) {
                ghost.active = false;
                sss = false;
                return;
            }
            sss = true;
            ghost.active = true;
            // const targetNode: EntityBase = this.NdTarget as EntityBase;
            // const c = ghost as EntityBase;
            // // eslint-disable-next-line dot-notation
            // c.playAction(targetNode['_actionType'], targetNode['_actorDir']);
            // ghost.scaleX = targetNode.getBodyScaleX();
            ghost.stopAllActions();
            ghost.runAction(cc.moveTo(i * 0.04 + 0.02, this.NdTarget.x, this.NdTarget.y));
        });

        // if (sss === false) {
        //     this.clearGhost();
        // }
    }
}
