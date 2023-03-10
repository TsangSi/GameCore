/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: lijun
 * @Date: 2023-02-20 16:56:18
 * @Description:
 */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemCurrencyId } from '../../../com/item/ItemConst';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { HuarongdaoGenType, HuarongdaoMatchState } from '../HuarongdaoConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends BaseCmp {
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabOdds: cc.Label = null;
    @property(cc.Label)
    private LabSupport: cc.Label = null;
    @property(cc.Node)
    private BtnSupport: cc.Node = null;

    @property(cc.Node)
    private NdCoin: cc.Node = null;
    @property(cc.Label)
    private LbNum: cc.Label = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;

    @property(cc.Node)
    private NdSupport: cc.Node = null;
    @property(cc.Node)
    private NdSupportTag: cc.Node = null;

    private id: number = 0;

    private Cfg_Gen: Cfg_HuarongdaoGen;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    protected start(): void {
        const Btnlabel = this.BtnSupport.getComponentInChildren(cc.Label);
        Btnlabel.string = i18n.tt(Lang.huarongdao_support);

        UtilGame.Click(this.BtnSupport, this.supportClick, this);
    }

    /**
     * ??????????????????
     * @param id ??????id
     */
    public setRoleId(id: number): void {
        this.id = id;
        this.Cfg_Gen = ModelMgr.I.HuarongdaoModel.getGenValueByKey(this.id);
        this.showInfo();
        // this.showSupportState();
        this.showSupportRate();
    }

    /**
     * ??????????????????
     */
    private showInfo(): void {
        this.LabName.string = i18n.tt(this.Cfg_Gen.Name);
        UtilCocos.setLableQualityColor(this.LabName, this.Cfg_Gen.OddsTime);
    }

    /** ?????????????????? */
    private supportClick(): void {
        const supportNum = ModelMgr.I.HuarongdaoModel.getSupportNumById(this.id);
        const supprotNumMax = ModelMgr.I.HuarongdaoModel.getTodaySupportMax();
        if (supportNum >= supprotNumMax) {
            MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.huarongdao_supportMaxTip), supprotNumMax));
            return;
        }

        const haveNum = RoleMgr.I.getCurrencyById(ItemCurrencyId.HuarongTicket);
        if (haveNum <= 0) {
            WinMgr.I.open(ViewConst.ItemSourceWin, ItemCurrencyId.HuarongTicket);
            MsgToastMgr.Show(i18n.tt(Lang.huarongdao_supportNoHave));
        } else {
            WinMgr.I.open(ViewConst.HuarongdaoSupport, this.id);
        }
    }

    /** ?????????????????? */
    public showSupportState(): void {
        if (ModelMgr.I.HuarongdaoModel.getMatchState() === HuarongdaoMatchState.wait) {
            this.NdSupport.active = this.NdSupportTag.active = false;
        } else if (ModelMgr.I.HuarongdaoModel.getMatchState() === HuarongdaoMatchState.support) {
            this.NdSupportTag.active = false;
            const supportype = ModelMgr.I.HuarongdaoModel.getSupportGenType();
            const NdBtnBg = this.BtnSupport.getChildByName('NdBtnBg').getComponent(cc.Sprite);
            if (!supportype) { // ?????????????????????
                this.NdSupport.active = true;
                this.BtnSupport.active = true;
                this.setGrayState(false, NdBtnBg);
            } else if (supportype !== this.Cfg_Gen.OddsType) { // ??????????????????????????????
                this.NdSupport.active = true;
                this.BtnSupport.active = false;
            } else {
                // ?????????????????????id??????
                const supportList = ModelMgr.I.HuarongdaoModel.getSupportGenArray();
                // ???????????????????????????
                const supportNum = ModelMgr.I.HuarongdaoModel.getSupportNumById(this.id);
                // ??????????????????????????????????????????
                const supprotNumMax = ModelMgr.I.HuarongdaoModel.getTodaySupportMax();

                if (supportList.indexOf(this.id) !== -1) { // ??????????????????????????????????????????????????????
                    this.NdSupport.active = true;
                    this.BtnSupport.active = true;
                    this.setGrayState(supportNum >= supprotNumMax, NdBtnBg);
                } else if (supportype === HuarongdaoGenType.main) { // ????????????????????????????????????????????????????????????????????????
                    this.NdSupport.active = true;
                    this.BtnSupport.active = false;
                } else {
                    this.NdSupport.active = true;
                    this.BtnSupport.active = supportList.length < 2;
                    if (supportList.length < 2) {
                        this.setGrayState(false, NdBtnBg);
                    }
                }
            }
            this.showSupportNum();
        } else {
            this.NdSupportTag.active = ModelMgr.I.HuarongdaoModel.getSupportNumById(this.id) > 0;
            this.NdSupport.active = false;
        }
    }

    /** ?????????????????????
     * @param gray ???????????? true-??? false-???
     * @param spr ???????????????
     */
    private setGrayState(gray: boolean, spr: cc.Sprite): void {
        const material = cc.Material.createWithBuiltin(gray ? '2d-gray-sprite' : '2d-sprite', 0);
        spr.setMaterial(0, material);
    }

    /** ???????????????????????? */
    private showSupportRate(): void {
        const entryInfo = ModelMgr.I.HuarongdaoModel.getEntryInfoById(this.id);
        if (entryInfo) {
            this.LabOdds.string = UtilString.FormatArgs(i18n.tt(Lang.huarongdao_odds_num.replace(/\s/g, ':')), entryInfo ? entryInfo.OddsRatio : 0);
            const support = ModelMgr.I.HuarongdaoModel.getSupportRateMap(this.id);
            this.LabSupport.string = UtilString.FormatArgs(i18n.tt(Lang.huarongdao_support_num.replace(/\s/g, ':')), support);
        }
    }

    /** ???????????????????????? */
    private showSupportNum() {
        const supportNum = ModelMgr.I.HuarongdaoModel.getSupportNumById(this.id);
        this.NdCoin.active = supportNum > 0;
        supportNum > 0 && (this.LbNum.string = `${supportNum}`);
        const cost = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongStakeCost');
        if (supportNum > 0) {
            const cfg = UtilItem.GetCfgByItemId(Number(cost.CfgValue));
            this.SprIcon.loadImage(UtilItem.GetItemIconPath(cfg.PicID, 1), 1, true);
        }
    }

    protected updatePerSecond(): void {
        if (this.NdSupport.active) { this.showSupportRate(); }
        this.showSupportState();
    }

    // update (dt) {}
}
