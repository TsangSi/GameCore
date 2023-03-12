/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: lijun
 * @Date: 2023-02-20 19:58:01
 * @Description:
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemCurrencyId } from '../../../com/item/ItemConst';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import { IChatCommonData } from '../../chat/ChatConst';
import ChatCommon from '../../chat/v/ChatCommon';
import { Link } from '../../link/Link';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { HuarongdaoMatchState, IHuarongdaoActivityTimeStep } from '../HuarongdaoConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HuarongdaoHandlerView extends BaseCmp {
    @property(cc.Label)
    private LblTime1: cc.Label = null;
    @property(cc.Label)
    private LblTime2: cc.Label = null;
    @property(cc.Label)
    private LblMatchTimes: cc.Label = null;
    @property(cc.Label)
    private LblTimeCount: cc.Label = null;
    @property(cc.Label)
    private LblTimeCount2: cc.Label = null;
    @property(cc.Label)
    private LblHaveTip: cc.Label = null;
    @property(cc.Label)
    private LblHaveNum: cc.Label = null;

    @property(cc.Node)
    private BtnShop: cc.Node = null;
    @property(cc.Node)
    private BtnRecord: cc.Node = null;
    @property(cc.Toggle)
    private TgBulletChat: cc.Toggle = null;
    @property(cc.Node)
    private BtnBuy: cc.Node = null;

    @property(DynamicImage)
    private SprIcon: DynamicImage = null;

    @property(cc.Node)
    private NdChat: cc.Node = null;

    private _waitTime: number = 0;// 倒计时
    private _matchTime: number = -1;// 比赛统计
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnShop, () => {
            Link.To(FuncId.HuarongdaoShop);
        }, this);

        UtilGame.Click(this.BtnBuy, () => {
            WinMgr.I.open(ViewConst.HuarongdaoGiftBuy);
        }, this);

        UtilGame.Click(this.BtnRecord, () => {
            WinMgr.I.open(ViewConst.HuarongdaoRecord);
        }, this);

        this.TgBulletChat.node.on('toggle', () => {
            EventClient.I.emit(E.Huarongdao.ToggleBulletChat, this.TgBulletChat.isChecked);
        });

        this.addE();
        this.updateUI();

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.ChatCommon, this.NdChat, (err, node) => {
            const chatCom = node.getComponent(ChatCommon);
            const wordPos = this.NdChat.convertToWorldSpaceAR(cc.v2(0, 0));
            const data: IChatCommonData = {
                id: UI_PATH_ENUM.HuarongdaoHandlerView,
                moveContent: new cc.Rect(
                    0 - wordPos.x + 20,
                    0,
                    cc.view.getVisibleSize().width - 20,
                    cc.view.getVisibleSize().height - wordPos.y - 100,
                ),
                pos: cc.v3(0, 0, 0),
            };
            chatCom.setData(data);
        });
    }

    protected addE(): void {
        RoleMgr.I.on(
            this.currencyChange,
            this,
            RoleAN.N.HuarongTicket,
        );
    }

    protected remE(): void {
        RoleMgr.I.off(
            this.currencyChange,
            this,
            RoleAN.N.HuarongTicket,
        );
    }

    /** UI展示 */
    private updateUI(): void {
        // this.LblTime1.string = i18n.tt(Lang.huarongdao_active_time_tip);
        // this.LblTime2.string = i18n.tt(Lang.huarongdao_active_time);
        this.LblHaveTip.string = i18n.tt(Lang.huarongdao_have_tip);

        const cost = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongStakeCost');
        const cfg = UtilItem.GetCfgByItemId(Number(cost.CfgValue));
        this.SprIcon.loadImage(UtilItem.GetItemIconPath(cfg.PicID, 1), 1, true);

        this.currencyChange();
    }

    /** 礼券数量 */
    private currencyChange(): void {
        this.LblHaveNum.string = UtilNum.Convert(RoleMgr.I.getCurrencyById(ItemCurrencyId.HuarongTicket));
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }

    /** 根据时间阶段刷新ui */
    public updateTimeStep(activityStep: IHuarongdaoActivityTimeStep): void {
        if (activityStep.type === HuarongdaoMatchState.wait) { // 等待开始阶段，显示距离开始倒计时
            this.LblMatchTimes.string = UtilString.FormatArgs(
                i18n.tt(Lang.huarongdao_supportTimes),
                UtilNum.ToChinese(ModelMgr.I.HuarongdaoModel.getActivityCycNo()),
            );
            this._waitTime = activityStep.time;
            this.showWaitTimeUI();
        } else if (activityStep.type === HuarongdaoMatchState.support) { // 押注阶段，显示剩余押注时间
            this.LblMatchTimes.string = UtilString.FormatArgs(
                i18n.tt(Lang.huarongdao_supportTimes),
                UtilNum.ToChinese(ModelMgr.I.HuarongdaoModel.getActivityCycNo()),
            );
            this._waitTime = activityStep.time;
            this.showWaitTimeUI();
        } else if (activityStep.type === HuarongdaoMatchState.match) { // 赛跑阶段，赛跑时间统计
            this.LblMatchTimes.string = UtilString.FormatArgs(
                i18n.tt(Lang.huarongdao_matchTimes),
                UtilNum.ToChinese(ModelMgr.I.HuarongdaoModel.getActivityCycNo()),
            );
            this.showMatchTimeUI();
        } else if (activityStep.type === HuarongdaoMatchState.over) { // 解散时间，显示活动结束倒计时
            this.LblMatchTimes.string = UtilString.FormatArgs(
                i18n.tt(Lang.huarongdao_matchTimes),
                UtilNum.ToChinese(ModelMgr.I.HuarongdaoModel.getActivityCycNo()),
            );
            this._waitTime = activityStep.time;
            this.showEndUI();
        }
    }

    /** 支持 */
    private showWaitTimeUI(): void {
        this.LblTimeCount.string = i18n.tt(Lang.huarongdao_supportTimes_sche);
        this.LblTimeCount2.node.x = -176.102;
        this.showWaitTime();
    }

    /** 支持倒计时 */
    private showWaitTime(): void {
        this.LblTimeCount2.string = UtilTime.FormatHourDetail(this._waitTime, true);
    }

    /** 追逐 */
    private showMatchTimeUI(): void {
        this.LblTimeCount.string = i18n.tt(Lang.huarongdao_timeCount);
        this.LblTimeCount2.node.x = -195;
        this.showMatchTime();
    }

    /** 追逐计时 */
    private showMatchTime(): void {
        let time = this._matchTime;
        if (time < 0) {
            time = ModelMgr.I.HuarongdaoModel.getMatchTimeCount();
        }
        this.LblTimeCount2.string = `${time}${i18n.tt(Lang.huarongdao_time_unit)}`;
    }

    /** 结算 */
    private showEndUI(): void {
        this.LblTimeCount.string = i18n.tt(Lang.huarongdao_endTip);
        this.LblTimeCount2.node.x = -205;
        this.showEndTime();
    }

    /** 结算倒计时 */
    private showEndTime(): void {
        this.LblTimeCount2.string = UtilTime.FormatHourDetail(this._waitTime, true);
    }

    public updateSecond(): void {
        if (this._waitTime > 0 && ModelMgr.I.HuarongdaoModel.getMatchState() < HuarongdaoMatchState.match) { // 等待倒计时
            this._waitTime = ModelMgr.I.HuarongdaoModel.getActivityLeastTime(ModelMgr.I.HuarongdaoModel.getMatchState());
            this.showWaitTime();
        } else if (ModelMgr.I.HuarongdaoModel.getMatchState() === HuarongdaoMatchState.match) { // 赛跑时间统计
            if (this._matchTime === -1) {
                this._matchTime = ModelMgr.I.HuarongdaoModel.getMatchTimeCount();
                if (this._matchTime === 0) { this._matchTime++; }
            } else {
                this._matchTime++;
            }
            this.showMatchTime();
        } else if (this._waitTime > 0 && ModelMgr.I.HuarongdaoModel.getMatchState() === HuarongdaoMatchState.over) { // 结算倒计时
            this._waitTime = ModelMgr.I.HuarongdaoModel.getActivityLeastTime(ModelMgr.I.HuarongdaoModel.getMatchState());
            this.showEndTime();
        }
    }

    protected onDisable(): void {
        super.onDisable();
        this._matchTime = -1;
    }
}
