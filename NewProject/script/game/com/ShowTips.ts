/*
 * @Author: kexd
 * @Date: 2022-11-18 21:10:49
 * @FilePath: \SanGuo2.4\assets\script\game\com\ShowTips.ts
 * @Description:
 *
 */

import BaseUiView from '../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../app/core/mvc/WinConst';
import { ResMgr } from '../../app/core/res/ResMgr';
import { LayerMgr } from '../base/main/LayerMgr';
import { UtilGame } from '../base/utils/UtilGame';
import { UI_PATH_ENUM } from '../const/UIPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class ShowTips extends BaseUiView {
    @property(cc.Node)
    private NdBg: cc.Node = null;
    @property(cc.Node)
    private NdContent: cc.Node = null;
    @property(cc.RichText)
    private RichTips: cc.RichText = null;

    public static show(tips: string, pos: cc.Vec2): void {
        ResMgr.I.loadLocal(UI_PATH_ENUM.ShowTips, cc.Prefab, (err, p: cc.Prefab) => {
            if (err) return;
            if (p) {
                const nd = cc.instantiate(p);
                LayerMgr.I.addToLayer(GameLayerEnum.TIPS_LAYER, nd);
                nd.getComponent(ShowTips).initData(tips, pos);
            }
        });
    }

    /**
     * initData
     */
    public initData(tips: string, pos: cc.Vec2): void {
        // 传入的值为世界坐标点
        const pos1 = this.node.convertToNodeSpaceAR(pos);
        this.NdContent.setPosition(pos1);
        //
        this.RichTips.string = tips;
    }

    protected start(): void {
        UtilGame.Click(this.NdBg, () => {
            this.onClose();
        }, this);
    }

    private onClose() {
        this.node.destroy();
    }
}
