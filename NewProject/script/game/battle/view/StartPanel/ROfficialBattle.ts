/*
 * @Author: hrd
 * @Date: 2022-11-02 11:46:49
 * @Description: 虎符威慑开场
 *
 */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { AssetType } from '../../../../app/core/res/ResConst';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { DynamicImage } from '../../../base/components/DynamicImage';

const { ccclass, property } = cc._decorator;

@ccclass
export class ROfficialBattle extends BaseCmp {
    // /** 敌方图标 */
    // @property(DynamicImage)
    // private EnemySprIcon: DynamicImage = null;
    // /** 敌方品质 */
    // @property(cc.Label)
    // private EnemyLabVal: cc.Label = null;
    // /** 我方图标 */
    // @property(DynamicImage)
    // private SelfSprIcon: DynamicImage = null;
    // /** 我方品质 */
    // @property(cc.Label)
    // private SelfLabVal: cc.Label = null;

    protected start(): void {
        super.start();
        this.scheduleOnce(this.autoClose, 2);
    }

    public setData(selfIconPath: string, selfName: string, enemyIconPath: string, enemyName: string, isHigh?: boolean): void {
        // this.SelfLabVal.string = selfName;
        // this.EnemyLabVal.string = enemyName;
        // this.SelfSprIcon.loadImage(selfIconPath, 1, true);
        // this.EnemySprIcon.loadImage(enemyIconPath, 1, true);
        ResMgr.I.showPrefabAsync('animPrefab/ui/ui_9002/anim/ui_9002').then((_node) => {
            this.node.addChild(_node);
            _node.y += 80;
            const EnemyNode = _node.getChildByName('Fontimg1');
            const SelfNode = _node.getChildByName('Fontimg2');
            const AnimNd = _node.getChildByName('NdAnim');
            // 处理方向
            const shouji1 = AnimNd.getChildByName('shouji');
            const shouji2 = AnimNd.getChildByName('shouji2');
            const shandian = AnimNd.getChildByName('shandian');
            if (isHigh) { // 我方高于敌方，要改方向
                AnimNd.scale = -1;
                shouji1.y += -20;
                shouji2.y += -20;
                shandian.rotation = 15;
            }
            // 我方图标
            UtilCocos.LoadSpriteFrameRemote(SelfNode, selfIconPath, AssetType.SpriteFrame);
            // 敌方图标
            UtilCocos.LoadSpriteFrameRemote(EnemyNode, enemyIconPath, AssetType.SpriteFrame);
            // 我方等级
            SelfNode.getChildByName('SelfLv').getComponent(cc.Label).string = selfName;
            // 敌方等级
            EnemyNode.getChildByName('EnemyLv').getComponent(cc.Label).string = enemyName;
        }).catch((err) => {
            console.log(err);
        });
    }

    private autoClose() {
        this.close();
    }
}
