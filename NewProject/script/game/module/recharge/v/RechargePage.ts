/*
 * @Author: zs
 * @Date: 2022-06-06 11:12:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-25 22:05:35
 * @FilePath: \SanGuo24\assets\script\game\module\recharge\v\RechargePage.ts
 * @Description:
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { EMallType } from '../RechargeConst';
import { RechargeItem } from './RechargeItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RechargePage extends WinTabPage {
    @property(cc.Node)
    private NodeContent: cc.Node = null;
    @property(cc.Node)
    private NodeTopVip: cc.Node = null;
    public init(winId: number, param: unknown): void {
        EventClient.I.on(E.Recharge.UpdateGoodsDataList, this.onUpdateGoodsDataList, this);
        ControllerMgr.I.RechargeController.reqC2SGetChargeMallList(EMallType.XYShop);
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.RechargeVip, this.NodeTopVip);
        this.updateGoodsDatas();
    }

    private onUpdateGoodsDataList(t: EMallType) {
        if (t === EMallType.XYShop) {
            // ModelMgr.I.ShopModel
            this.updateGoodsDatas();
        }
    }

    private updateGoodsDatas() {
        const goodsDatas = ModelMgr.I.RechargeModel.getGoodsDatas();
        if (this.NodeContent.children.length <= 0) {
            if (goodsDatas.length > 0) {
                ResMgr.I.loadLocal(UI_PATH_ENUM.RechargeItem, cc.Prefab, (e, p: cc.Prefab) => {
                    if (e || !p || !this.NodeContent || !this.NodeContent.isValid) return;
                    for (let i = 0; i < 9; i++) {
                        let n = this.NodeContent.children[i];
                        if (!n) {
                            n = cc.instantiate(p);
                            this.NodeContent.addChild(n);
                        }
                        const s = n.getComponent(RechargeItem);
                        s.setData(goodsDatas[i], i);
                    }
                });
            }
        } else {
            for (let i = 0, n = this.NodeContent.children.length; i < n; i++) {
                const n = this.NodeContent.children[i];
                const s = n.getComponent(RechargeItem);
                s.setData(goodsDatas[i], i);
            }
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Recharge.UpdateGoodsDataList, this.onUpdateGoodsDataList, this);
    }
}
