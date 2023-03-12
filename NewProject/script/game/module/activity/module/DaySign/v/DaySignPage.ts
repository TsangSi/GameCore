/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: wangxin
 * @Date: 2022-09-28 12:19:35
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\module\DaySign\v\DaySignPage.ts
 */
import { EventClient } from '../../../../../../app/base/event/EventClient';
import { EffectMgr } from '../../../../../manager/EffectMgr';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import ListView from '../../../../../base/components/listview/ListView';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import UtilItem from '../../../../../base/utils/UtilItem';
import UtilRedDot from '../../../../../base/utils/UtilRedDot';
import { ItemWhere } from '../../../../../com/item/ItemConst';
import { ItemIcon } from '../../../../../com/item/ItemIcon';
import { WinTabPage } from '../../../../../com/win/WinTabPage';
import { E } from '../../../../../const/EventName';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { DaySignItem } from './DaySignItem';
import { UtilColor } from '../../../../../../app/base/utils/UtilColor';
import { EMsgBoxModel } from '../../../../../com/msgbox/ConfirmBox';
import { UtilCocos } from '../../../../../../app/base/utils/UtilCocos';
import { DynamicImage } from '../../../../../base/components/DynamicImage';
import { ActData } from '../../../ActivityConst';
import { RES_ENUM } from '../../../../../const/ResPath';
import { UtilString } from '../../../../../../app/base/utils/UtilString';

const { ccclass, property } = cc._decorator;

@ccclass
export class DaySignPage extends WinTabPage {
    @property(DynamicImage)
    private SprBanner: DynamicImage = null;

    @property(cc.Node)
    private NdSignBtn: cc.Node = null;

    @property(ListView)
    private NdListView: ListView = null;

    @property(cc.Node)
    private NdJindu: cc.Node = null;

    @property(cc.Node)
    private NdLeiji: cc.Node = null;

    @property(cc.Prefab)
    private ItemIcon: cc.Prefab = null;

    private turnNum: number = 1;
    private SignUiData: S2CPlayerSignInUIData;
    private signData: Cfg_Server_DailySignReward[] = [];
    private isSign: boolean = false;
    private isSignAgain: boolean = false;
    private _containerId: number = 0;
    private _actId: number = 0;

    private addE() {
        EventClient.I.on(E.DaySign.UpdataUI, this.updataUi, this);
        EventClient.I.on(E.DaySign.UpdateOne, this.updateOne, this);
    }

