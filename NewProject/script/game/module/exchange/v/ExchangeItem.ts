/*
 * @Author: zs
 * @Date: 2022-06-10 17:44:35
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\exchange\v\ExchangeItem.ts
 * @Description:
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { AssetType } from '../../../../app/core/res/ResConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../role/RoleMgr';

/*
 * @Author: zs
 * @Date: 2022-06-10 14:13:14
 * @LastEditors: zs
 * @LastEditTime: 2022-06-10 18:16:42
 * @FilePath: \SanGuo\assets\script\game\module\exchange\v\ExchangeItem.ts
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class ExchangeItem extends cc.Component {
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelMoney: cc.Label = null;
    @property(cc.Sprite)
    private SpriteIcon: cc.Sprite = null;
    @property(cc.Sprite)
    private SpriteMoney: cc.Sprite = null;

    protected onLoad(): void {
        UtilGame.Click(this.node, this.onExchangeClicked, this);
    }

    private data: Cfg_DH;
    public setData(data: Cfg_DH, index: number): void {
        this.data = data;
        this.LabelName.string = UtilString.FormatArgs(i18n.tt(Lang.exchange_money), data.TargetNum);
        this.LabelMoney.string = `x${data.CurrentNum}`;
        const path = `${RES_ENUM.Exchange_Img_Duihuan_Yuanbao}${UtilNum.FillZero(index + 1, 2)}`;
        UtilCocos.LoadSpriteFrameRemote(this.SpriteIcon, path, AssetType.SpriteFrame);
        UtilCocos.LoadSpriteFrameRemote(this.SpriteMoney, UtilCurrency.getIconByCurrencyType(data.CurrentId));
    }

    private onExchangeClicked() {
        ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.exchange_confirmbox_text), UtilColor.NorV, UtilColor.RedV), () => {
            if (RoleMgr.I.d.ItemType_Coin2 < this.data.CurrentNum) {
                ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.exchange_tips), UtilColor.NorV), () => {
                    WinMgr.I.open(ViewConst.RechargeWin);
                });
                return;
            }
            ControllerMgr.I.ExchangeController.reqC2SCurrencyExchangeReq(this.data.Id);
        }, { showToggle: 'ExchangeItem', tipTogState: false });
    }
}
