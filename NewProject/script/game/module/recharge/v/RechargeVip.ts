/*
 * @Author: zs
 * @Date: 2022-06-06 21:46:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-28 16:35:02
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\recharge\v\RechargeVip.ts
 * @Description:
 *
 */

import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import Progress from '../../../base/components/Progress';
import { Config } from '../../../base/config/Config';
import { RES_ENUM } from '../../../const/ResPath';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class RechargeVip extends cc.Component {
    @property(Progress)
    private Progress: Progress = null;
    @property(cc.Label)
    private LabelRmb: cc.Label = null;
    @property(cc.Label)
    private LabelVip: cc.Label = null;
    @property(cc.Label)
    private LabelNextVip: cc.Label = null;

    // @property(DynamicImage)
    // private tipVip: DynamicImage = null;
    @property(cc.Label)
    private vipNameLab: cc.Label = null;

    @property(DynamicImage)
    private tipVipBg: DynamicImage = null;

    @property(cc.Node)
    private maxTip: cc.Node = null;

    protected onLoad(): void {
        this.LabelVip.spacingX = 0;
        this.LabelRmb.spacingX = 0;
        RoleMgr.I.on(this.onUpdateVip, this, RoleAN.N.VipLevel, RoleAN.N.VipExp);
        this.onUpdateVip();
    }

    private onUpdateVip() {
        const vipModel = ModelMgr.I.VipModel;
        if (vipModel) {
            const lv = RoleMgr.I.d.VipLevel;
            const nextLv = lv + 1;
            const maxlv = vipModel.getMaxVip();
            this.maxTip.active = lv >= maxlv;
            const realNextlv = Math.min(maxlv, nextLv);
            const exp = this.currentVipExp(RoleMgr.I.d.VipExp);
            const nextExp = vipModel.getNeedExp(realNextlv);
            const lastExp = Math.max(nextExp - exp, 0);
            if (nextLv > maxlv) {
                this.LabelRmb.node.parent.active = false;
            } else {
                this.LabelRmb.node.parent.active = true;
                this.LabelRmb.string = UtilString.FormatArgs(i18n.tt(Lang.recharge_rmb), lastExp);
                this.LabelNextVip.string = `${vipModel.vipName(nextLv)}${i18n.lv}`;
            }
            const vipConf = vipModel.isSVip();
            this.LabelVip.string = vipConf.lev.toString();
            this.Progress.updateProgress(exp, nextExp);
            // const lvStr = vipConf.lev.toString();
            // if (lvStr.charAt(0) === '1') {
            //     this.LabelVip.node.setPosition(-5, 74, 0); // 只修改x坐标
            // }

            // if (vipConf.isSvip) {
            //     this.tipVip.loadImage(RES_ENUM.Vip_Font_Svip, 1, true);
            //     this.tipVipBg.loadImage(RES_ENUM.Vip_Icon_Vip_Svip, 1, true);
            // } else {
            //     this.tipVip.loadImage(RES_ENUM.Vip_Font_Vip, 1, true);
            //     this.tipVipBg.loadImage(RES_ENUM.Vip_Icon_Vip_Vip, 1, true);
            // }
            if (vipConf.isSvip) {
                // this.tipVip.loadImage(RES_ENUM.Vip_Font_Vip_Wanghou, 1, true);
                this.tipVipBg.loadImage(RES_ENUM.Com_Icon_Svip, 1, true);
                this.vipNameLab.string = i18n.tt(Lang.svip_title).replace(' ', '');
            } else {
                // this.tipVip.loadImage(RES_ENUM.Vip_Font_Vip_Guizu, 1, true);
                this.tipVipBg.loadImage(RES_ENUM.Com_Icon_Vip, 1, true);
                this.vipNameLab.string = i18n.tt(Lang.vip_title).replace(' ', '');
            }
        }
    }

    protected onDestroy(): void {
        RoleMgr.I.off(this.onUpdateVip, this, RoleAN.N.VipLevel, RoleAN.N.VipExp);
    }

    /** 当前等级的vip经验 */
    private currentVipExp(totalExp: number): number {
        const maxVipLv: number = ModelMgr.I.VipModel.getMaxVip();
        let exp = 0;
        let vipExp = 0;
        for (let i = 1; i <= maxVipLv; i++) {
            const vipConfig: Cfg_VIP = Config.Get(Config.Type.Cfg_VIP).getValueByKey(i);
            vipExp = vipConfig.Exp;
            if (totalExp < exp + vipExp) {
                return totalExp - exp;
            }
            exp += vipConfig.Exp;
        }
        return vipExp;
    }
}
