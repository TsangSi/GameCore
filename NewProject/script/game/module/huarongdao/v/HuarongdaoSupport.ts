/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: lijun
 * @Date: 2023-02-20 21:59:04
 * @Description:
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { HuarongdaoMatchState, IHuarongdaoSupportGenInfo } from '../HuarongdaoConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HuarongdaoSupport extends WinCmp {
    @property(cc.Label)
    private LblName: cc.Label = null;
    @property(cc.Label)
    private LblOdds: cc.Label = null;
    @property(cc.Label)
    private LblSupport: cc.Label = null;
    @property(cc.Label)
    private LblCurrentTip: cc.Label = null;
    @property(cc.Label)
    private LblCurrentNum: cc.Label = null;
    @property(cc.Label)
    private LblSupportNum: cc.Label = null;
    @property(cc.Node)
    private BtnConfirm: cc.Node = null;
    @property(cc.Node)
    private BtnReduce5: cc.Node = null;
    @property(cc.Node)
    private BtnReduce1: cc.Node = null;
    @property(cc.Node)
    private BtnAdd1: cc.Node = null;
    @property(cc.Node)
    private BtnAdd5: cc.Node = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(DynamicImage)
    private SprQualityBg: DynamicImage = null;
    @property(DynamicImage)
    private SprQualityKuang: DynamicImage = null;
    @property(DynamicImage)
    private SprCoin: DynamicImage = null;

    private id: number = 0;
    private supprotNum = 0;
    private Cfg_Gen: Cfg_HuarongdaoGen;
    private _data: IHuarongdaoSupportGenInfo = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnConfirm, () => {
            this.confirmSupport();
        }, this);
        UtilGame.Click(this.BtnReduce1, () => {
            this.hanelerSupprotNum(-1);
        }, this);
        UtilGame.Click(this.BtnReduce5, () => {
            this.hanelerSupprotNum(-5);
        }, this);
        UtilGame.Click(this.BtnAdd1, () => {
            this.hanelerSupprotNum(1);
        }, this);
        UtilGame.Click(this.BtnAdd5, () => {
            this.hanelerSupprotNum(5);
        }, this);
    }

    protected onEnable(): void {
        super.onEnable();
        this.loadSupprotNum();
    }

    public init(param: unknown[]): void {
        this.id = param[0] as number;
        this.Cfg_Gen = ModelMgr.I.HuarongdaoModel.getGenValueByKey(this.id);
        this.addE();
        this.loadSupprotNum();
        this.updateSupportRate();
        this.updateUI();
        this.showView();
        this.updateCurrentNum();
        this.updateSupportNum();
    }

    /** 读取配置常量 */
    private loadSupprotNum(): void {
        const cost = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongdaoInitStake');
        this.supprotNum = Number(cost.CfgValue);
    }

    /** 页面显示 */
    private updateUI(): void {
        const entryInfo = ModelMgr.I.HuarongdaoModel.getEntryInfoById(this.id);
        this.LblOdds.string = UtilString.FormatArgs(i18n.tt(Lang.huarongdao_odds_num), entryInfo ? entryInfo.OddsRatio : 0);
        const BtnConfirmlabel = this.BtnConfirm.getComponentInChildren(cc.Label);
        BtnConfirmlabel.string = i18n.tt(Lang.com_btn_confirm_1);

        const cost = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongStakeCost');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const cfg = UtilItem.GetCfgByItemId(Number(cost.CfgValue));
        this.SprCoin.loadImage(UtilItem.GetItemIconPath(cfg.PicID, 1), 1, true);
    }

    /** 显示武将 */
    private showView(): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.LblName.string = i18n.tt(this.Cfg_Gen.Name);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        UtilCocos.setLableQualityColor(this.LblName, this.Cfg_Gen.OddsTime);
        const headIcon = this.Cfg_Gen.Image === 1001 ? 20001 : this.Cfg_Gen.Image;
        this.SprIcon.loadImage(`${RES_ENUM.HeadIcon}${headIcon}`, 1, true);
        // 品质底图
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.SprQualityBg.loadImage(UtilItem.GetItemQualityBgPath(this.Cfg_Gen.OddsTime), 1, true);
    }

    protected addE(): void {
        EventClient.I.on(E.Huarongdao.SupportRateData, this.updateSupportRate, this);
        EventClient.I.on(E.Huarongdao.SupportResult, this.onSupportResult, this);
    }

    protected remE(): void {
        EventClient.I.off(E.Huarongdao.SupportRateData, this.updateSupportRate, this);
        EventClient.I.off(E.Huarongdao.SupportResult, this.onSupportResult, this);
    }

    /** 显示支持率数据 */
    private updateSupportRate(): void {
        const support = ModelMgr.I.HuarongdaoModel.getSupportRateMap(this.id);
        this.LblSupport.string = UtilString.FormatArgs(i18n.tt(Lang.huarongdao_support_num.replace(/\s/g, '')), support);
    }

    /** 显示支持数量比值 */
    private updateCurrentNum(): void {
        const supprotNum = ModelMgr.I.HuarongdaoModel.getSupportNumById(this.id);
        const supprotNumMax = ModelMgr.I.HuarongdaoModel.getTodaySupportMax();
        this.LblCurrentNum.string = `${supprotNum}/${supprotNumMax}`;
    }

    /** 显示支持数量 */
    private updateSupportNum(): void {
        this.LblSupportNum.string = `${this.supprotNum}`;
    }

    /** 处理点击加减数量 */
    private hanelerSupprotNum(num: number): void {
        const supprotNumMax = ModelMgr.I.HuarongdaoModel.getTodaySupportMax();
        const supprotNum = ModelMgr.I.HuarongdaoModel.getSupportNumById(this.id);
        if (this.supprotNum + num < 1) {
            MsgToastMgr.Show(i18n.tt(Lang.huarongdao_supportLeastTip));
            num = 0;
            this.supprotNum = 1;
        } else if (this.supprotNum + num + supprotNum > supprotNumMax) {
            num = supprotNumMax - this.supprotNum - supprotNum;
            if (num > 0) {
                const costCfg = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongStakeCost');
                const constId = Number(costCfg.CfgValue);
                const haveNum = RoleMgr.I.getCurrencyById(constId);
                if (haveNum < this.supprotNum + num) {
                    num = haveNum - this.supprotNum;

                    if (num <= 0) {
                        MsgToastMgr.Show(i18n.tt(Lang.huarongdao_supportNoHave));
                        return;
                    }
                } else {
                    // MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.huarongdao_supportMaxTip), supprotNumMax));
                }
            } else {
                MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.huarongdao_supportMaxTip), supprotNumMax));
            }
        }

        if (num > 0) {
            const costCfg = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongStakeCost');
            const constId = Number(costCfg.CfgValue);
            const haveNum = RoleMgr.I.getCurrencyById(constId);
            if (haveNum < this.supprotNum + num) {
                num = haveNum - this.supprotNum;

                if (num <= 0) {
                    MsgToastMgr.Show(i18n.tt(Lang.huarongdao_supportNoHave));
                    return;
                }
            }
        }

        this.supprotNum += num;
        this.updateSupportNum();
    }

    private confirmSupport() {
        if (ModelMgr.I.HuarongdaoModel.getMatchState() !== HuarongdaoMatchState.support) {
            MsgToastMgr.Show(i18n.tt(Lang.huarongdao_support_time_pass));
            this.close();
        } else {
            ControllerMgr.I.HuarongdaoController.reqC2SHuarongBet(this.id, this.supprotNum);
        }
    }

    private onSupportResult(data): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data.Tag === 0) {
            EventClient.I.emit(E.Huarongdao.SupportStateUpdate);
            MsgToastMgr.Show(i18n.tt(Lang.huarongdao_support_success_tip));
            this.close();
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }

    // update (dt) {}
}
