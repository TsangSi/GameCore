/*
 * @Author: zs
 * @Date: 2022-10-31 14:21:07
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\beauty\com\BeautyLevel.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { DynamicImage } from '../../../base/components/DynamicImage';
import Progress from '../../../base/components/Progress';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import { BagMgr } from '../../bag/BagMgr';
import { IWinAutoPayTips } from '../../pay/WinAutoPayTips';
import { AutoPayKey, WinAutoPayTipsModel } from '../../pay/WinAutoPayTipsModel';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;
@ccclass()
export abstract class UpLevelBase extends BaseCmp {
    @property(cc.Node)
    private NodeBtnUp: cc.Node = null;
    @property(cc.Node)
    private NodeBtnOneKeyUp: cc.Node = null;
    @property(DynamicImage)
    private SpriteItem: DynamicImage = null;
    @property(cc.Toggle)
    protected ToggleBuy: cc.Toggle = null;
    @property(cc.Node)
    private NodeAutoBuy: cc.Node = null;
    @property(Progress)
    protected Progress: Progress = null;
    @property(cc.Label)
    private LabelCost: cc.Label = null;
    @property(cc.Label)
    protected LabelLevel: cc.Label = null;
    /** id */
    protected id: number = 0;
    /** 需要消耗的道具id */
    protected needItemId: number = 0;
    /** 上一次的消耗道具id */
    private lastNeedItemId: number = 0;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.NodeBtnUp, this.onBtnUpClicked, this);
        UtilGame.Click(this.NodeBtnOneKeyUp, this.onBtnOneKeyUpClicked, this);
        UtilGame.Click(this.NodeAutoBuy, this.onNodeAutoBuyClicked, this);
    }
    public abstract setData(id: number): void

    /** 升级，一键升级，能否显示红点 */
    protected abstract isCanShowRed(id: number): boolean;
    /** 自动购买的key */
    protected abstract getAutoBuyKey(): AutoPayKey;

    /** 升级按钮事件 */
    protected abstract onBtnUpClicked(): void;
    /** 一键升级按钮事件 */
    protected abstract onBtnOneKeyUpClicked(): void;

    protected updateItem(itemId: number): void {
        if (itemId && this.lastNeedItemId !== itemId) {
            if (itemId) {
                EventClient.I.off(`${E.Bag.ItemChangeOfId}${itemId}`, this.onItemChangeItem, this);
            }
            EventClient.I.on(`${E.Bag.ItemChangeOfId}${itemId}`, this.onItemChangeItem, this);
        }
        if (itemId) {
            const picId: string = Config.Get(Config.Type.Cfg_Item).getValueByKey(itemId, 'PicID');
            this.SpriteItem.loadImage(UtilItem.GetItemIconPath(picId, RoleMgr.I.d.Sex), 1, true);
            this.onItemChangeItem();
        }
    }

    /** 道具数量变更 */
    protected onItemChangeItem(): void {
        const hasNum = BagMgr.I.getItemNum(this.needItemId);
        this.LabelCost.string = `${UtilNum.Convert(hasNum)}`;
        this.LabelCost.node.color = hasNum >= 1 ? UtilColor.ColorEnoughV : UtilColor.Red();
        const isRed = this.isCanShowRed(this.id);
        UtilRedDot.UpdateRed(this.NodeBtnUp, isRed, cc.v2(64, 18));
        UtilRedDot.UpdateRed(this.NodeBtnOneKeyUp, isRed, cc.v2(64, 18));
    }
    protected onEnable(): void {
        this.ToggleBuy.isChecked = false;
    }

    /** 自动购买 */
    private onNodeAutoBuyClicked() {
        if (this.ToggleBuy.isChecked) {
            this.ToggleBuy.isChecked = false;
        } else if (WinAutoPayTipsModel.getState(this.getAutoBuyKey())) {
            this.ToggleBuy.isChecked = true;
        } else {
            const conf: IWinAutoPayTips = {
                cb: (b) => {
                    this.ToggleBuy.isChecked = b;
                },
                itemId: this.needItemId,
                recordKey: this.getAutoBuyKey(),
            };
            WinMgr.I.open(ViewConst.WinAutoPayTips, conf);
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(`${E.Bag.ItemChangeOfId}${this.needItemId}`, this.onItemChangeItem, this);
    }
}
