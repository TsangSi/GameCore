/*
 * @Author: myl
 * @Date: 2022-07-14 18:45:52
 * @Description:
 */
import { EffectMgr } from '../../../../manager/EffectMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItemList from '../../../../base/utils/UtilItemList';
import ItemModel from '../../../../com/item/ItemModel';
import WinBase from '../../../../com/win/WinBase';
import { RES_ENUM } from '../../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class UpStarRewardWin extends WinBase {
    @property(cc.Node)
    private BtnClose: cc.Node = null;

    @property(cc.Node)
    private Icon: cc.Node = null;
    @property(cc.Node)
    private effectNd: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.BtnClose, () => {
            this.close();
        }, this);
    }

    public init(params: [ItemModel]): void {
        let cNd: cc.Node = null;
        EffectMgr.PlayCocosAnim('animPrefab/ui/ty_chenggong/ty_chenggong', this.effectNd, (par: unknown, nd: cc.Node) => {
            const item = params[0];
            cNd = cc.instantiate(nd);
            UtilItemList.ShowItemArr(this.Icon, [item], { needName: true });
            EffectMgr.I.showEffect(RES_ENUM.Strength_Ui_7004, nd, cc.WrapMode.Default, null);
        }, 0, false);
    }
}
