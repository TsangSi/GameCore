import { UtilColor } from '../../../../../../app/base/utils/UtilColor';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import UtilItem from '../../../../../base/utils/UtilItem';
import { ItemIcon } from '../../../../../com/item/ItemIcon';
import WinBase from '../../../../../com/win/WinBase';

const { ccclass, property } = cc._decorator;

@ccclass
export class GeneralAwardTip extends WinBase {
    //
    @property(cc.Node)
    private NdSprMask: cc.Node = null;

    @property(ItemIcon)
    private awardItem: ItemIcon = null;

    @property(cc.Label)
    private LabNum: cc.Label = null;

    @property(cc.Label)
    private LabHero: cc.Label = null;

    @property(cc.Node)
    private NdPreView: cc.Node = null;

    @property(cc.Node)
    private NdReward: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => {
            this.close();
        }, this, { scale: 1 });
    }

    public init(params: [{ isReward: boolean, itemId: number, itemNum: number, leftNum: number }]): void {
        this.NdReward.active = params[0].isReward;
        this.NdPreView.active = !params[0].isReward;

        const itemModel = UtilItem.NewItemModel(params[0].itemId, params[0].itemNum);

        if (params[0].isReward) { // 显示奖励
            const name = itemModel.cfg.Name;
            this.LabHero.string = `【${name}】`;
            this.LabHero.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(itemModel.cfg.Quality, true));
        } else {
            this.LabNum.string = `${params[0].leftNum}${i18n.tt(Lang.onhook_ci)}`;// 剩余次数
        }
        this.awardItem.setData(itemModel, { hideLeftLogo: false, needNum: true });
    }
}
