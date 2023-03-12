/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: lijun
 * @Date: 2023-02-22 16:22:33
 * @Description:
 */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilItem from '../../../base/utils/UtilItem';
import { RES_ENUM } from '../../../const/ResPath';
import ModelMgr from '../../../manager/ModelMgr';
import { HuarongdaoSupportResult } from '../HuarongdaoConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HuarongdaoResult extends BaseCmp {
    @property(cc.Label)
    private LblOdds: cc.Label = null;
    @property(cc.Label)
    private LblName: cc.Label = null;
    @property(cc.Label)
    private LblSupport: cc.Label = null;
    @property(cc.Label)
    private LblTotalTime: cc.Label = null;
    @property(cc.Label)
    private LblSupportResult: cc.Label = null;
    @property(cc.Label)
    private LblOver: cc.Label = null;
    @property(cc.Label)
    private LblTitle: cc.Label = null;
    @property(cc.Label)
    private LblResult: cc.Label = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(DynamicImage)
    private SprQualityBg: DynamicImage = null;
    @property(DynamicImage)
    private SprQualityKuang: DynamicImage = null;

    @property(cc.Node)
    private NdSupportSuccess: cc.Node = null;
    @property(cc.Node)
    private NdSupportFail: cc.Node = null;

    private _data: HuarongEntryInfo;
    private _genCfg: Cfg_HuarongdaoGen;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    public initView(): void {
        const data: HuarongEntryInfo = ModelMgr.I.HuarongdaoModel.getWinGeninfo();
        if (!data.Id) {
            this.node.active = false;
            return;
        }
        this.setData(data);
    }

    private setData(data: HuarongEntryInfo): void {
        this._data = data;
        this.showGenView();
        this.showSupportRate();
        this.LblOdds.string = UtilString.FormatArgs(i18n.tt(Lang.huarongdao_odds_num.replace(/\s/g, '')), data.OddsRatio);
        this.LblTotalTime.string = UtilString.FormatArgs(i18n.tt(Lang.huarongdao_record_total_time.replace(/\s/g, '')), data.EndTimes - data.StartTimes - ModelMgr.I.HuarongdaoModel.getStakeTime());
        this.LblTitle.string = `${ModelMgr.I.HuarongdaoModel.getActivityCycNo()}`;
        const supportList = ModelMgr.I.HuarongdaoModel.getSupportGenArray();
        if (supportList.length === 0) {
            this.NdSupportSuccess.active = this.NdSupportFail.active = false;
            this.LblOver.node.active = true;
            this.LblSupportResult.node.active = false;
        } else {
            const winState = supportList.indexOf(data.Id) !== -1;
            this.NdSupportSuccess.active = winState;
            this.NdSupportFail.active = !winState;
            this.LblOver.node.active = false;
            this.LblSupportResult.node.active = true;
            this.LblSupportResult.string = i18n.tt(winState ? Lang.huarongdao_support_success : Lang.huarongdao_support_fail);
        }

        if (this._genCfg.OddsType === HuarongdaoSupportResult.success) {
            this.LblResult.string = i18n.tt(Lang.huarongdao_result_tip1);
        } else {
            const genList = ModelMgr.I.HuarongdaoModel.getGenIdList();
            const cfg = ModelMgr.I.HuarongdaoModel.getGenValueByKey(genList.mainRole);
            this.LblResult.string = UtilString.FormatArgs(i18n.tt(Lang.huarongdao_result_tip2), cfg.Name);
        }
    }

    /** 显示武将 */
    private showGenView(): void {
        this._genCfg = ModelMgr.I.HuarongdaoModel.getGenValueByKey(this._data.Id);
        this.LblName.string = i18n.tt(this._genCfg.Name);
        UtilCocos.setLableQualityColor(this.LblName, this._genCfg.OddsTime);
        const headIcon = this._genCfg.Image === 1001 ? 20001 : this._genCfg.Image;
        this.SprIcon.loadImage(`${RES_ENUM.HeadIcon}${headIcon}`, 1, true);
        // 品质底图
        // this.SprQualityBg.loadImage(UtilItem.GetItemQualityBgPath(this._genCfg.OddsTime), 1, true);
        this.SprQualityKuang.loadImage(UtilItem.GetItemIconPath('200110'), 1, true);
    }

    /** 显示支持率 */
    private showSupportRate(): void {
        const support = ModelMgr.I.HuarongdaoModel.getSupportRateMap(this._data.Id);
        this.LblSupport.string = UtilString.FormatArgs(i18n.tt(Lang.huarongdao_support_num.replace(/\s/g, '')), support);
    }

    // protected updatePerSecond(): void {
    //     this.showSupportRate();
    // }

    // update (dt) {}
}
