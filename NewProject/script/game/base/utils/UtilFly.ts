/*
 * @Author: kexd
 * @Date: 2022-09-20 16:41:33
 * @FilePath: \SanGuo2.4\assets\script\game\base\utils\UtilFly.ts
 * @Description: 飞道具效果
 *
 */
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../app/base/utils/UtilNum';
import { EffectMgr } from '../../manager/EffectMgr';
import { AssetType } from '../../../app/core/res/ResConst';
import UtilItem from './UtilItem';
import { RES_ENUM } from '../../const/ResPath';

export interface IFlyParam {
    parent: cc.Node,
    /** 起点位置相对于node的偏移 */
    radomStartX: number[],
    radomStartY: number[],
    /** 目标点 */
    endPos: cc.Vec2,
    /** 飞道具的数量 */
    count?: number,
    /** 飞的道具全部都是一样的 如 itemId: 1014002001, */
    itemId?: number
    /** 道具列表：将会取代count */
    itemList?: number[],
    /** 单个精灵物品 */
    spriteUrl?: string,
    /** 结束动画 */
    endAnim?: string,
    /** 延后xx毫秒秒播结束动画 */
    delayPlay?: number,
    /** 移动模式（对于不同数量不同速度或者需要多种移动路径需要额外定制） */
    moveMode?: number,
}

export default class UtilFly {
    public static fly(param: IFlyParam): void {
        let count: number = 0;
        if (param.itemList && param.itemList.length > 0) {
            count = param.itemList.length;
        } else if (param.count) {
            count = param.count;
        }
        for (let i = 0; i < count; i++) {
            const node = UtilCocos.NewNode(param.parent, [cc.Sprite]);
            node.name = 'fly';
            if (param.spriteUrl) {
                const sp = node.getComponent(cc.Sprite);
                sp.sizeMode = cc.Sprite.SizeMode.RAW;
                sp.type = cc.Sprite.Type.SIMPLE;
                UtilCocos.LoadSpriteFrameRemote(sp, param.spriteUrl, AssetType.SpriteFrame);
            } else if (param.itemId) {
                const item = UtilItem.NewItemModel(param.itemId);
                UtilItem.Show(node, item, { option: { needName: false } });
            } else if (param.itemList[i]) {
                const item = UtilItem.NewItemModel(param.itemList[i]);
                UtilItem.Show(node, item, { option: { needName: false } });
            }
            if (param.moveMode === 1) {
                this.moveToForBeaconWar(node, count - i, param.radomStartX, param.radomStartY, param.endPos);
            } else {
                this.moveTo(node, i, param.radomStartX, param.radomStartY, param.endPos);
            }
        }
        if (param.delayPlay && param.endAnim) {
            setTimeout(() => {
                EffectMgr.I.showAnim(param.endAnim, (node: cc.Node) => {
                    if (param.parent && param.parent.isValid) {
                        node.setPosition(param.endPos.x, param.endPos.y, 0);
                        param.parent.addChild(node);
                    }
                }, cc.WrapMode.Normal);
            }, param.delayPlay);
        }
    }

    /**
     * 挂机收益的飞金币和经验
     */
    public static flyOnHookAward(parent: cc.Node, endPos: cc.Vec2, endPosExp: cc.Vec2): void {
        // 金币
        UtilFly.fly({
            parent,
            radomStartX: [-50, 50],
            radomStartY: [-375],
            endPos,
            count: 25,
            spriteUrl: RES_ENUM.Item_4_H,
            delayPlay: 1333,
            endAnim: RES_ENUM.Onhook_Ui_8046,
        });

        // 经验
        UtilFly.fly({
            parent,
            radomStartX: [-50, 50],
            radomStartY: [-375],
            endPos: endPosExp,
            count: 25,
            spriteUrl: RES_ENUM.Item_1_H,
            delayPlay: 1600,
            endAnim: RES_ENUM.Onhook_Ui_8047,
        });
    }

    /** 常用移动模式：现在是主界面挂机的获得奖励 */
    private static moveTo(node: cc.Node, i: number, radomStartX: number[], radomStartY: number[], endPos: cc.Vec2): void {
        let x: number = 0;
        let y: number = 0;
        if (radomStartX.length > 1) {
            x = UtilNum.RandomInt(radomStartX[0], radomStartX[1]);
        } else {
            x = radomStartX[0];
        }
        if (radomStartY.length > 1) {
            y = UtilNum.RandomInt(radomStartY[0], radomStartY[1]);
        } else {
            y = radomStartY[0];
        }

        node.setPosition(x, y, 0);
        const t1 = cc.tween(node).to(i * 0.067, { position: new cc.Vec3(endPos.x, endPos.y, 0) }, { easing: 'quartInOut' });
        const t2 = cc.tween(node).call(() => {
            if (node && node.isValid) {
                node.destroy();
            }
        });
        cc.tween(node).sequence(t1, t2).start();
    }

    /** 移动模式2：烽火连城里的打死怪物的飘奖励 */
    private static moveToForBeaconWar(node: cc.Node, i: number, radomStartX: number[], radomStartY: number[], endPos: cc.Vec2): void {
        let x: number = 0;
        let y: number = 0;
        if (radomStartX.length > 1) {
            x = UtilNum.RandomInt(radomStartX[0], radomStartX[1]);
        } else {
            x = radomStartX[0];
        }
        if (radomStartY.length > 1) {
            y = UtilNum.RandomInt(radomStartY[0], radomStartY[1]);
        } else {
            y = radomStartY[0];
        }
        // 初始位置
        node.setPosition(x, y, 0);
        node.active = false;

        cc.tween(node)
            .delay(i * 0.1)
            .call(() => {
                node.active = true;
            })
            .to(0.2 + i * 0.005, { position: new cc.Vec3(x, y + 100, 0) }, { easing: 'quartInOut' })
            .to(0.3 + i * 0.01, { position: new cc.Vec3(endPos.x, endPos.y, 0) }, { easing: 'quartInOut' })
            .call(() => {
                if (node && node.isValid) {
                    node.destroy();
                }
            })
            .start();
    }
}
