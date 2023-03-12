import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import ListView from '../../../base/components/listview/ListView';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { IPDStruct } from '../../../base/utils/UtilConst';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import { BattleCommon } from '../../../battle/BattleCommon';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import EntityBase from '../../../entity/EntityBase';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { EMapFbInstanceType } from '../../../map/MapCfg';
import MapMgr from '../../../map/MapMgr';
import { ETimerActId } from '../../activity/timerActivity/TimerActivityConst';
import { EBattleType } from '../../battleResult/BattleResultConst';
import { FuBenMgr } from '../../fuben/FuBenMgr';
import { RoleInfo } from '../../role/RoleInfo';
import {
    FamilyLabState,
    FamilyPageType, FamilyPatriarchPageType, FamilyPos, TipPageType,
} from '../FamilyConst';
import FamilyModel from '../FamilyModel';
import { FamilyReportItem } from './FamilyReportItem';

const { ccclass, property } = cc._decorator;
@ccclass
export default class FamilyPatriarchPage extends WinTabPage {
    /** 两个父容器 */
    @property(cc.Node)// 活动1父容器
    private NdAct1: cc.Node = null;
    @property(cc.Node)// 活动2父容器
    private NdAct2: cc.Node = null;

    /** 公共部分 */
    @property(cc.Node)// 特权
    private BtnPower: cc.Node = null;
    @property(cc.Node)// 活动奖励
    private BtnReward: cc.Node = null;
    @property(cc.Node)// 挑战按钮
    private BtnChallenge: cc.Node = null;
    @property(ListView)// 奖励列表
    private list: ListView = null;
    @property(cc.Node)// 是否是首届
    private NdFirstJie: cc.Node = null;

    // 底部排行信息
    @property(cc.Label)// 我的排行
    private LabMyRank: cc.Label = null;
    @property(cc.Label)// 最高伤害
    private LabMaxDamage: cc.Label = null;
    @property(cc.Label)// 伤害
    private LabDamage: cc.Label = null;
    @property(cc.Node)// 距离第一名
    private NddistanceFirst: cc.Node = null;

    /** ---------第二阶段信息--------- */
    @property(cc.Node)// 观看视频1
    private BtnWatchVideo1: cc.Node = null;
    @property(cc.Node)// 观看视频2
    private BtnWatchVideo2: cc.Node = null;
    @property(cc.Node)// 观看视频3
    private BtnWatchVideo3: cc.Node = null;

    @property(cc.Node)// 候选人
    private NdSelf: cc.Node = null;
    @property(cc.Node)// 族长
    private NdChif: cc.Node = null;

    @property([cc.Node])
    private NdReportArr: cc.Node[] = [];

    @property(cc.Label)// 左侧模型昵称
    private LabNameLeft: cc.Label = null;
    @property(cc.Label)// 右侧模型昵称
    private LabNameRight: cc.Label = null;
    @property(cc.Label)// 左侧模型战力
    private LabFightLeft: cc.Label = null;
    @property(cc.Label)// 右侧模型战力
    private LabFightRight: cc.Label = null;

    @property(cc.Label)// 战斗比例
    private LabBiLi: cc.Label = null;

    // Buff
    @property(cc.Node)// 戰鬥比例
    private NdBuff: cc.Node = null;
    @property(cc.Node)// Buff
    private BtnBuff: cc.Node = null;
    @property(cc.RichText)// Label1
    private LabBuff1: cc.RichText = null;
    @property(cc.RichText)// Label2
    private LabBuff2: cc.RichText = null;

    // -------第一阶段-------
    @property(cc.Node)// 首领模型
    private NdBossAni: cc.Node = null;
    @property(cc.Label)// 首领模型名称
    private LabName: cc.Label = null;

    // 第一阶段进行中
    // 活动开启前
    @property(cc.Node)// 活动开启前
    private NdAct1Before: cc.Node = null;
    @property(cc.Label)// 活动1未开始时间
    private LabTimeAct1Before: cc.Label = null;

    // 进行中
    @property(cc.Node)// 活动进行中
    private NdAct1Doing: cc.Node = null;
    @property(cc.Node)// 活动第一届
    private NdAct1DoingState1: cc.Node = null;
    @property(cc.Node)// 活动第二届
    private NdAct1DoingState2: cc.Node = null;
    @property(cc.Label)// 时间1
    private LabJie1Time: cc.Label = null;
    @property(cc.Label)// 时间2
    private LabJie2Time: cc.Label = null;

    // Boss活动结束
    @property(cc.Node)// Boss活动结束1
    private NdAct1End1: cc.Node = null;
    @property(cc.Node)// Boss活动结束2
    private NdAct1End2: cc.Node = null;
    @property(cc.Label)// Boss活动结束2
    private LabAct1End2: cc.Label = null;

    // 族长活动
    @property(cc.Node)// 活动开启前
    private NdAct2Before: cc.Node = null;
    @property(cc.Label)// 活动1未开始时间
    private LabTimeAct2Before: cc.Label = null;
    // 族长战进行中
    @property(cc.Node)// 族长战进行中
    private NdAct2Doing: cc.Node = null;
    @property(cc.Label)// 活动2时间倒计时
    private LabAct2Doing: cc.Label = null;
    // 族长活动结束
    @property(cc.Node)// 结束状态1
    private NdAct2End1: cc.Node = null;
    @property(cc.Node)// 结束状态2
    private NdAct2End2: cc.Node = null;
    @property(cc.Label)// 结束状态2
    private LabAct2End2: cc.Label = null;
    //
    @property(cc.Label)
    private LabChallenge: cc.Label = null;

