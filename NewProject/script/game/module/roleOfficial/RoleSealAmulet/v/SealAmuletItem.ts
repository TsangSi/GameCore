/*
 * @Author: myl
 * @Date: 2022-10-21 12:23:53
 * @Description: 角色界面官职虎符item
 */

import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { StarLabelComponent } from '../../../../base/components/StarLabelComponent';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { FuncId } from '../../../../const/FuncConst';
import { RES_ENUM } from '../../../../const/ResPath';
import { ViewConst } from '../../../../const/ViewConst';
import ModelMgr from '../../../../manager/ModelMgr';
import { RID } from '../../../reddot/RedDotConst';
import { SealAmuletType } from '../SealAmuletConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class SealAmuletItem extends cc.Component {
    @property(DynamicImage)
    private QualityBg: DynamicImage = null;
    @property(cc.Node)
    private NdStar: cc.Node = null;
    @property(StarLabelComponent)
    private starNumLab: StarLabelComponent = null;

    @property(DynamicImage)
    private Icon: DynamicImage = null;
    @property(cc.Node)
    private NdSuo: cc.Node = null;

    private _data: OfficeSign = null;
    private _open: boolean = false;
    private _tipString = '';
    protected start(): void {
        UtilGame.Click(this.node, () => {
            if (!this._open) {
                MsgToastMgr.Show(this._tipString);
                return;
            }
            WinMgr.I.open(ViewConst.SealAmuletTipWin, this._data, true);
        }, this);
    }

    /** 界面处理 */
    public setData(data: OfficeSign, showRed: boolean = false, showStar: boolean = false): void {
        this._data = data;
        // 判断解锁
        const funcString = UtilFunOpen.getLimitMsg(FuncId.RoleArmyOfficial, true);
        if (funcString.length > 0) {
            this._tipString = i18n.tt(Lang.official_open);
            this._open = false;
        } else {
            const openString = UtilFunOpen.getLimitMsg(data.Type === SealAmuletType.Seal ? FuncId.OfficialSeal : FuncId.OfficialAmulet, true);
            this._open = openString.length <= 0;
            this._tipString = openString;
        }

        // this._tipString = openString || funcString;
        if (!this._open) {
            this.Icon.node.active = false;
            this.NdSuo.active = true;
            this.QualityBg.loadImage(RES_ENUM.Com_Bg_Com_Bg_Item_0, 1, true);
        } else {
            this.Icon.node.active = true;
            this.NdSuo.active = false;
            const conf = ModelMgr.I.SealAmuletModel.getAttByRefineLv(data.Type, data.RefineLv, data.RefineValue);
            this.QualityBg.loadImage(`${RES_ENUM.Com_Bg_Com_Bg_Item}${conf.Star}`, 1, true);
            this.Icon.loadImage(`${RES_ENUM.Official_Icon_Icon}${this._data.Type === 1 ? 'guanyin' : 'hufu'}_${conf.Picture}`, 1, true);
        }
        if (showRed) {
            UtilRedDot.Bind(data.Type === SealAmuletType.Seal
                ? RID.Role.RoleOfficial.Official.SealAmulet.Seal.Id
                : RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Id, this.node, cc.v2(40, 40));
        }
        if (showStar) {
            this.NdStar.active = true;
            this.starNumLab.updateStars(data.Star);
        } else {
            this.NdStar.active = false;
        }
    }
}
