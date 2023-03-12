/*
 * @Author: zs
 * @Date: 2022-11-01 16:39:51
 * @FilePath: \SanGuo\assets\script\game\module\beauty\com\BeautyActive.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { Link } from '../../link/Link';
import { EBeautyIndexId } from '../BeautyVoCfg';

const { ccclass, property } = cc._decorator;
@ccclass()
export class BeautyActive extends BaseCmp {
    @property(cc.Node)
    private BtnActive: cc.Node = null;
    @property(cc.Node)
    private ItemIcon: cc.Node = null;
    @property(cc.Node)
    private NodeSource: cc.Node = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelCost: cc.Label = null;
    @property(cc.Label)
    private LabelSource: cc.Label = null;
    /** 精魄id */
    private itemId: number = 0;
    /** 精魄需要的数量 */
    private itemNum: number = 0;
    /** 碎片id */
    private itemTatterId: number = 0;
    /** 碎片需要数量 */
    private itemTatterNum: number = 0;
    /** 红颜id */
    private id: number = 0;
    /** 跳转id */
    private linkToId: number = 0;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnActive, this.onBtnActiveClicked, this);
        UtilGame.Click(this.LabelSource.node, this.onSourceClicked, this);
    }

    public setData(id: number): void {
        this.id = id;
        if (this.itemId) {
            EventClient.I.off(`${E.Bag.ItemChangeOfId}${this.itemId}`, this.onItemChange, this);
            EventClient.I.off(`${E.Bag.ItemChangeOfId}${this.itemTatterId}`, this.onItemChange, this);
        }

        const cfg = Config.Get(Config.Type.Cfg_Beauty).getValueByKey(this.id, { UnlockItem: '', UnlockItemTatter: '' });
        const itemtatter = cfg.UnlockItemTatter.split(':');
        this.itemTatterId = +itemtatter[0];
        this.itemTatterNum = +itemtatter[1];
        const item = cfg.UnlockItem.split(':');
        this.itemId = +item[0];
        this.itemNum = +item[1];
        this.updateItem();
        EventClient.I.on(`${E.Bag.ItemChangeOfId}${this.itemId}`, this.onItemChange, this);
        EventClient.I.on(`${E.Bag.ItemChangeOfId}${this.itemTatterId}`, this.onItemChange, this);
    }

    private onItemChange() {
        this.updateItem();
    }

    /** 更新道具 */
    private updateItem() {
        const item = this.showItem();
        this.showItemSource(item.cfg.FromID);
        UtilRedDot.UpdateRed(this.BtnActive, ModelMgr.I.BeautyModel.isCanShowRed(this.id, EBeautyIndexId.Level), cc.v2(73, 20));
    }

    /** 显示道具相关信息 */
    private showItem() {
        const itemNum = BagMgr.I.getItemNum(this.itemId);
        const hasItem = itemNum >= this.itemNum;
        const itemTatterNum = BagMgr.I.getItemNum(this.itemTatterId);
        const hasItemTatter: boolean = itemTatterNum >= this.itemTatterNum;
        // 默认显示精魄道具
        let showItemId: number = this.itemId;
        let showNum: number = itemNum;
        let needNum: number = this.itemNum;
        // 有精魄道具 或者 碎片满足激活条件
        if (hasItem || hasItemTatter) {
            this.BtnActive.active = true;
            this.NodeSource.active = false;
            // 没有精魄道具，有道具碎片满足激活条件，就显示碎片
            if (!hasItem && hasItemTatter) {
                showItemId = this.itemTatterId;
                showNum = itemTatterNum;
                needNum = this.itemTatterNum;
            }
        } else {
            this.BtnActive.active = false;
            this.NodeSource.active = true;
        }
        const item = UtilItem.NewItemModel(showItemId);
        UtilItem.Show(this.ItemIcon, item);

        UtilItem.ItemNameScrollSet(item, this.LabelName, item.cfg.Name, false);

        this.LabelCost.string = `${showNum}/${needNum}`;
        this.LabelCost.node.color = showNum >= needNum ? UtilColor.ColorEnoughV : UtilColor.Red();
        return item;
    }

    /** 显示物品来源 */
    private showItemSource(cfgFromID: string) {
        /** 来源id */
        let fromId = 0;
        /** 跳转id */
        this.linkToId = 0;
        /** 来源描述 */
        let sourceStr = i18n.tt(Lang.com_activity);
        if (cfgFromID) {
            fromId = +cfgFromID.split('|')[0];
        }
        if (fromId) {
            const cfgSource = Config.Get(Config.Type.Cfg_ItemSource).getValueByKey(+cfgFromID.split('|')[0], { Desc: '', FuncId: 0 });
            if (cfgSource) {
                sourceStr = cfgSource.Desc;
                this.linkToId = cfgSource.FuncId;
            }
        }
        this.LabelSource.string = sourceStr;
    }

    /** 来源点击 */
    private onSourceClicked() {
        if (this.linkToId) {
            Link.To(this.linkToId);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.com_activity_noopen));
        }
    }

    private onBtnActiveClicked() {
        const itemNum = BagMgr.I.getItemNum(this.itemId);
        const hasItem = itemNum >= this.itemNum;
        const itemTatterNum = BagMgr.I.getItemNum(this.itemTatterId);
        const hasItemTatter: boolean = itemTatterNum >= this.itemTatterNum;
        if (hasItem || hasItemTatter) {
            ControllerMgr.I.BeautyController.C2SBeautyActive(this.id);
        } else {
            this.showItem();
            EventClient.I.emit(E.Beauty.UpdateHead, this.id);
            MsgToastMgr.Show(i18n.tt(Lang.beauty_active_fail));
            ModelMgr.I.BeautyModel.onCheckUpLevel();
            ModelMgr.I.BeautyModel.onCheckUpStar();
        }
    }
}
