/*
 * @Author: dcj
 * @Date: 2022-08-26 10:58:11
 * @FilePath: \SanGuo2.4\assets\script\game\module\worldBoss\v\WorldBossMJPage.ts
 * @Description:名将来袭
 */
import { Config } from '../../../base/config/Config';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../../com/item/ItemIcon';
import { WinTabPage } from '../../../com/win/WinTabPage';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilGame } from '../../../base/utils/UtilGame';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { ECfgWorldBossConfigKey } from '../WorldBossConst';
import { WorldBossModel } from '../WorldBossModel';
import ModelMgr from '../../../manager/ModelMgr';
import { FuBenMgr } from '../../fuben/FuBenMgr';
import { EMapID } from '../../../map/MapCfg';
import { ACTION_TYPE, ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import UtilItemList from '../../../base/utils/UtilItemList';
import { i18n, Lang } from '../../../../i18n/i18n';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import ControllerMgr from '../../../manager/ControllerMgr';
import { ETimerActId } from '../../activity/timerActivity/TimerActivityConst';
import UtilGeneral from '../../../base/utils/UtilGeneral';
import ActivityMgr from '../../activity/timerActivity/ActivityMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { TabPagesView } from '../../../com/win/WinTabPageView';

const { ccclass, property } = cc._decorator;
@ccclass
export class WorldBossMJPage extends TabPagesView { // WinTabPage
    @property(cc.Node)
    private NdTopContent: cc.Node = null;
    @property(cc.Node)
    private NdMj: cc.Node = null;
    @property(cc.Node)
    private NdTime: cc.Node = null;
    @property(cc.Node)
    private NdStartTime: cc.Node = null;
    private StartTime: cc.Node = null;
    @property(cc.Label)
    private LabTT: cc.Label = null;
    @property(cc.Node)
    private NdBtn: cc.Node = null;
    @property(cc.Node)
    private NdName: cc.Node = null;

    @property(cc.Node)
    private NdRe: cc.Node = null;
    @property(cc.ScrollView)
    private scroll: cc.ScrollView = null;
    private timeLab: cc.Label = null;
    private _M: WorldBossModel = null;
    private _isinit = false;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdBtn, this.onClickNdBtn, this);
        EventClient.I.on(E.WorldBoss.UpdateBossPageData, this.updateView, this);
        EventClient.I.on(E.FuBen.EnterSuccess, this.onEnterSuccess, this);
    }

    protected updateUI(...parma): void {
        console.log('updateUI--------------', parma);
    }

    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        console.log('init--------------', winId, param, tabIdx, tabId);
        super.init(winId, param, tabIdx);
        this._M = ModelMgr.I.WorldBossModel;
        this.StartTime = this.NdStartTime.getChildByName('StartTime');
        this._isinit = true;
        // const remoteBg = RES_ENUM.WorldBoss_Bg_Mjlx_Bossbiejing;
        // if (this._M.isWeekendBoss()) {
        //     remoteBg = RES_ENUM.WorldBoss_Bg_Mjlx_Bossbiejing;// 策划说暂时一致，以后可能会区分
        // }
        // this.NdTopContent.getComponent(DynamicImage).loadImage(remoteBg, 1, true, 'resources', false);
        this.timeLab = this.NdTime.getChildByName('TimeLabel').getComponent(cc.Label);
        this.initView();
        // 请求世界BOSS基础数据
        ControllerMgr.I.WorldBossController.C2SOpenWorldBossUI();
    }

    private onEnterSuccess() {
        WinMgr.I.close(ViewConst.BossWin);
    }
    public onClickNdBtn(): void {
        FuBenMgr.I.enter(EMapID.WorldBoss, (isReqed) => {
            if (isReqed) {
                // WinMgr.I.close(ViewConst.BossWin);
                WinMgr.I.closeAll();
            }
        });
    }

    private initView(): void {
        // const test = ActivityMgr.I.getActData(ETimerActId.MJBoss);
        // console.log(test);
        // console.log(Config.Get(Config.Type.Cfg_Active));
        // console.log(RoleMgr.I.d.UserId);
        // console.log(test);

        const actTime: string = Config.Get(Config.Type.Cfg_Active).getValueByKey(ETimerActId.MJBoss, 'ActTime') || '';
        const time = UtilString.replaceAll(actTime, '|', '、');
        this.LabTT.string = `${i18n.tt(Lang.com_everyday)}${time}`;
        /** 更新物品栏 */
        const sPrize = this._M.getCfgValue(ECfgWorldBossConfigKey.ShowPrize);
        const sL = sPrize.split('|');
        let showPrize: string = '';
        for (let i = 0, n = sL.length; i < n; i++) {
            const element = sL[i];
            const sbL = element.split(':');
            const spt = i === n - 1 ? '' : '|';
            showPrize += `${sbL[0]}:1:${sbL[1]}${spt}`;// 固定数量显示为1
        }
        const itemInfo = UtilItem.ParseAwardItems(showPrize);
        this.scroll.node.active = itemInfo.length >= 4;
        this.NdRe.active = itemInfo.length < 4;
        if (itemInfo.length < 4) {
            UtilItemList.ShowItems(this.NdRe, showPrize, { option: { needNum: false } });
        } else {
            UtilItemList.ShowItems(this.scroll.content, showPrize, { option: { needNum: false } });
        }
        this.updateView();
    }

    private updateView(): void {
        this.updateTopContent();
        this.updatePerSecond();
        this.initCenter();
    }

    private updateTopContent(): void {
        const ndLab = this.NdName.getChildByName('NameLabel');
        const ndCity = this.NdName.getChildByName('NdCityName');
        UtilCocos.SetString(ndLab, this._M.getCfgBossValue('Name'));
        const campN = UtilGeneral.GetCampName(this._M.getCfgBossValue('Camp'));
        UtilCocos.SetString(ndCity, campN);
        this.updateAni();
    }

    private initCenter(): void {
        UtilRedDot.UpdateRed(this.NdBtn, (this._M.endTime - UtilTime.NowSec()) > 0, new cc.Vec2(85, 25));
        this.NdStartTime.active = !this.NdBtn.active;
    }

    private _endtime: number = 0;
    private _startTime: number = 0;
    private _closeTime: number = 0; // 后端要发奖延迟几秒后才刷新数据
    private _isUpdateE = false;
    private _isUpdateS = false;
    private _isUpdateR = false;
    private count = 0;
    private _maxCount = 3;// 由于后端有数据处理时间差，暂定3次请求
    protected updatePerSecond(): void {
        this._endtime = this._M.endTime - UtilTime.NowSec();
        this._startTime = this._M.startTime - UtilTime.NowSec();
        this._closeTime = this._M.closeTime - UtilTime.NowSec();
        // console.log(UtilTime.NowSec(), this._startTime, this._isUpdateE, this._endtime, this._isUpdateS, this._closeTime);
        if (this._endtime > 0) {
            const timeString = `${i18n.tt(Lang.world_boss_act_end_time)}${UtilTime.FormatHourDetail(this._endtime)}`;
            this.timeLab.string = timeString;
            this._isUpdateE = false;
            this._isUpdateR = false;
        } else if (!this._isUpdateE && this._isinit) {
            if (this._closeTime <= 0) {
                ControllerMgr.I.WorldBossController.C2SOpenWorldBossUI();
                if (++this.count === this._maxCount) {
                    this._isUpdateE = true;
                }
            } else if (!this._isUpdateR) { // 结束了自动刷一次红点
                this._M.redMjInfo();
                this._isUpdateR = true;
                this.count = 0;
            }
        }
        this.NdTime.active = this._endtime > 0;
        UtilCocos.SetSpriteGray(this.NdBtn, this._endtime < 0, true);
        this.NdBtn.active = this._startTime < 0;
        if (this._startTime > 0) {
            // eslint-disable-next-line max-len
            const timeString = `${UtilTime.FormatTime(this._startTime, i18n.tt(Lang.com_format_time), true)}`;
            this.StartTime.getComponent(cc.Label).string = timeString;
            this.NdTime.active = false;
            this._isUpdateS = false;
        } else {
            this.NdStartTime.active = false;
            if (!this._isUpdateS && this._isinit) {
                ControllerMgr.I.WorldBossController.C2SOpenWorldBossUI();
                this._isUpdateS = true;
            }
        }
    }

    /** 初始化名将模型 */
    private _lastBossId: string = null;
    private updateAni(): void {
        if (this._lastBossId === this._M.getCfgBossValue('ResId')) {
            return;
        }
        this.NdMj.destroyAllChildren();
        this.NdMj.removeAllChildren();
        this._lastBossId = this._M.getCfgBossValue('ResId');
        const bossObj = { resId: this._lastBossId, resType: ANIM_TYPE.PET, resAction: ACTION_TYPE.UI_SHOW };
        const bossAni = EntityUiMgr.I.createAttrEntity(this.NdMj, bossObj);
        UtilCocos.SetScale(bossAni, 0.9, 0.9, 0.9);
    }
    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.WorldBoss.UpdateBossPageData, this.updateView, this);
        EventClient.I.off(E.FuBen.EnterSuccess, this.onEnterSuccess, this);
    }
}
