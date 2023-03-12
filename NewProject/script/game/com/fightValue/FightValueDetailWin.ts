/*
 * @Author: hwx
 * @Date: 2022-06-30 22:54:59
 * @FilePath: \SanGuo\assets\script\game\com\fightValue\FightValueDetailWin.ts
 * @Description: 战力细节弹框
 */

import { UtilGame } from '../../base/utils/UtilGame';
import WinBase from '../win/WinBase';

const { ccclass, property } = cc._decorator;

@ccclass
export class FightValueDetailWin extends WinBase {
    @property(cc.Layout)
    private LayDetail: cc.Layout = null;
    @property(cc.Label)
    private LabDetail: cc.Label = null;
    // @property(UIOpacity)
    // private NdOpacity: UIOpacity = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1, swallow: true });

        this.scheduleOnce(() => {
            this.node.opacity = 255;
        }, 0.05);
    }

    public init(...param: unknown[]): void {
        this.node.opacity = 0;
        const attrFvStr = param[0][0] as string;
        if (!attrFvStr) {
            this.close();
            return;
        }

        const worldPos = param[0][1] as cc.Vec2;
        const pos = this.node.parent.convertToNodeSpaceAR(worldPos);
        this.NdContent.setPosition(pos);

        // 不知为什么Label设置值后会高出很多
        this.LayDetail.paddingBottom = -26;

        // 展示详情
        this.LabDetail.string = attrFvStr;
    }
}