    public start(): void {
        super.start();
        UtilGame.Click(this.BtnPower, () => WinMgr.I.open(ViewConst.FamilyPowerTip), this);// 弹出特权
        UtilGame.Click(this.BtnReward, () => WinMgr.I.open(ViewConst.FamilyAwardTip), this);// 活动奖励
        UtilGame.Click(this.BtnChallenge, this._onChallengeClick, this);// 挑战按钮
        UtilGame.Click(this.BtnWatchVideo1, this._onWatchVideoClick, this, { customData: 0 });// 播放视频-战报回放
        UtilGame.Click(this.BtnWatchVideo2, this._onWatchVideoClick, this, { customData: 1 });// 播放视频-战报回放
        UtilGame.Click(this.BtnWatchVideo3, this._onWatchVideoClick, this, { customData: 2 });// 播放视频-战报回放

        // buff弹窗
        UtilGame.Click(this.BtnBuff, () => WinMgr.I.open(
            ViewConst.FamilyLevelTips,
            TipPageType.FightBuff,
            this.BtnBuff.convertToWorldSpaceAR(cc.v2(250, -100)),
        ), this); // 查看Buff
    }

    // test-delete
    public gm(e, n): void {
        if (Number(n) === 1) {
            const [cmd, data] = UtilGame.ParseGMStr('争霸S@bossStart');
            ControllerMgr.I.GMController.reqC2SGm(cmd, data);
        } else if (Number(n) === 2) {
            const [cmd, data] = UtilGame.ParseGMStr('争霸S@bossEnd');
            ControllerMgr.I.GMController.reqC2SGm(cmd, data);
            // 活动结束 停止倒计时，清除活动信息
            ControllerMgr.I.FamilyController.reqC2SFamilyPatriInfo(); // 请求争权基础信息
            this.model.clearFamilyActInfo();// 清除活动数据
            this.unschedule(this._timeCountDoing);
        } else if (Number(n) !== 3) {
            const [cmd, data] = UtilGame.ParseGMStr('争霸S@leaderEnd');
            ControllerMgr.I.GMController.reqC2SGm(cmd, data);
            ControllerMgr.I.FamilyController.reqC2SFamilyPatriInfo(); // 请求争权基础信息
        }
    }

