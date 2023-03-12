/*
 * @Author: myl
 * @Date: 2022-08-17 11:48:20
 * @Description:
 */
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import { RES_ENUM } from '../../../const/ResPath';
import ModelMgr from '../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class VipUpdateWin extends WinBase {
    @property(cc.Node)
    private btnClose: cc.Node = null;

    @property(cc.Label)
    private vipLvLab: cc.Label = null;
    @property(DynamicImage)
    private vipNameSpr: DynamicImage = null;

    @property(DynamicImage)
    private vipNameSprBg: DynamicImage = null;

    @property(cc.Label)
    private closeTipLab: cc.Label = null;

    @property(cc.Node)
    private NdBg: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.btnClose, () => {
            this.close();
        }, this);

        UtilGame.Click(this.NdBg, () => {
            this.close();
        }, this, { scale: 1 });

        const vipModel = ModelMgr.I.VipModel;
        const vipConf = vipModel.isSVip();
        this.vipLvLab.string = vipConf.lev.toString();
        const lvStr = vipConf.lev.toString();
        if (lvStr.charAt(0) === '1') {
            this.vipLvLab.node.setPosition(-5, 65, 0); // 只修改x坐标
        }

        if (vipConf.isSvip) {
            this.vipNameSpr.loadImage(RES_ENUM.Vip_Font_Vip_Wanghou, 1, true);
            this.vipNameSprBg.loadImage(RES_ENUM.Vip_Icon_Vip_Svip_Zhanghaoshenji, 1, true);
        } else {
            this.vipNameSpr.loadImage(RES_ENUM.Vip_Font_Vip_Guizu, 1, true);
            this.vipNameSprBg.loadImage(RES_ENUM.Vip_Icon_Vip_Vip_Zhanghaoshenji, 1, true);
        }
        let cd = 5;
        this.schedule(() => {
            cd--;
            if (cd <= 0) {
                this.close();
            }
            this.closeTipLab.string = `${i18n.tt(Lang.com_btn_confirm_1)}(${cd})`;
        }, 1, 5);
    }
}
