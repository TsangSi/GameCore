import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import { RewardType, TaskState } from '../FamilyConst';

const { ccclass, property } = cc._decorator;

/** 事务列表Item */
@ccclass
export class FamilyRewardItem extends cc.Component {
    @property(cc.Node)
    private NdBox: cc.Node = null;
    @property(cc.Node)
    private NdItemIcon: cc.Node = null;
    @property(cc.Node)
    private NdFlag: cc.Node = null;
    // 宝箱奖励
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(DynamicImage)
    private SprQualityBg: DynamicImage = null;

    protected start(): void {
        UtilGame.Click(this.NdBox, this._onBox, this);
    }

    private _onBox(): void {
        const itemInfo: ItemInfo[] = ModelMgr.I.FamilyModel.getDropItemInfo(this._taskData.TaskId);
        const itemModelArr: ItemModel[] = [];
        for (let i = 0; i < itemInfo.length; i++) {
            const item: ItemInfo = itemInfo[i];
            const itemModel: ItemModel = UtilItem.NewItemModel(item.ItemId, item.ItemNum);
            itemModelArr.push(itemModel);
        }
        WinMgr.I.open(ViewConst.WinRwShow, itemModelArr);
    }

    // 设置数据
    private _taskData: FamilyTask;
    public setData(data: { type: RewardType, reward: string }, taskData: FamilyTask): void {
        this._taskData = taskData;

        if (data.type === RewardType.box) { // 宝箱
            this.NdBox.active = true;
            this.NdBox.scale = 0.82;
            this.NdFlag.active = false;
            this.NdItemIcon.active = false;

            const boxRewardArr: string[] = data.reward.split(':');// 品质 图标
            const quality: number = Number(boxRewardArr[0]);
            const icon: string = boxRewardArr[1];
            const path = UtilItem.GetItemIconPath(icon);

            const pathQuality: string = UtilItem.GetItemQualityBgPath(quality);
            this.SprQualityBg.pngPath(pathQuality);
            this.SprIcon.loadImage(path, 1, true);
        } else if (data.type === RewardType.simple) {
            this.NdBox.active = false;
            this.NdFlag.active = false;
            this.NdItemIcon.active = true;

            const reward = data.reward.split(':');
            const itemModel: ItemModel = UtilItem.NewItemModel(Number(reward[0]), Number(reward[1]));
            this.NdItemIcon.getComponent(ItemIcon).setData(itemModel, { needName: false, needNum: true });
        } else {
            this.NdBox.active = false;
            this.NdFlag.active = true;// 显示缘分角标
            this.NdItemIcon.active = true;
            const reward = data.reward.split(':');
            const itemModel: ItemModel = UtilItem.NewItemModel(Number(reward[0]), Number(reward[1]));
            this.NdItemIcon.getComponent(ItemIcon).setData(itemModel, { needName: false, needNum: true });

            // 缘分奖励
            if (this._taskData.TaskState === TaskState.doing) {
                // 判断是否复合缘分
                UtilCocos.SetSpriteGray(this.NdItemIcon, !this._taskData.FateOk, true);
            } else {
                UtilCocos.SetSpriteGray(this.NdItemIcon, false, true);
            }
        }
    }
}