    private remE(): void {
        EventClient.I.off(E.DaySign.UpdataUI, this.updataUi, this);
        EventClient.I.off(E.DaySign.UpdateOne, this.updateOne, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }

    protected start(): void {
        super.start();
        this.addE();
        console.log('监听');

        this.updataUi();
    }

    public init(winId: number, param: unknown[], tabIdx: number = 0): void {
        super.init(winId, param, tabIdx);
        this._containerId = winId; // param[0] as number;
        this.reqData(tabIdx);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number): void {
        super.refreshPage(winId, param, tabIdx);
        // console.log('************** refreshPage:', param, tabIdx);
        this.reqData(tabIdx);
    }

    private reqData(tabIdx: number) {
        const actIds: number[] = ModelMgr.I.ActivityModel.getActsByContainerId(this._containerId);
        this._actId = actIds[tabIdx];
        ControllerMgr.I.ActivityController.reqC2SGetActivityConfig(this._actId);
        ControllerMgr.I.DaySignController.reqC2SPlayerSignInUIData(this._actId);
    }

    private updataUi(): void {
        const signData = ModelMgr.I.DaySignModel.getPlayerSignInUIData(this._actId);
        if (!signData) return;
        this.SignUiData = signData;
        this.turnNum = this.SignUiData.ActData.CurTurnId;
        this.setSignUIData(true);
        this.setRewardItem();
        this.uptBanner();
    }

    private uptBanner() {
        const actData: ActData = ModelMgr.I.ActivityModel.getActivityData(this._actId);
        if (actData && actData.Config && actData.Config.BannerPath) {
            this.SprBanner.loadImage(actData.Config.BannerPath, 1, true);
        }
    }

    private updateOne(): void {
        const signData = ModelMgr.I.DaySignModel.getPlayerSignInUIData(this._actId);
        if (!signData) return;
        this.SignUiData = signData;
        this.turnNum = this.SignUiData.ActData.CurTurnId;
        this.setSignUIData(false);
        this.setRewardItem();
    }

    /** 获取签到面板UI日志 */
    private setSignUIData(uptAll: boolean): void {
        if (this.turnNum === null) return;
        this.signData = ModelMgr.I.DaySignModel.getCfgDailySignReward(this.turnNum, this._actId);
        this.signData.sort((a, b) => {
            if (a.SignDay !== b.SignDay) {
                return a.SignDay - b.SignDay;
            }
            return a.Id - b.Id;
        });

        if (uptAll) {
            this.NdListView.setNumItems(this.signData.length);
        } else {
            // 这里应该优化为只刷新单个
            // this.NdListView.updateItem(index);
            this.NdListView.setNumItems(this.signData.length);
        }

        // 本日是否已签到
        this.isSign = this.SignUiData.ActData.SignDays.indexOf(this.SignUiData.ActData.CurDay) >= 0;
        // 本日是否已再领一次
        this.isSignAgain = this.SignUiData.ActData.DoubleDays.indexOf(this.SignUiData.ActData.CurDay) >= 0;
        const canSignAgain: boolean = this.isSign
            && this.SignUiData.ActData.ChargeDays.indexOf(this.SignUiData.ActData.CurDay) >= 0
            && !this.isSignAgain;

        UtilRedDot.UpdateRed(this.NdSignBtn, !this.isSign || canSignAgain, cc.v2(90, 25));

        const Btnlabel = this.NdSignBtn.getComponentInChildren(cc.Label);

        // console.log('this.signData=', this.signData);
        // console.log('本日是否已签到=', this.isSign, '本日是否已再领一次', this.isSignAgain, 'canSignAgain=', canSignAgain);

        if (this.isSign) {
            // 已经再领一次了
            if (this.isSignAgain) {
                UtilColor.setGray(this.NdSignBtn, true);
                this.NdSignBtn.targetOff(this);
                Btnlabel.string = i18n.tt(Lang.day_next_day);
                Btnlabel.node.color = UtilColor.Hex2Rgba(UtilColor.GreyV);
                // this.NdSignBtn.getComponentInChildren(cc.LabelOutline).color = new cc.Color(92, 92, 92, 0.5);
            } else {
                // UtilColor.setGray(this.NdSignBtn, false);
                Btnlabel.string = i18n.tt(Lang.day_signAgain);
                Btnlabel.node.color = UtilColor.Hex2Rgba('#fff5b1');
                const btnImg = Btnlabel.node.parent.getComponent(cc.Sprite);
                UtilCocos.LoadSpriteFrame(btnImg, '/texture/com/btn/com_btn_a_02');
                // this.NdSignBtn.getComponentInChildren(cc.LabelOutline).color = UtilColor.Hex2Rgba('#B5283580');
                this.NdSignBtn.targetOff(this);
                UtilGame.Click(this.NdSignBtn, this.signAgain, this);
            }
        } else {
            UtilColor.setGray(this.NdSignBtn, false);
            Btnlabel.string = i18n.tt(Lang.day_sign_1);
            const btnImg = Btnlabel.node.parent.getComponent(cc.Sprite);
            UtilCocos.LoadSpriteFrame(btnImg, '/texture/com/btn/com_btn_a_01');
            Btnlabel.node.color = UtilColor.Hex2Rgba('#fffadb');
            // this.NdSignBtn.getComponentInChildren(cc.LabelOutline).color = UtilColor.Hex2Rgba('#B5283580');
            this.NdSignBtn.targetOff(this);
            UtilGame.Click(this.NdSignBtn, this.doSign, this);
        }
    }

    /** 点击按钮签到 */
    private doSign(): void {
        // 请求签到日期
        let nowDay: number = 1;
        // 当前已签到天数
        if (this.isSign) {
            MsgToastMgr.Show(i18n.tt(Lang.day_today_over));
            return;
        }
        nowDay = this.SignUiData.ActData.CurDay;

        ControllerMgr.I.DaySignController.reqSC2SPlayerSignIn(this.SignUiData.FuncId, nowDay);
    }

    private signAgain(): void {
        if (this.isSignAgain) {
            MsgToastMgr.Show(i18n.tt(Lang.day_signAgain_done));
            return;
        }
        const isRecharge = this.SignUiData.ActData.ChargeDays.indexOf(this.SignUiData.ActData.CurDay) >= 0;
        if (!isRecharge) {
            const str = UtilString.FormatArgs(i18n.tt(Lang.day_signAgain_uncharge), UtilColor.GreenV);
            ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${str}</c>`, null, null, null, EMsgBoxModel.Confirm);
            return;
        }
        ControllerMgr.I.DaySignController.reqC2SPlayerDoubleSignIn(this.SignUiData.FuncId, this.SignUiData.ActData.CurDay);
    }

    public ListRendEvent(item: cc.Node, i: number): void {
        // 奖励只配一个道具，为防止意外还是分割多个
        const itemD: string[] = this.signData[i].Prize.split('|')[0].split(':');
        const itemNum: number = parseInt(itemD[1]);
        const itemId: number = parseInt(itemD[0]);
        // 已签到
        const thisSign = this.SignUiData.ActData.SignDays.indexOf(this.signData[i].SignDay) >= 0;
        // 已补签天数
        const reSign = this.SignUiData.ActData.RemedyDays.indexOf(this.signData[i].SignDay) >= 0;
        // 是否已再领一次
        const isSignAgain = this.SignUiData.ActData.DoubleDays.indexOf(this.signData[i].SignDay) >= 0;
        // 是否有充值
        // const isRechage = this.SignUiData.ActData.ChargeDays.indexOf(this.signData[i].SignDay) >= 0;

        let reState: boolean = true;
        // 小于当天
        if (this.signData[i].SignDay < this.SignUiData.ActData.CurDay) {
            reState = thisSign || reSign;
        }
        // 已补签天数
        let tag: number = 0;
        if (thisSign || reSign) {
            tag = !isSignAgain && this.signData[i].SignDay === this.SignUiData.ActData.CurDay ? 1 : 2;
        } else if (!reState) {
            tag = 3;
        }
        // console.log(i, '已签到?', thisSign, '已补签?', reSign, '已再领一次?', isSignAgain, 'tag=', tag);
        item.getComponent(DaySignItem).setData(this.SignUiData.FuncId, itemId, itemNum, i, tag, this.signData[i].SignDay, this.SignUiData.ActData.CurDay);
    }

    /** 累计奖励 */
    public setRewardItem(): void {
        // 已签到天数
        this.NdJindu.getChildByName('NdLJ').removeAllChildren();
        this.NdJindu.getChildByName('NdLJ').destroyAllChildren();
        const countNum = this.signData.length;
        const okNum = this.SignUiData.ActData.SignDays.length + this.SignUiData.ActData.RemedyDays.length;
        const onNum = okNum / this.signData.length;
        this.NdJindu.getComponentInChildren(cc.ProgressBar).progress = onNum;
        const nw = this.NdJindu.width;
        const rewardData: Cfg_Server_DailySignNumReward[] = ModelMgr.I.DaySignModel.getCfgDailySignNumReward(this.SignUiData.ActData.CurTurnId, this._actId);
        // console.log('累计签到', rewardData);
        let redStats: boolean = false;
        rewardData.forEach((v) => {
            const pos = cc.v2(v.DayNum / countNum * nw, 0);
            const _reItem = cc.instantiate(this.NdLeiji);
            _reItem.active = true;
            _reItem.setPosition(pos);
            this.NdJindu.getChildByName('NdLJ').addChild(_reItem);

            // 奖励道具
            const itemPos: cc.Node = _reItem.getChildByName('ItemPos');
            const _itemIcon = cc.instantiate(this.ItemIcon);
            const itemInfo = v.Prize.split('|')[0].split(':');
            const _ItemModel = UtilItem.NewItemModel(parseInt(itemInfo[0]), parseInt(itemInfo[1]));
            _itemIcon.getComponent(ItemIcon).setData(_ItemModel, { needNum: true, where: ItemWhere.OTHER, numScale: 1.5 });
            itemPos.getChildByName('item').addChild(_itemIcon);
            // 按钮
            const Click = _reItem.getChildByName('Click');
            _reItem.getChildByName('NdBtn').getComponentInChildren(cc.Label).string = `${v.DayNum} ${i18n.tt(Lang.com_day)}`;
            // 是否已当前领取累计奖励 已领取 true, 未领取 false;
            const hasGet = this.SignUiData.ActData.SignNumRewardDays.indexOf(v.DayNum) !== -1;
            Click.active = false;
            if (okNum >= v.DayNum && !hasGet) {
                // _itemIcon.getComponent(ItemIcon).refreshStreamerEffect(ItemQuality.RED);
                EffectMgr.I.showEffect(RES_ENUM.Item_Ui_118, itemPos);
                redStats = redStats || true;
                Click.active = true;
            } else {
                _itemIcon.getComponent(ItemIcon).offStreamerEffect();
            }
            if (hasGet) {
                _reItem.getChildByName('NdMask').active = true;
                _itemIcon.getComponent(ItemIcon).offStreamerEffect();
            }

            // 已领取天数 与 已签到天数小于当前选中天数
            UtilGame.Click(
                Click,
                () => {
                    if (hasGet) {
                        MsgToastMgr.Show(i18n.tt(Lang.com_received));
                    } else {
                        ControllerMgr.I.DaySignController.reqC2SPlayerSignInNumReward(this.SignUiData.FuncId, v.DayNum);
                    }
                },
                this,
            );
        });
    }
}