    /** 观看视频 回放战报 */
    private _onWatchVideoClick(e: any, idx: number): void {
        let logList: ReportIdx[] = [];
        const info: S2CFamilyPatriLeaderInfo = this.model.getFamilyPatriLeaderInfo();
        if (info) { logList = info.ReportIdxList; }

        if (logList && logList.length && logList[idx]) {
            WinMgr.I.setViewStashParam(ViewConst.FamilyHomePage, [0]);
            WinMgr.I.setViewStashParam(ViewConst.FamilyWin, [FamilyPageType.FamilyFamilyPage]);
            WinMgr.I.setViewStashParam(ViewConst.FamilyPatriarchWin, [FamilyPatriarchPageType.FamilyPatriarchPage]);
            ControllerMgr.I.FamilyController.reqC2SFamilyPatriWatchVideos(logList[idx].Idx);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public refreshPage(winId: number, params: any[]): void {
    }
    private model: FamilyModel;
    public init(params: any): void {
        this.NdAct1.active = false;
        this.NdAct2.active = false;
        this.model = ModelMgr.I.FamilyModel;

        EventClient.I.on(E.Family.FamilyPatriLeaderInfo, this._onFamilyPatriLeaderInfo, this);// 族长候选人信息战报信息
        EventClient.I.on(E.Family.FamilyPatriInfo, this._onFamilyPatriInfo, this);// 活动信息
        EventClient.I.on(E.Family.FamilyGetMyRank, this._onFamilyGetMyRank, this);// 底部我的排名信息
        EventClient.I.on(E.Family.FamilyHomeHeroData, this._onFamilyHomeHeroData, this);// 监听模型数据？

        ControllerMgr.I.FamilyController.reqC2SFamilyPatriInfo(); // 1、请求争权基础信息
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.unScheduleAll();
        EventClient.I.off(E.Family.FamilyHomeHeroData, this._onFamilyHomeHeroData, this);
        EventClient.I.off(E.Family.FamilyPatriLeaderInfo, this._onFamilyPatriLeaderInfo, this);
        EventClient.I.off(E.Family.FamilyPatriInfo, this._onFamilyPatriInfo, this);
        EventClient.I.off(E.Family.FamilyGetMyRank, this._onFamilyGetMyRank, this);
    }

    /** ---------获得争夺基础信息------------ */
    private _onFamilyPatriInfo(): void {
        // 2、请求完活动信息，一定要请求角色信息。因为是按角色信息判断的
        ControllerMgr.I.FamilyController.reqC2SFamilyPatriLeaderInfo();// 族长候选人信息战报信息
        ControllerMgr.I.FamilyController.reqC2SFamilyPatriGetMyRank();// 请求我的排名
    }

    /** 获取角色信息 */
    private _onFamilyPatriLeaderInfo(d: any): void {
        const isBossFight: boolean = this.model.isBossFight();
        this.NdAct1.active = isBossFight;
        this.NdAct2.active = !isBossFight;
        this._initReward();// 奖励信息
        if (isBossFight) { // 没有候选人信息 Boss争霸阶段
            this._initBossAni();// 显示boss
        } else { // 有候选人等信息 族长PK阶段
            this._initBuff();// 显示Buff
            this._initModelInfo();// 族长\候选人模型
            this._initFightLog();// 战斗记录
        }
        this._initLabelTimeInfo();// 显示倒计时
        this._initChallengeBtn(); // 挑战
    }
    /** 获得最新的族长信息 与模型的族长信息对比，是否连任。连任则文本描述需要改变 */
    private _onFamilyHomeHeroData(): void {
        this._initChallengeBtn();
    }

    /** -----------第一阶段----------- */
    /** Boss首领模型 */
    private _role: EntityBase = null;
    private _roleLeft: EntityBase = null;
    private _roleRight: EntityBase = null;
    protected onEnable(): void {
        if (this._role) this._role.resume();
        if (this._roleLeft) this._roleLeft.resume();
        if (this._roleRight) this._roleRight.resume();
    }

    private _initBossAni(): void {
        this.NdBossAni.active = true;
        this.NdBossAni.destroyAllChildren();
        this.NdBossAni.removeAllChildren();
        const refreshId: string = this.model.getCfgPatriBOSS();
        const cfgRefresh: Cfg_Refresh = MapMgr.I.CfgRefresh(Number(refreshId));
        const boss: Cfg_Monster = MapMgr.I.CfgMonster(Number(cfgRefresh.MonsterIds.split('|')[0]));
        this._role = EntityUiMgr.I.createAttrEntity(this.NdBossAni, { resId: boss.AnimId, resType: ANIM_TYPE.PET, isPlayUs: false });
        this.LabName.string = boss.Name;
    }

    private _initBuff(): void {
        const modelData: S2CFamilyTopPlayerData = this.model.getModelData();
        if (modelData && modelData.UserShowInfo && modelData.UserShowInfo[0]) { // 有族长信息
            let jie: number = modelData.TermNum; // 连任多少届
            const roleInfo = new RoleInfo(modelData.UserShowInfo[0]); // 离线多少天
            const logOut: number = roleInfo.d.LogoutTime;
            let day = 0;
            if (logOut) {
                day = UtilTime.disTanceToday(logOut);
            }

            const str1 = this.model.getCfgAttrBuffByType(1, jie);
            let str2 = 0;
            if (day) {
                str2 = this.model.getCfgAttrBuffByType(2, day);
            }
            // console.log(str1, str2);

            // 有一条属性就显示1条
            this.NdBuff.active = !!str1 || !!str2;

            if (str1 && str2) {
                const max1 = UtilSkillInfo.getMaxSkillLevel(str1);
                if (jie >= max1) {
                    jie = max1;
                }
                const cfg = UtilSkillInfo.GetCfg(str1, jie);
                // const name1 = UtilSkillInfo.GetSkillDesc(cfg, jie);
                const arrPD1: IPDStruct[] = UtilSkillInfo.getAttrPDArr(cfg, jie);
                const name1 = `${arrPD1[0].d.name}+${arrPD1[0].p}${arrPD1[0].d.perStr}`;
                this.LabBuff1.string = `<color=${UtilColor.GreenG}>${name1}</color>`;

                const max2 = UtilSkillInfo.getMaxSkillLevel(str2);
                if (day >= max2) {
                    day = max2;
                }
                const cfg2 = UtilSkillInfo.GetCfg(str2, day);
                // const name2 = UtilSkillInfo.GetSkillDesc(cfg2, day);
                const arrPD2: IPDStruct[] = UtilSkillInfo.getAttrPDArr(cfg2, day);
                const name2 = `${arrPD2[0].d.name}+${arrPD2[0].p}${arrPD2[0].d.perStr}`;

                this.LabBuff2.string = `<color=${UtilColor.GreenG}>${name2}</color>`;
            } else if (str1 || str2) {
                if (str1) {
                    const max1 = UtilSkillInfo.getMaxSkillLevel(str1);
                    if (jie >= max1) {
                        jie = max1;
                    }
                    const cfg = UtilSkillInfo.GetCfg(str1, jie);
                    // const name = UtilSkillInfo.GetSkillDesc(cfg, jie);
                    const arrPD: IPDStruct[] = UtilSkillInfo.getAttrPDArr(cfg, jie);
                    const name = `${arrPD[0].d.name}+${arrPD[0].p}${arrPD[0].d.perStr}`;

                    this.LabBuff1.string = `<color=${UtilColor.GreenG}>${name}</color>`;
                    this.LabBuff2.string = '';
                } else {
                    const max2 = UtilSkillInfo.getMaxSkillLevel(str2);
                    if (day >= max2) {
                        day = max2;
                    }
                    const cfg = UtilSkillInfo.GetCfg(str2, day);
                    const arrPD: IPDStruct[] = UtilSkillInfo.getAttrPDArr(cfg, day);
                    const name = `${arrPD[0].d.name}+${arrPD[0].p}${arrPD[0].d.perStr}`;
                    // const name = UtilSkillInfo.GetSkillDesc(cfg, day);
                    this.LabBuff1.string = `<color=${UtilColor.GreenG}>${name}</color>`;
                    this.LabBuff2.string = '';
                }
            }
        } else { // 没有族长信息
            this.NdBuff.active = false;
        }
    }

    // private _role: EntityBase = null;
    // protected onEnable(): void {
    //     if (this._role) this._role.resume();
    // }
    // 族长候选人模型
    private _initModelInfo(): void {
        const info: S2CFamilyPatriLeaderInfo = this.model.getFamilyPatriLeaderInfo();
        if (info) {
            const modelInfo: BaseUserInfo[] = info.CandidateShowInfo;

            this._roleLeft = EntityUiMgr.I.createAttrEntity(this.NdSelf, {
                isShowTitle: false,
                // isMainRole: true,
                resType: ANIM_TYPE.ROLE,
                isPlayUs: false,
            }, {
                A: modelInfo[0].A,
                B: modelInfo[0].B,
            });

            const roleInfoL = new RoleInfo(modelInfo[0]);
            this.LabNameLeft.string = roleInfoL.d.Nick;
            this.LabFightLeft.string = roleInfoL.FightValue;

            const modelInfo1: BaseUserInfo[] = info.LeaderShowInfo;
            // const roleRight = EntityMapMgr.I.createRole(modelInfo1[0], 0, false, true, true);
            // this.NdChif.addChild(roleRight);

            this._roleRight = EntityUiMgr.I.createAttrEntity(this.NdChif, {
                isShowTitle: false,
                // isMainRole: true,
                resType: ANIM_TYPE.ROLE,
                isPlayUs: false,
            }, {
                A: modelInfo1[0].A,
                B: modelInfo1[0].B,
            });

            const roleInfoR = new RoleInfo(modelInfo1[0]);
            this.LabNameRight.string = roleInfoR.d.Nick;
            this.LabFightRight.string = roleInfoR.FightValue;
        }
    }
    /** 对战记录 */
    private _initFightLog(): void {
        const info: S2CFamilyPatriLeaderInfo = this.model.getFamilyPatriLeaderInfo();
        if (info) {
            const logList: ReportIdx[] = info.ReportIdxList;

            for (let i = 0; i < 3; i++) {
                const nd: cc.Node = this.NdReportArr[i];
                const item: FamilyReportItem = nd.getComponent(FamilyReportItem);
                if (logList && logList.length && logList[i]) {
                    item.setData(logList[i]);
                } else {
                    item.setData(null);
                }
            }

            if (logList && logList.length) {
                let win = 0;
                let fail = 0;

                for (let i = 0; i < logList.length; i++) {
                    if (logList[i].Win) {
                        win++;
                    }
                }
                fail = logList.length - win;

                this.LabBiLi.string = `${win} : ${fail}`;
            } else {
                this.LabBiLi.string = '0 : 0';
            }
        }
    }

    /** 状态更新 */
    private _updateState(state: number, act: number): void {
        if (act === ETimerActId.FamilyBoss) {
            this.NdAct1Before.active = state === FamilyLabState.before;
            this.NdAct1Doing.active = state === FamilyLabState.doing;
            this.NdAct1End1.active = state === FamilyLabState.end1;
            this.NdAct1End2.active = state === FamilyLabState.end2;

            this.NdAct2Before.active = false;
            this.NdAct2Doing.active = false;
            this.NdAct2End1.active = false;
            this.NdAct2End2.active = false;
        } else {
            this.NdAct2Before.active = state === FamilyLabState.before;
            this.NdAct2Doing.active = state === FamilyLabState.doing;
            this.NdAct2End1.active = state === FamilyLabState.end1;
            this.NdAct2End2.active = state === FamilyLabState.end2;
            this.NdAct1Before.active = false;
            this.NdAct1Doing.active = false;
            this.NdAct1End1.active = false;
            this.NdAct1End2.active = false;
        }
    }

    // -----------第一阶段 第二阶段公用的倒计时-----------
    private _initLabelTimeInfo(): void {
        const data: S2CFamilyPatriInfo = this.model.getFamilyPatriInfo();
        const endTime = data.EndTime;// 活动结束时间
        const nowTime = UtilTime.NowSec();// 当前时间

        const isBossFight = this.model.isBossFight();

        if (data.ActId) { // 存在活动ID 判断活动 是否结束
            console.log(`当前时间s：${nowTime}`);
            if (nowTime >= endTime) { // 结束
                console.log('虽然有活动ID 但是 活动结束：<[End]>清除活动数据');
                this._doingToEnd();
            } else { // 距离活动结束还有多久
                if (isBossFight) {
                    console.log('Boss战进行中：<[BossDoing]>');
                    // this.NdAct1Doing.active = true;
                    this._updateState(FamilyLabState.doing, ETimerActId.FamilyBoss);
                    // this._switchState(1,);
                    if (data.FirstType !== 1 && data.FirstType !== 2) { // 第2届以上  //后候选人选拔赛结束, 进行族长守擂赛;
                        this.NdAct1DoingState1.active = false;
                        this.NdAct1DoingState2.active = true;
                    } else {
                        this.NdAct1DoingState1.active = true;
                        this.NdAct1DoingState2.active = false;
                    }
                } else { // 族长战 进行中
                    console.log('Leader战进行中：<[LeaderDoing]>');
                    // this.NdAct2Doing.active = true;
                    this._updateState(FamilyLabState.doing, ETimerActId.FamilyChif);
                }
                // this.unschedule(this._timeCountDoing);
                this.unScheduleAll();
                this._timeCountDoing();
                this.schedule(this._timeCountDoing, 1);
            }
        } else { // 不存在活动ID 则活动结束 或者活动未开启
            console.log('Boss结束&&未开启：<[BossBefore||End]>');
            const lastEndTime = data.LastEndTime;// 上个活动结束时间
            if (lastEndTime) { // 有上次活动时间 // 判断是当天  还是下一天  否则就是活动开启前
                if (isBossFight) {
                    // this.NdAct1End1.active = true;// 显示活动已结束
                    this._updateState(FamilyLabState.end1, ETimerActId.FamilyBoss);
                } else {
                    this._updateState(FamilyLabState.end1, ETimerActId.FamilyChif);
                    // this.NdAct2End1.active = true;// 显示活动已结束
                }
                // this.unschedule(this._timeCountEnd);
                this.unScheduleAll();
                this._timeCountEnd();
                this.schedule(this._timeCountEnd, 1);
            } else { // 没有上次活动信息  // 活动开启前当天 // 活动未开启 只有一个nextOpenTime
                console.log('Boss活动开启前：<[BossBefore]>');
                if (isBossFight) {
                    // this.NdAct1Before.active = true;// 活动开启前
                    this._updateState(FamilyLabState.before, ETimerActId.FamilyBoss);
                    //
                    //
                    //
                    //
                    //
                    //
                } else {
                    this._updateState(FamilyLabState.before, ETimerActId.FamilyChif);
                    // this.NdAct2Before.active = true;// 活动开启前
                }
                // this.unschedule(this._timeCountBefore);
                this.unScheduleAll();
                this._timeCountBefore();
                this.schedule(this._timeCountBefore, 1);
            }
        }
    }

    /** boss活动 开启前 */
    private _timeCountBefore(): void {
        const data: S2CFamilyPatriInfo = this.model.getFamilyPatriInfo();
        const deltaTime: number = data.NextOpenTime - UtilTime.NowSec();
        if (this.model.isBossFight()) {
            if (deltaTime > 0) { // 活动还未开始
                this.LabTimeAct1Before.string = UtilTime.FormatHourDetail(deltaTime);
            } else { // 活动已经开启 后端推送切换状态
                this.unScheduleAll();
                // this.unschedule(this._timeCountBefore);
                this.LabTimeAct1Before.string = '00:00:00';
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (deltaTime > 0) { // 活动还未开始
                this.LabTimeAct2Before.string = UtilTime.FormatHourDetail(deltaTime);
            } else { // 活动已经开启 后端推送切换状态
                this.unScheduleAll();
                // this.unschedule(this._timeCountBefore);
                this.LabTimeAct2Before.string = '00:00:00';
            }
        }
    }

    /** boss活动 进行中 */
    private _timeCountDoing(): void {
        const data: S2CFamilyPatriInfo = this.model.getFamilyPatriInfo();
        const endTime = data.EndTime;
        const nowTime = UtilTime.NowSec();
        const deltTime = endTime - nowTime;
        // // 活动倒计时过程中,活动结束了。
        // if (nowTime >= endTime) { // 活动结束
        //     this.LabChallenge.string = '候选人选拔赛已结束,恭喜候选人加冕为族长';
        //     this.BtnChallenge.active = false;
        // } else {
        //     this.LabChallenge.string = '';
        //     this.BtnChallenge.active = true;
        //     UtilCocos.SetSpriteGray(this.BtnChallenge, false, true);
        // }

        if (this.model.isBossFight()) {
            if (data.FirstType !== 1 && data.FirstType !== 2) { // 第2届以上  // 后候选人选拔赛结束, 进行族长守擂赛;
                if (nowTime >= endTime) { // 活动结束
                    // this.LabJie2Time.string = '00:00:00';
                    // this.unschedule(this._timeCountDoing);
                    this._doingToEnd();
                } else {
                    this.LabJie2Time.string = UtilTime.FormatHourDetail(deltTime);
                }
            } else { // 第一届
                // eslint-disable-next-line
                if (nowTime >= endTime) { // 活动结束
                    // this.unschedule(this._timeCountDoing);
                    this._doingToEnd();
                    // this.LabJie1Time.string = '00:00:00';
                } else {
                    this.LabJie1Time.string = UtilTime.FormatHourDetail(deltTime);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (nowTime >= endTime) { // 结束了族长战
                // this.unschedule(this._timeCountDoing);
                this._doingToEnd();
            } else {
                this.LabAct2Doing.string = UtilTime.FormatHourDetail(deltTime);
            }
        }
    }

    private unScheduleAll(): void {
        this.unschedule(this._timeCountDoing);
        this.unschedule(this._timeCountBefore);
        this.unschedule(this._timeCountEnd);
    }

    /** boss进行中-->活动结束 */
    private _doingToEnd(): void {
        // this.unschedule(this._timeCountDoing);
        this.unScheduleAll();
        this.model.clearFamilyActInfo();// 清除活动数据
        ControllerMgr.I.FamilyController.reqC2SFamilyPatriInfo(); // 请求争权基础信息

        if (!this.model.isBossFight()) { // 族长战结束 需要请求新的族长信息
            ControllerMgr.I.FamilyController.reqC2SFamilyTopPlayerData();
        }
    }

    /** boss活动结束 */
    private _timeCountEnd(): void {
        const data: S2CFamilyPatriInfo = this.model.getFamilyPatriInfo();
        const modelData: S2CFamilyTopPlayerData = this.model.getModelData();
        const lastEndTime = data.LastEndTime;// 上个活动结束时间
        const nextOpenTime = data.NextOpenTime;// 下次开启时间
        const nowTime = UtilTime.NowSec();
        const lessThan24 = nextOpenTime - nowTime;
        console.log(`当前时间：${nowTime}`);

        if (UtilTime.IsSameDay(new Date(lastEndTime * 1000), new Date(nowTime * 1000))) { // 活动结束当天  // 是否是同一天
            console.log('活动结束1天');// 此处也可以什么都不做
            if (this.model.isBossFight()) {
                if (!this.NdAct1End1.active) {
                    // this.NdAct1End1.active = true;
                    this._updateState(FamilyLabState.end1, ETimerActId.FamilyBoss);
                }// 显示活动已结束
            } else {
                // eslint-disable-next-line no-lonely-if
                if (!this.NdAct2End1.active) {
                    // this.NdAct2End1.active = true;
                    this._updateState(FamilyLabState.end1, ETimerActId.FamilyChif);
                }// 显示活动已结束
            }
        } else if (lessThan24 <= 24 * 60 * 60) { // 活动开启前24小时 下次开启时间-当前时间<=24小时
            console.log('活动未开启'); // 活动未开启
            if (this.model.isBossFight()) {
                // this.NdAct1Before.active = true;// 活动开启前
                this._updateState(FamilyLabState.before, ETimerActId.FamilyBoss);
            } else {
                this._updateState(FamilyLabState.before, ETimerActId.FamilyChif);
                // this.NdAct2Before.active = true;// 活动开启前
            }
            // this.unschedule(this._timeCountEnd);
            // this.unschedule(this._timeCountBefore);
            this.unScheduleAll();
            this._timeCountBefore();
            this.schedule(this._timeCountBefore, 1);
        } else { // 活动结束第一天 ~~活动开启前一天
            let type = ETimerActId.FamilyBoss;
            console.log('活动结束1天后，开启前一天');
            const week: string = UtilTime.getWeekString(nextOpenTime);// 周几
            const strNext = UtilTime.getWhichWeek(nextOpenTime); // >7 下 >14 下下
            const weekStr: string = strNext + week;// 下周几
            const ren = data.NextTerm;

            const strTime1: string = this.model.getCfgActTime(type);

            let ts = '';
            if (data.FirstType !== 1 && data.FirstType !== 2) {
                // 非首届，时间需要特殊处理
                const strTime2: string = this.model.getCfgActTime(ETimerActId.FamilyChif);
                const endStr = strTime2.split('-')[1];// 22:00

                const startStr = strTime1.split('-')[0];
                ts = `${startStr}-${endStr}`;
            } else {
                ts = strTime1;
            }

            const finallStr = `${weekStr + ts}${i18n.tt(Lang.family_openWhich)}${ren}${i18n.tt(Lang.family_renGame)}`;
            // 周二 10:00-21:00 开启第x任族长争霸赛

            if (this.model.isBossFight()) {
                if (!this.NdAct1End2.active) {
                    this._updateState(FamilyLabState.end2, ETimerActId.FamilyBoss);
                    // this.NdAct1End2.active = true;
                }
                type = ETimerActId.FamilyBoss;
                this.LabAct1End2.string = finallStr;
            } else if (!this.NdAct2End2.active) {
                // this.NdAct2End2.active = true;
                this._updateState(FamilyLabState.end2, ETimerActId.FamilyChif);
                type = ETimerActId.FamilyChif;
                this.LabAct2End2.string = finallStr;
            }
        }
    }

    // -----------第一阶段 第二阶段 公用奖励列表-----------
    /** 奖励信息 */
    private _rewards: any[][];
    private _initReward(): void {
        // 判断什么阶段 显示什么奖励
        const data: S2CFamilyPatriInfo = this.model.getFamilyPatriInfo();
        const roleInfo: S2CFamilyRoleInfo = this.model.getFamilyRoleInfo();
        const type = data.FirstType;
        let strKey: string = '';
        this.NdFirstJie.active = false;
        if (type === 1) { // 新服第一届
            this.NdFirstJie.active = true;
            strKey = 'Reward1';
        } else if (type === 2) { // 合服第一届
            strKey = 'Reward2';
        } else { // 其他
            strKey = 'Reward3';
        }

        // //职位roleInfo.Position
        this._rewards = this.model.getCfgFamilyPosReward(FamilyPos.Chiefs, strKey);
        this.list.setNumItems(this._rewards.length, 0);
        this.list.scrollTo(0);
    }
    private onScrollEvent(node: cc.Node, index: number): void { /** 判断是哪一届 */
        const itemIcon: ItemIcon = node.getComponent(ItemIcon);
        const [itemId, itemNum] = this._rewards[index];
        const itemModel: ItemModel = UtilItem.NewItemModel(Number(itemId), Number(itemNum));
        itemIcon.setData(itemModel, { needNum: true });
    }
    // -----------挑战按钮---------------------------------
    private _onChallengeClick(): void {
        const data: S2CFamilyPatriInfo = this.model.getFamilyPatriInfo();
        if (!data.ActId) { // 未开始
            MsgToastMgr.Show(i18n.tt(Lang.com_activity_not_open));// 活动未开启
        } else if (data.ActId && data.ActId === ETimerActId.FamilyBoss) { // 活动1
            const now = UtilTime.NowSec();
            const et = data.EndTime;
            if (now >= et) {
                MsgToastMgr.Show(i18n.tt(Lang.family_activityEnd));// '活动已结束'
                return;
            }
            if (FuBenMgr.I.checkCanEnterFight(EMapFbInstanceType.YeWai, true)) {
                WinMgr.I.setViewStashParam(ViewConst.FamilyHomePage, [0]);
                WinMgr.I.setViewStashParam(ViewConst.FamilyWin, [FamilyPageType.FamilyFamilyPage]);
                WinMgr.I.setViewStashParam(ViewConst.FamilyPatriarchWin, [FamilyPatriarchPageType.FamilyPatriarchPage]);

                // WinMgr.I.setViewStashParam(ViewConst.FamilyHomePage, [0]);
                // WinMgr.I.setViewStashParam(ViewConst.FamilyWin, [FamilyPageType.FamilyFamilyPage]);
                // WinMgr.I.setViewStashParam(ViewConst.FamilyPatriarchWin, [FamilyPatriarchPageType.FamilyPatriarchPage]);
                BattleCommon.I.enter(EBattleType.Family_Boss);
            }
        } else if (data.ActId && data.ActId === ETimerActId.FamilyChif) {
            const now = UtilTime.NowSec();
            const et = data.EndTime;
            if (now >= et) { // 判断活动是否结束
                MsgToastMgr.Show(i18n.tt(Lang.family_activityEnd));
                return;
            }

            const info: S2CFamilyPatriLeaderInfo = this.model.getFamilyPatriLeaderInfo();
            if (info && info.ReportIdxList && info.ReportIdxList.length) {
                const logList: ReportIdx[] = info.ReportIdxList;
                if (logList.length === 3) {
                    MsgToastMgr.Show(i18n.tt(Lang.family_maxFight));// 最多只能挑战3次
                    return;
                }
                let win = 0; let fail = 0;
                for (let i = 0; i < logList.length; i++) {
                    if (logList[i].Win) {
                        win++;
                    }
                }
                fail = logList.length - win;
                if (win >= 2 || fail >= 2) {
                    MsgToastMgr.Show(i18n.tt(Lang.family_maxFight));// 胜负已分
                    return;
                }
                this._challengeLeader();
                // ControllerMgr.I.FamilyController.reqC2SFamilyPatriChallengeLeader();
            } else { // 没有战报，直接请求协议
                this._challengeLeader();
                // ControllerMgr.I.FamilyController.reqC2SFamilyPatriChallengeLeader();
            }
        }
    }

    private _challengeLeader(): void {
        if (FuBenMgr.I.checkCanEnterFight(EMapFbInstanceType.YeWai, true)) {
            WinMgr.I.setViewStashParam(ViewConst.FamilyHomePage, [0]);
            WinMgr.I.setViewStashParam(ViewConst.FamilyWin, [FamilyPageType.FamilyFamilyPage]);
            WinMgr.I.setViewStashParam(ViewConst.FamilyPatriarchWin, [FamilyPatriarchPageType.FamilyPatriarchPage]);
            // WinMgr.I.setViewStashParam(ViewConst.FamilyHomePage, [0]);
            // WinMgr.I.setViewStashParam(ViewConst.FamilyWin, [FamilyPageType.FamilyFamilyPage]);
            // WinMgr.I.setViewStashParam(ViewConst.FamilyPatriarchWin, [FamilyPatriarchPageType.FamilyPatriarchPage]);
            BattleCommon.I.enter(EBattleType.Family_Chif);
        }
    }

    private _initChallengeBtn(): void { // 挑战按钮状态处理
        const data: S2CFamilyPatriInfo = this.model.getFamilyPatriInfo();
        const modelData: S2CFamilyTopPlayerData = this.model.getModelData();
        const lastEndTime = data.LastEndTime;// 上个活动结束时间
        const nextOpenTime = data.NextOpenTime;// 下次开启时间
        const nowTime = UtilTime.NowSec();
        const lessThan24 = nextOpenTime - nowTime;
        const endTime = data.EndTime;

        const roleInfo: S2CFamilyRoleInfo = this.model.getFamilyRoleInfo();
        const pos = roleInfo.Position;// 族长

        const endStr = i18n.tt(Lang.family_chifEnd);// 候选人选拔赛已结束,恭喜候选人加冕为族长
        if (this.model.isBossFight()) { // 判断活动时间状态
            if (data.ActId) { // 活动进行中
                if (nowTime >= endTime) { // 结束 // 判断活动结束时间范围  这里可能不走
                    console.log('这里可能不走 不会停留在boss战');

                    this.BtnChallenge.active = false;
                    this.LabChallenge.string = endStr;// 候选人选拔赛已结束,恭喜候选人加冕为族长
                    //
                } else { // 距离活动结束还有多久
                    this.LabChallenge.string = '';

                    // const isSelect: boolean = this.model.isSelectPeople();// 判断自己是否是候选人
                    // if (pos === FamilyPos.Chiefs || !isSelect) {
                    if (pos === FamilyPos.Chiefs) {
                        this.BtnChallenge.active = false;
                        UtilCocos.SetSpriteGray(this.BtnChallenge, true, true);
                    } else {
                        this.BtnChallenge.active = true;
                        UtilCocos.SetSpriteGray(this.BtnChallenge, false, true);
                    }
                }
            } else { // 活动结束 或者 活动开始前
                // 判断时间
                const nextOpenTime = data.NextOpenTime;// 下次开启时间
                const nowTime = UtilTime.NowSec();
                const lessThan24 = nextOpenTime - nowTime;

                if (UtilTime.IsSameDay(new Date(lastEndTime * 1000), new Date(nowTime * 1000))) { // 活动结束当天  // 是否是同一天
                    this.BtnChallenge.active = false;
                    this.LabChallenge.string = endStr;// 候选人选拔赛已结束,恭喜候选人加冕为族长
                } else if (lessThan24 <= 24 * 60 * 60) { // 活动开启前24小时 下次开启时间-当前时间<=24小时
                    console.log('活动未开启'); // 活动未开启
                    this.BtnChallenge.active = false;
                    // UtilCocos.SetSpriteGray(this.BtnChallenge, true, true);
                    this.LabChallenge.string = '';
                } else { // 活动结束第一天 ~~活动开启前一天
                    console.log('活动结束1天后，开启前一天');
                    this.BtnChallenge.active = false;
                    this.LabChallenge.string = endStr;// 候选人选拔赛已结束,恭喜候选人加冕为族长
                }
            }
        } else {
            const info: S2CFamilyPatriLeaderInfo = this.model.getFamilyPatriLeaderInfo();
            if (info && info.CandidateShowInfo && info.CandidateShowInfo[0]) { // 有候选人
                // 有候选人
                const endStr1 = i18n.tt(Lang.family_chifEnd1);// 守擂赛已结束,恭喜族长继续连任
                const endStr2 = i18n.tt(Lang.family_chifEnd2);// 守擂赛已结束,恭喜候选人加冕为族长
                if (data.ActId) {
                    if (nowTime >= endTime) { // 结束
                        this.BtnChallenge.active = false;
                        let str = '';
                        //
                        // info.ReportIdxList

                        if (!this.getIsWinOrFail(info.ReportIdxList)) { // 判断 比赛场次胜利 2:1
                            str = endStr1;
                        } else {
                            str = endStr2;// '守擂赛已结束,恭喜候选人加冕为族长';
                        }
                        this.LabChallenge.string = str;
                    } else { // 进行中
                        this.LabChallenge.string = '';
                        // 是族长 || 自己不是候选人
                        const isSelect: boolean = this.model.isSelectPeople();// 判断自己是否是候选人
                        if (pos === FamilyPos.Chiefs || !isSelect) {
                            this.BtnChallenge.active = false;
                            // UtilCocos.SetSpriteGray(this.BtnChallenge, true, true);
                        } else {
                            this.BtnChallenge.active = true;
                            UtilCocos.SetSpriteGray(this.BtnChallenge, false, true);
                        }
                    }
                } else { // 活动结束 或者 活动开始前
                    // 判断时间
                    this.BtnChallenge.active = false;
                    let str = '';
                    if (!this.getIsWinOrFail(info.ReportIdxList)) { // 判断 比赛场次胜利 2:1
                        str = endStr1;
                    } else {
                        str = endStr2;// '守擂赛已结束,恭喜候选人加冕为族长';
                    }
                    this.LabChallenge.string = str;
                }
            } else { // 没有候选人
                this.BtnChallenge.active = false;
                this.LabChallenge.string = i18n.tt(Lang.family_chifEmpty);// 候选人轮空,恭喜族长继续连任
            }
        }
    }

    public getIsWinOrFail(logList: ReportIdx[]): boolean {
        if (logList && logList.length >= 2) {
            let win = 0;
            let fail = 0;

            for (let i = 0; i < logList.length; i++) {
                if (logList[i].Win) {
                    win++;
                }
            }
            fail = logList.length - win;

            return win > fail;
        }
        return false;
    }

    /** 我的排行信息 */
    private _onFamilyGetMyRank(data): void {
        const myRankInfo: S2CFamilyPatriGetMyRank = this.model.getMyRankInfo();
        const rank: string = myRankInfo.Rank
            ? `${i18n.tt(Lang.arena_di)}${myRankInfo.Rank}${i18n.tt(Lang.arena_ming)}`
            : i18n.tt(Lang.com_notinrank);// 第几名:'未上榜';

        this.LabMyRank.string = rank;
        // 距离最高伤害
        this.LabDamage.string = `${UtilNum.Convert(myRankInfo.MaxVal)}`;
        // 最高伤害
        this.LabMaxDamage.string = `${UtilNum.Convert(myRankInfo.Val)}`;
        // 距离第一名
        this.NddistanceFirst.active = Number(myRankInfo.Rank) !== 1;
        // 判断是否是族长

        // 是否是候选人

        // 是族长 这里的显示就不同的结构
        // 是族长 这里的显示就不同的结构
        // 是族长 这里的显示就不同的结构
        // 是族长 这里的显示就不同的结构
    }
}
