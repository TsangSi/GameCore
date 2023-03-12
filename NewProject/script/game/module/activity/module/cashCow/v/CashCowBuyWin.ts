/*
 * @Author: myl
 * @Date: 2022-12-22 16:28:51
 * @Description:
 */

import { UtilColor } from '../../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import { DynamicImage } from '../../../../../base/components/DynamicImage';
import { UtilCurrency } from '../../../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import { ConfirmBox } from '../../../../../com/msgbox/ConfirmBox';
import WinBase from '../../../../../com/win/WinBase';
import { RES_ENUM } from '../../../../../const/ResPath';
import { ViewConst } from '../../../../../const/ViewConst';
import ModelMgr from '../../../../../manager/ModelMgr';
import { RoleMgr } from '../../../../role/RoleMgr';
import { CashCowConst, CashCowShakeType } from '../CashCowConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CashCowBuyWin extends WinBase {
    @property(cc.Label)
    private LabReward: cc.Label = null;

    @property(cc.Label)
    private LabCount: cc.Label = null;

    @property(cc.Label)
    private LabTip: cc.Label = null;

    @property(cc.Node)
    private add1: cc.Node = null;

    @property(cc.Node)
    private add10: cc.Node = null;

    @property(cc.Node)
    private reduce1: cc.Node = null;

    @property(cc.Node)
    private reduce10: cc.Node = null;

    @property(cc.Node)
    private NdShake: cc.Node = null;

    @property(DynamicImage)
    private SprCoin: DynamicImage = null;
    @property(cc.Label)
    private LabPrice: cc.Label = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;

    /** 默认购买次数为1次 */
    private buyCount = 1;
    private _type: CashCowShakeType = CashCowShakeType.Coin;
    private _cb: (n: number) => void;
    public init(param: any[]): void {
        console.log(param);
        if (param && param[0]) {
            this._type = param[0];
        }
        if (param && param[1]) {
            this._cb = param[1];
        }
        this.updateUI();

        UtilGame.Click(this.NdShake, () => {
            const model = ModelMgr.I.CashCowModel;
            const coinK = this._type === CashCowShakeType.Coin ? CashCowConst.Price1 : CashCowConst.Price2;
            const needCfg = model.getCashCowConst(coinK).CfgValue.split(':');
            const need = Number(needCfg[1]) * this.buyCount;
            const needId = Number(needCfg[0]);
            if (RoleMgr.I.checkCurrency(needId, need)) { // 充足
                if (this._cb) this._cb(this.buyCount);
            } else {
                // 获取货币名称
                const coinName = UtilCurrency.getNameByType(needId);
                const tip = UtilString.FormatArray(i18n.tt(Lang.cashCow_currenty_unEnough), [coinName, UtilColor.NorV]);
                ModelMgr.I.MsgBoxModel.ShowBox(tip, () => {
                    WinMgr.I.open(ViewConst.ItemSourceWin, needId);
                }, { showToggle: '', cbCloseFlag: `` }, null);
            }

            this.close();
        }, this);

        UtilGame.Click(this.add1, () => {
            this.buyCount += 1;
            const model = ModelMgr.I.CashCowModel;
            const { n, n1 } = model.userTimes(this._type);
            if (this.buyCount >= n1) {
                this.buyCount = n1;
            }
            this.updateCountLab();
        }, this);

        UtilGame.Click(this.add10, () => {
            this.buyCount += 10;
            const model = ModelMgr.I.CashCowModel;
            const { n, n1 } = model.userTimes(this._type);
            if (this.buyCount >= n1) {
                this.buyCount = n1;
            }
            this.updateCountLab();
        }, this);

        UtilGame.Click(this.reduce1, () => {
            this.buyCount -= 1;
            if (this.buyCount <= 1) {
                this.buyCount = 1;
            }
            this.updateCountLab();
        }, this);

        UtilGame.Click(this.reduce10, () => {
            this.buyCount -= 10;
            if (this.buyCount <= 1) {
                this.buyCount = 1;
            }
            this.updateCountLab();
        }, this);

        UtilGame.Click(this.node, () => {
            this.close();
        }, this, { scale: 1 });

        UtilGame.Click(this.BtnClose, () => {
            this.close();
        }, this);
    }

    private updateCountLab() {
        this.updateUI();
    }

    public updateUI(): void {
        const model = ModelMgr.I.CashCowModel;
        const { n, n1 } = model.userTimes(this._type);
        this.LabTip.string = UtilString.FormatArray(i18n.tt(Lang.general_BuyTimes), [`${n1}/${n}`]);
        const iconPath = this._type === CashCowShakeType.Coin ? RES_ENUM.Item_3_H : RES_ENUM.Item_2_H;
        this.SprCoin.loadImage(iconPath, 1, true);
        const coinK = this._type === CashCowShakeType.Coin ? CashCowConst.Price1 : CashCowConst.Price2;
        this.LabPrice.string = (Number(model.getCashCowConst(coinK).CfgValue.split(':')[1]) * this.buyCount).toString();

        this.LabCount.string = this.buyCount.toString();
        this.LabReward.string = (model.getBaseCashRowReward(model.userData.Level) * this.buyCount).toString();
    }
}
