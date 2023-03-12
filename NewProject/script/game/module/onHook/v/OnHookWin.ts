/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-09-15 12:14:00
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\onHook\v\OnHookWin.ts
 * @Description:
 */
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import { TickTimer } from '../../../base/components/TickTimer';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import ModelMgr from '../../../manager/ModelMgr';
import { ItemIcon } from '../../../com/item/ItemIcon';
import UtilItem from '../../../base/utils/UtilItem';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { RoleMgr } from '../../role/RoleMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { i18n, Lang } from '../../../../i18n/i18n';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ItemCurrencyId, ItemType } from '../../../com/item/ItemConst';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { FuncId } from '../../../const/FuncConst';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { FuncDescConst } from '../../../const/FuncDescConst';
import { EIncreaseType, IBuffAddEffectData } from '../../buff/BuffConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class OnHookWin extends WinBase {
    @property(cc.Node)
    private LabClose: cc.Node = null;
    @property(cc.Label)
    private LabGuanka: cc.Label = null;
    @property(TickTimer)
    private TickTime: TickTimer = null;
    // 收益
    @property(cc.Node)
    private NdNoAward: cc.Node = null;
    @property(ListView)
    private ListItem: ListView = null;
    @property(DynamicImage)
    private NdExpIcon: DynamicImage = null;
    @property(cc.Label)
    private LabExp: cc.Label = null;
    @property(DynamicImage)
    private NdCoinIcon: DynamicImage = null;
    @property(cc.Label)
    private LabCoin: cc.Label = null;
    // 快速挂机
    @property(cc.Label)
    private LabPrice: cc.Label = null;
    @property(cc.Label)
    private LabQuick: cc.Label = null;
    @property(cc.Label)
    private LabLeft: cc.Label = null;
    @property(cc.Label)
    private LabVip: cc.Label = null;
    @property(cc.Label)
    private LabExNum: cc.Label = null;
    @property(cc.Node)
    private NdEx: cc.Node = null;

    @property(cc.Node)
    private BtnConfirm: cc.Node = null;
    @property(cc.Node)
    private BtnPrice: cc.Node = null;
    @property(cc.Node)
    private BtnFree: cc.Node = null;
    @property(cc.Node)
    private BtnNoTimes: cc.Node = null;
    @property(cc.Node)
    private BtnHelp: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;

    @property(cc.Node)
    private BtnHookTips: cc.Node = null;

    /** 挂机奖励的时间上限 */
    private _maxTime: number = 0;
    /** 已挂机时间 */
    private _AFKTime: number = 0;
    private _AFKRewards: ItemInfo[] = [];
    private _AFKEta: ItemInfo[] = [];
    private _cfg: ConfigIndexer = null;
    private _gap: number = 60;

    private addEffectData: IBuffAddEffectData = cc.js.createMap(true);
    protected start(): void {
        super.start();
        this.addEffectData = ModelMgr.I.BuffModel.getAddEffectByTypes([EIncreaseType.OnHookExp, EIncreaseType.OnHookMoney]);
        this._cfg = Config.Get(Config.Type.Cfg_Config_AFK);
        const cfg: Cfg_Config_AFK = this._cfg.getValueByKey('AFKPrizeTimeInternal');
        this._gap = +cfg.CfgValue;

        this.clk();
        this.addE();
        this.uptUI(true);

        ControllerMgr.I.OnHookController.reqAFKInfo();
        // ControllerMgr.I.OnHookController.reqRewardAdd();
    }

    private clk() {
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });

        UtilGame.Click(this.LabClose, () => {
            this.close();
        }, this);

        UtilGame.Click(this.BtnConfirm, () => {
            ControllerMgr.I.OnHookController.reqAFKReward();
            EventClient.I.emit(E.OnHook.FlyCoinExp);
            this.close();
        }, this);

        UtilGame.Click(this.BtnPrice, () => {
            if (ModelMgr.I.OnHookModel.RemainQuickTimes > 0) {
                const cost = ModelMgr.I.OnHookModel.MoneyCost;
                if (!RoleMgr.I.checkCurrency(ItemCurrencyId.JADE, cost)) {
                    // WinMgr.I.open(ViewConst.ItemSourceWin, ItemCurrencyId.JADE);
                    WinMgr.I.open(ViewConst.VipSuperWin, 0);
                } else {
                    ControllerMgr.I.OnHookController.reqQuickAFK();
                }
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.onhook_buzu));
            }
        }, this);

        UtilGame.Click(this.BtnFree, () => {
            if (UtilFunOpen.isOpen(FuncId.OnHookQuick, true)) {
                if (ModelMgr.I.OnHookModel.RemainQuickTimes > 0) {
                    ControllerMgr.I.OnHookController.reqQuickAFK();
                } else {
                    MsgToastMgr.Show(i18n.tt(Lang.onhook_buzu));
                }
            }
        }, this);

        UtilGame.Click(this.BtnHookTips, () => {
            WinMgr.I.open(ViewConst.OnHoolTips, this.addEffectData?.skillIds);
        }, this);

        UtilGame.Click(this.BtnNoTimes, () => {
            MsgToastMgr.Show(i18n.tt(Lang.onhook_buzu));
        }, this);

        UtilGame.Click(this.BtnHelp, () => {
            WinMgr.I.open(ViewConst.DescWinTip, FuncDescConst.OnHook);
        }, this);

        UtilGame.Click(this.BtnClose, () => {
            this.close();
        }, this);
    }

    private addE() {
        EventClient.I.on(E.OnHook.AFKInfo, this.uptUI, this);
        EventClient.I.on(E.OnHook.GetAward, this.uptUI, this);
        EventClient.I.on(E.OnHook.QuickAFK, this.uptUI, this);
        EventClient.I.on(E.OnHook.RewardAdd, this.uptUI, this);
    }

    private remE() {
        EventClient.I.off(E.OnHook.AFKInfo, this.uptUI, this);
        EventClient.I.off(E.OnHook.GetAward, this.uptUI, this);
        EventClient.I.off(E.OnHook.QuickAFK, this.uptUI, this);
        EventClient.I.off(E.OnHook.RewardAdd, this.uptUI, this);
    }

    private uptUI(isInit: boolean) {
        this.uptTime();
        this.uptAward(isInit);

        // 关卡
        const info = ModelMgr.I.GameLevelModel.getUserLevel();
        this.LabGuanka.string = `${info.chapter}-${info.level} ${info.name}`;

        const cfg: Cfg_Config_AFK = this._cfg.getValueByKey('FastAFKPrizeTime');
        this.LabQuick.string = `${UtilTime.FormatTime(+cfg.CfgValue, '%mm分钟', false)}${i18n.tt(Lang.onhook_afk)}`;
        this.LabLeft.string = `${ModelMgr.I.OnHookModel.RemainQuickTimes}${i18n.tt(Lang.onhook_ci)}`;

        // vip
        const vipName = this.getMoreTimesVipName();
        if (vipName) {
            this.NdEx.active = true;
            this.LabVip.string = vipName;
            this.LabExNum.string = `1${i18n.tt(Lang.onhook_ci)}`;
        } else {
            this.NdEx.active = false;
        }

        const isQuickOpen = UtilFunOpen.canShow(FuncId.OnHookQuick);
        // 快速按钮
        const leftTimes = ModelMgr.I.OnHookModel.RemainQuickTimes;
        if (leftTimes > 0) {
            const cost = ModelMgr.I.OnHookModel.MoneyCost;
            if (cost === 0) {
                this.BtnFree.active = true;
                if (isQuickOpen) {
                    UtilCocos.SetSpriteGray(this.BtnFree, false);
                    this.BtnFree.getChildByName('NdRed').active = true;
                } else {
                    UtilCocos.SetSpriteGray(this.BtnFree, true);
                    this.BtnFree.getChildByName('NdRed').active = false;
                }

                this.BtnPrice.active = false;
            } else {
                this.BtnFree.active = false;
                this.BtnPrice.active = true;
                this.LabPrice.string = `${cost}`;
            }
            this.BtnNoTimes.active = false;
        } else {
            this.BtnFree.active = false;
            this.BtnPrice.active = false;
            this.BtnNoTimes.active = true;
            UtilCocos.SetSpriteGray(this.BtnNoTimes, true);
        }
    }

    private getMoreTimesVipName(): string {
        const vip = RoleMgr.I.d.VipLevel;
        const cfg: ConfigIndexer = Config.Get(Config.Type.Cfg_VIP);
        const curCfg: Cfg_VIP = cfg.getValueByKey(vip);

        let curTimes: number = 0;
        if (curCfg) {
            curTimes = +curCfg.AFKTimes.split(':')[1];
        }

        let next: number = vip + 1;
        let nextCfg: Cfg_VIP = cfg.getValueByKey(next);
        while (nextCfg) {
            const nextTimes: number = +nextCfg.AFKTimes.split(':')[1];
            if (nextTimes > curTimes) {
                return nextCfg.VIPName;
            }
            next++;
            nextCfg = cfg.getValueByKey(next);
        }
        return '';
    }

    private uptTime() {
        const cfg: Cfg_Config_AFK = this._cfg.getValueByKey('AFKPrizeMaxTime');
        this._maxTime = +cfg.CfgValue;
        this._AFKTime = ModelMgr.I.OnHookModel.AFKTime;
        if (this._AFKTime > this._maxTime) {
            this._AFKTime = this._maxTime;
        }
        this.TickTime.tick2(this._AFKTime, this._maxTime, '%HH:%mm:%ss', true, true, true);
        this.TickTime.removeEndEventHandler(this.node, 'OnHookWin', 'onTick');
        this.TickTime.addTickEventHandler(this.node, 'OnHookWin', 'onTick');
        // 领取按钮红点
        const isRed: boolean = this._AFKTime >= this._maxTime;
        UtilRedDot.UpdateRed(this.BtnConfirm, isRed, cc.v2(72, 18));
    }

    private onTick(left: number): void {
        this._AFKTime = left;
        if (this._AFKTime > this._maxTime) {
            this._AFKTime = this._maxTime;
        }
        if (this._AFKTime % this._gap === 0) {
            ControllerMgr.I.OnHookController.reqAFKInfo();
        }
        // 领取按钮红点
        const isRed: boolean = this._AFKTime >= this._maxTime;
        UtilRedDot.UpdateRed(this.BtnConfirm, isRed, cc.v2(72, 18));
    }

    private uptAward(isInit: boolean) {
        this._AFKRewards = ModelMgr.I.OnHookModel.AFKRewards;
        this.NdNoAward.active = this._AFKRewards.length === 0;
        this.ListItem.node.active = this._AFKRewards.length > 0;
        this.BtnConfirm.active = this._AFKRewards.length > 0;
        this.BtnHookTips.active = this.addEffectData.skillIds.length > 0;
        // 因为奖励的id是固定的且顺序也是固定的，可以采用updateItem
        if (isInit || !this.ListItem.numItems || this._AFKRewards.length !== this.ListItem.numItems) {
            this.ListItem.setNumItems(this._AFKRewards.length);
        } else {
            for (let i = 0; i < this._AFKRewards.length; i++) {
                this.ListItem.updateItem(i);
            }
        }

        this._AFKEta = ModelMgr.I.OnHookModel.AFKEta;
        if (this._AFKEta && this._AFKEta[0]) {
            this.NdExpIcon.node.active = true;
            this.LabExp.node.active = true;
            const costImgUrl: string = UtilCurrency.getIconByCurrencyType(this._AFKEta[0].ItemId);
            this.NdExpIcon.loadImage(costImgUrl, 1, true);
            this.LabExp.string = `${UtilNum.Convert(this._AFKEta[0].ItemNum)}${i18n.tt(Lang.onhook_mins)}`;
        } else {
            this.NdExpIcon.node.active = false;
            this.LabExp.node.active = false;
        }

        if (this._AFKEta && this._AFKEta[1]) {
            this.NdCoinIcon.node.active = true;
            this.LabCoin.node.active = true;
            const costImgUrl: string = UtilCurrency.getIconByCurrencyType(this._AFKEta[1].ItemId);
            this.NdCoinIcon.loadImage(costImgUrl, 1, true);
            this.LabCoin.string = `${UtilNum.Convert(this._AFKEta[1].ItemNum)}${i18n.tt(Lang.onhook_mins)}`;
        } else {
            this.NdCoinIcon.node.active = false;
            this.LabCoin.node.active = false;
        }
    }

    private createLabel(parent: cc.Node): cc.Node {
        const ndRwAdd = UtilCocos.NewNode(parent, [cc.Label, cc.LabelOutline]);
        ndRwAdd.color = UtilColor.Hex2Rgba(UtilColor.GreenBtn);
        ndRwAdd.name = 'onHookAdd';
        ndRwAdd.setPosition(45, 33);
        ndRwAdd.anchorX = 1;
        // 描边
        const LabelOutline = ndRwAdd.getComponent(cc.LabelOutline);
        LabelOutline.color = UtilColor.Hex2Rgba('#000000');
        LabelOutline.color.a = 255 * 0.6;
        // 设置游戏字体
        const Ndlabel = ndRwAdd.getComponent(cc.Label);
        ResMgr.I.loadLocal('font/FZSHENGSKSJW', cc.Font, (err, _font: cc.Font) => {
            if (err) {
                return;
            }
            if (Ndlabel && Ndlabel.isValid) {
                Ndlabel.font = _font;
                Ndlabel.fontSize = 24;
                Ndlabel.lineHeight = 30;
            }
        });
        return ndRwAdd;
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data = this._AFKRewards[idx];
        const item: ItemIcon = node.getComponent(ItemIcon);
        let ndRwAdd: cc.Node = node.getChildByName('onHookAdd');
        if (!ndRwAdd) {
            ndRwAdd = this.createLabel(node);
        }
        if (data && item) {
            const itemModel = UtilItem.NewItemModel(data.ItemId, data.ItemNum);
            item.setData(itemModel, { needName: false, needNum: true, num1Show: false });
            let mathC: number = 0;
            if (data.ItemId === ItemCurrencyId.EXP) {
                mathC = this.addEffectData.addEffect[EIncreaseType.OnHookExp];
            } else if (data.ItemId === ItemCurrencyId.COIN) {
                mathC = this.addEffectData.addEffect[EIncreaseType.OnHookMoney];
            }
            const Ndlabel = ndRwAdd.getComponent(cc.Label);
            ndRwAdd.active = mathC > 0;
            if (mathC > 0) {
                Ndlabel.string = `+${mathC / 100}%`;
            }
        }
    }

    protected close(): void {
        super.close();
    }

    public onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
