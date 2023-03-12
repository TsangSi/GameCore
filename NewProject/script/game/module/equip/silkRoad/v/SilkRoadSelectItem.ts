// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { UtilTime } from '../../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import ListItem from '../../../../base/components/listview/ListItem';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import { ItemWhere } from '../../../../com/item/ItemConst';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { RoleMgr } from '../../../role/RoleMgr';
import { RoadData } from '../SilkRoadConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SilkroadelectItem extends ListItem {
    @property(cc.Label)
    private LabOutTime: cc.Label = null;

    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(cc.Label)
    private LabEndPointName: cc.Label = null;

    @property(cc.Label)
    private LabEventPriority: cc.Label = null;

    @property(cc.Sprite)
    private SprTitle: cc.Sprite = null;

    @property(cc.Node)
    private NdStartBtn: cc.Node = null;

    @property(cc.Node)
    private NdStartLabel: cc.Node = null;

    @property(cc.Node)
    private RewardLayout: cc.Node = null;

    /** 消耗 */
    @property(DynamicImage)
    private NdCostIcon: DynamicImage = null;
    @property(cc.Label)
    private LabCostNum: cc.Label = null;

    protected start(): void {
        EventClient.I.on(E.SilkRoad.buyCount, this.updateGray, this);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.SilkRoad.buyCount, this.updateGray, this);
    }

    public setData(road: RoadData): void {
        const costImgUrl: string = UtilCurrency.getIconByCurrencyType(road.costType);
        if (this.NdCostIcon) this.NdCostIcon.loadImage(costImgUrl, 1, true);
        if (this.LabCostNum) this.LabCostNum.string = `${UtilNum.Convert(road.costNum)}`;
        if (this.LabOutTime) this.LabOutTime.string = UtilTime.FormatTime(road.time, '%mm:%ss', true, true);
        if (this.LabEndPointName) this.LabEndPointName.string = road.points[road.points.length - 1].name;
        if (this.LabEventPriority) this.LabEventPriority.string = `${(road.eventPriority / 10000 * 100).toFixed(0)}%`;
        this.LabName.string = road.name;

        this.updateGray();

        if (this.NdStartBtn) {
            UtilGame.Click(this.NdStartBtn, () => {
                const info = ModelMgr.I.SilkRoadModel.getInfo();
                /** 剩余次数判断 */
                const model = ModelMgr.I.SilkRoadModel;
                const cur = model.getSilkRoadTimes() + info.BuyCount - info.Count;
                if (cur === 0) {
                    MsgToastMgr.Show(i18n.tt(Lang.silkroad_tip7));
                    return;
                }

                const count = RoleMgr.I.getCurrencyById(road.costType);
                if (count < road.costNum) {
                    const name = UtilItem.NewItemModel(road.costType).cfg.Name;
                    MsgToastMgr.Show(name + i18n.tt(Lang.com_buzu));
                    WinMgr.I.open(ViewConst.ItemSourceWin, road.costType);
                    return;
                }

                ControllerMgr.I.SilkRoadController.reqStart(road.id);
            }, this);
        }

        UtilCocos.LoadSpriteFrame(this.SprTitle, `/texture/com/img/com_img_pinzhitiao_${road.quality}`);

        road.reward.forEach((v) => {
            ResMgr.I.showPrefab('/prefab/module/equip/silkRoad/SilkRoadItemIcon', this.RewardLayout, (err, nd: cc.Node) => {
                const itemModel = UtilItem.NewItemModel(v.itemId, v.itemNum);
                nd.getComponent(ItemIcon).setData(itemModel, {
                    where: ItemWhere.OTHER, needNum: true, hideLeftLogo: true, hideRightLogo: true,
                });
            });
        });
    }

    public updateGray(): void {
        if (this.NdStartBtn) {
            const info = ModelMgr.I.SilkRoadModel.getInfo();
            /** 剩余次数判断 */
            const model = ModelMgr.I.SilkRoadModel;
            const cur = model.getSilkRoadTimes() + info.BuyCount - info.Count;
            UtilCocos.SetSpriteGray(this.NdStartBtn, cur === 0);
            if (this.NdStartLabel) this.NdStartLabel.color = this.node.color.fromHEX(cur === 0 ? '#636E6A' : '#2b523a');

            // UtilCocos.SetSpriteGray(this.NdStartBtn.children[0], cur === 0);
        }
    }
}
