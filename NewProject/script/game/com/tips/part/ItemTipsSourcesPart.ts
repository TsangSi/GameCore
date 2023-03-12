/*
 * @Author: hwx
 * @Date: 2022-06-17 14:19:44
 * @FilePath: \SanGuo\assets\script\game\com\tips\part\ItemTipsSourcesPart.ts
 * @Description: 道具Tips来源部件
 */

import WinMgr from '../../../../app/core/mvc/WinMgr';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import { Link } from '../../../module/link/Link';
import { BaseItemTipsPart } from './BaseItemTipsPart';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsSourcesPart extends BaseItemTipsPart {
    @property(cc.Node)
    public NdSources: cc.Node = null;

    @property(cc.Node)
    public NdSourceTpl: cc.Node = null;

    /**
     * 刷新
     */
    public refresh(): void {
        if (this.itemModel.cfg.FromID) {
            const sources = UtilItem.GetCfgItemSources(this.itemModel.cfg.FromID);
            for (let i = 0, len = sources.length; i < len; i++) {
                const source = sources[i];
                let sourceNode = this.NdSources.children[i];
                if (!sourceNode) {
                    sourceNode = cc.instantiate(this.NdSourceTpl);
                    this.NdSources.addChild(sourceNode);
                }
                sourceNode.getComponent(cc.Label).string = source.Desc;

                UtilGame.Click(sourceNode, this.onSourceItemClicked, this, { customData: source });
            }
            this.node.active = true;
        } else {
            this.node.active = false;
        }
    }

    private onSourceItemClicked(targetNode: cc.Node, cfgSource: Cfg_ItemSource) {
        switch (cfgSource.FuncId) {
            case FuncId.MsgBox:
                MsgToastMgr.Show(cfgSource.Desc2);
                break;
            default:
                WinMgr.I.clearPopupView(ViewConst.ItemTipsWin);
                WinMgr.I.close(ViewConst.ItemTipsWin);
                Link.To(cfgSource.FuncId, cfgSource.FuncParam);
                break;
        }
    }
}
