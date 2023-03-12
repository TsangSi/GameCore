/*
 * @Author: myl
 * @Date: 2022-09-15 10:47:52
 * @Description:
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { AssetType } from '../../../../app/core/res/ResConst';
import { RES_ENUM } from '../../../const/ResPath';
import { ICloudInfo } from '../UtilGameLevel';

const { ccclass, property } = cc._decorator;

@ccclass
export class GameLevelArenaItem extends cc.Component {
    /** 添加云朵到当前区域的itemNode中 */
    public setClouds(clouds: ICloudInfo[]): void {
        //
    }

    public setCloudsConfig(str: string): void {
        const clouds = str.split('|');
        for (let i = 0; i < clouds.length; i++) {
            if (clouds[i].length > 0) {
                const cloud = clouds[i].split(',');
                const nd = new cc.Node();
                const spr = nd.addComponent(cc.Sprite);
                UtilCocos.LoadSpriteFrameRemote(spr, `${RES_ENUM.GameLevel}${cloud[0]}`, AssetType.SpriteFrame);
                nd.setPosition(parseInt(cloud[1]), parseInt(cloud[2]));
                nd.parent = this.node;
            }
        }
    }

    /** 播放当前界面的动画 */
    public playAnim(cb: () => void): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        // const opacityComponent = this.node.getComponent(UIOpacityComponent) || this.node.addComponent(UIOpacityComponent);
        cc.tween(this.node)
            .delay(0.1)
            .to(1, { opacity: 0 })
            .call(() => {
                this.scheduleOnce(() => {
                    if (cb) cb();
                    this.node.removeFromParent();
                }, 1);
            })
            .start();
        //     if (!opacityComponent) {
        //         opacityComponent = child.addComponent(UIOpacityComponent);
        //     }
        // let delay = 0;
        // for (let i = 0; i < this.node.children.length; i++) {
        //     const child: cc.Node = this.node.children[i];
        //     let opacityComponent = child.getComponent(UIOpacityComponent);
        //     if (!opacityComponent) {
        //         opacityComponent = child.addComponent(UIOpacityComponent);
        //     }
        //     delay += 0.1;
        //     tween(opacityComponent)
        //         .delay(delay)
        //         .to(1, { opacity: 0 })
        //         .call(() => {
        //             // child.destroy();
        //         })
        //         .start();
        // }
        // this.scheduleOnce(() => {
        //     cb();
        // }, delay + 1);
    }
}
