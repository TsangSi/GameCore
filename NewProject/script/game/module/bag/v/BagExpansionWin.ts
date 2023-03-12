/*
 * @Author: hwx
 * @Date: 2022-06-16 17:11:43
 * @FilePath: \SanGuo-2.4-new\assets\script\game\module\bag\v\BagExpansionWin.ts
 * @Description: 背包扩容弹框
 */
import { i18n, Lang } from '../../../../i18n/i18n';
import { NumberChoose, tipsType } from '../../../base/components/NumberChoose';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import ItemModel from '../../../com/item/ItemModel';
import { WinCmp } from '../../../com/win/WinCmp';
import ControllerMgr from '../../../manager/ControllerMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { BagMgr } from '../BagMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class BagExpansionWin extends WinCmp {
    @property(cc.Label)
    protected LabCost: cc.Label = null;

    @property(NumberChoose)
    private NdNumberChoose: NumberChoose = null;

    @property(cc.Node)
    private NdCancelButton: cc.Node = null;

    @property(cc.Node)
    private NdConfirmButton: cc.Node = null;

    private _min = 5;
    private _price = 100;
    private _count: number = this._min;
    private _bagType: number = 0;
    private _cost: number = 25;

    private costItemModel: ItemModel;

    protected start(): void {
        super.start();

        UtilGame.Click(this.NdConfirmButton, () => {
            // 检查货币是否足够
            if (RoleMgr.I.checkCurrency(this.costItemModel.cfg.Id, this._cost)) {
                ControllerMgr.I.BagController.reqC2SExtendEquipBag(this._bagType, this._count);
                this.close();
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.com_msg_currency_not_enough));
            }
        }, this);

        UtilGame.Click(this.NdCancelButton, () => {
            this.close();
        }, this);
    }

    public init(params: any[]): void {
        this._bagType = params[0];
        const remainSize = params[1];

        // 设置单价
        const costItemModel = BagMgr.I.getEquipBagExtendPrice();
        this._price = costItemModel.data.ItemNum;
        this.costItemModel = costItemModel;

        // 设置最大扩容数量，必须是5的倍数
        const ownCount = RoleMgr.I.getCurrencyById(costItemModel.cfg.Id);
        const pert = this._min * Math.floor((ownCount / this._price) / this._min);
        const buySize = Math.max(pert, this._min);
        const size = Math.floor(Math.min(buySize, remainSize));
        this.NdNumberChoose.setMaxCount(size);
        const tips: tipsType = {
            max: i18n.tt(Lang.number_choose_add),
            min: i18n.tt(Lang.number_choose_dec),
        };
        this.NdNumberChoose.setTipsContent(tips);
        this.NdNumberChoose.curCount = this._min;
    }

    private onNumberChooseChange(num: number) {
        this._count = num || 0;
        this._cost = this._count * this._price;
        this.LabCost.string = this._cost.toString();
    }
}
