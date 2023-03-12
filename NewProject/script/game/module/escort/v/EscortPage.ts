/*
 * @Author: kexd
 * @Date: 2022-08-15 16:41:25
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\v\EscortPage.ts
 * @Description:
 *
 */

import { TickTimer } from '../../../base/components/TickTimer';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinTabPage } from '../../../com/win/WinTabPage';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { EscortModel } from '../EscortModel';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { BagMgr } from '../../bag/BagMgr';
import UtilItem from '../../../base/utils/UtilItem';
import ActivityMgr from '../../activity/timerActivity/ActivityMgr';
import { ETimerActId, ETimeState } from '../../activity/timerActivity/TimerActivityConst';
import {
    ERobState, EscortState, ICarMsg,
} from '../EscortConst';
import { EMarkType } from '../../../../app/core/mvc/WinConst';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import EscortItem from '../com/EscortItem';
import { RoleInfo } from '../../role/RoleInfo';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { DailyTabDataArr, EDailyPageType } from '../../daily/DailyConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class EscortPage extends WinTabPage {
    @property(cc.Label)
    private LabSend: cc.Label = null;
    @property(cc.Label)
    private LabDouble: cc.Label = null;
    @property(cc.Label)
    private LabSendTimes: cc.Label = null;
    @property(cc.Label)
    private LabRobbedTimes: cc.Label = null;

    @property(TickTimer)
    private TickTime: TickTimer = null;

    @property(cc.Node)
    private NdCar: cc.Node = null;
    @property(cc.Node)
    private BtnStart: cc.Node = null;
    @property(cc.Node)
    private BtnQuick: cc.Node = null;
    @property(cc.Node)
    private BtnReward: cc.Node = null;
    @property(cc.Node)
    private BtnRobbed: cc.Node = null;

    @property(cc.Node)
    private NdStartRed: cc.Node = null;

    private _M: EscortModel = null;
    // 界面镖车队列最大值
    private readonly _maxCar: number = 30;
    // 3秒刷新一次
    private readonly _per: number = 3;
    // 8等分路线 75
    private readonly _chanelY: number[] = [280, 280 - 75, 280 - 75 * 2, 280 - 75 * 3, 280 - 75 * 4, 280 - 75 * 5, 280 - 75 * 6, 280 - 75 * 7];
    private readonly _maxChanel: number = 6;
    private _chosseChanel: number[] = [];
    // 押镖队列
    private _carList: ICarMsg[] = [];
    // 是否双倍奖励时间里
    private _isDoubleTime: boolean = false;
    // 状态
    private _state: EscortState = EscortState.Start;

    protected onLoad(): void {
        super.onLoad();
        if (!this._M) {
            this._M = ModelMgr.I.EscortModel;
        }
    }

    protected start(): void {
        super.start();
        this.addE();
        this.clk();
        this.uptUI();
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        if (!this._M) {
            this._M = ModelMgr.I.EscortModel;
        }
        ControllerMgr.I.EscortController.reqOpenEscortUI();
    }

    private addE() {
        EventClient.I.on(E.Escort.MainUI, this.uptMainUI, this);
        EventClient.I.on(E.Escort.RefreshMainUI, this.refreshMainUI, this);
        EventClient.I.on(E.Escort.Start, this.uptState, this);
        EventClient.I.on(E.Escort.Quick, this.uptState, this);
        EventClient.I.on(E.Escort.GetReward, this.uptGetReward, this);
        EventClient.I.on(E.Escort.MoveToEnd, this.carMoveToEnd, this);
        EventClient.I.on(E.Escort.TimeOut, this.removeCar, this);
        EventClient.I.on(E.Escort.Rob, this.uptRob, this);
        EventClient.I.on(E.Game.DayChange, this.onDayChange, this);

        RoleMgr.I.on(this.uptUI, this, RoleAN.N.VipLevel);
    }

    private remE() {
        EventClient.I.off(E.Escort.MainUI, this.uptMainUI, this);
        EventClient.I.off(E.Escort.RefreshMainUI, this.refreshMainUI, this);
        EventClient.I.off(E.Escort.Start, this.uptState, this);
        EventClient.I.off(E.Escort.Quick, this.uptState, this);
        EventClient.I.off(E.Escort.GetReward, this.uptGetReward, this);
        EventClient.I.off(E.Escort.MoveToEnd, this.carMoveToEnd, this);
        EventClient.I.off(E.Escort.TimeOut, this.removeCar, this);
        EventClient.I.off(E.Escort.Rob, this.uptRob, this);
        EventClient.I.off(E.Game.DayChange, this.onDayChange, this);

        RoleMgr.I.off(this.uptUI, this, RoleAN.N.VipLevel);
    }

    private clk() {
        UtilGame.Click(this.BtnStart, () => {
            // 是否在活动时间内
            const ActTimeState: ETimeState = ActivityMgr.I.getActState(ETimerActId.Escort);
            if (ActTimeState === ETimeState.UnStart) {
                MsgToastMgr.Show(i18n.tt(Lang.escort_unStart));
                return;
            }
            if (ActTimeState === ETimeState.End) {
                MsgToastMgr.Show(i18n.tt(Lang.escort_end));
                return;
            }
            // 押送次数
            const times = this._M.leftEscortNum;
            if (times <= 0) {
                MsgToastMgr.Show(i18n.tt(Lang.escort_no_times));
                return;
            }
            // 是否双倍
            if (!this._isDoubleTime) {
                const str = i18n.tt(Lang.escort_no_double);
                ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${str}</c>`, () => {
                    WinMgr.I.open(ViewConst.ChooseBoardWin);
                }, { showToggle: 'EscortPage1', tipTogState: false });
            } else {
                WinMgr.I.open(ViewConst.ChooseBoardWin);
            }
        }, this);

        UtilGame.Click(this.BtnQuick, () => {
            // vip 未达到
            const canQuick: boolean = this._M.canQuickFinish();
            if (!canQuick) {
                const needVip = this._M.getQuickFinishVipName();
                const str = UtilString.FormatArray(
                    i18n.tt(Lang.escort_open_quick),
                    [needVip],
                );
                MsgToastMgr.Show(str);
                return;
            }

            const cost = this._M.getCfgValue('QuickCost');
            const arr = cost.split(':');
            const id: number = +arr[0];
            const need: number = +arr[1];
            const name: string = UtilItem.GetCfgByItemId(id).Name;

            const str = UtilString.FormatArray(
                i18n.tt(Lang.escort_quick_finish),
                [`${need}${name}`],
            );
            ModelMgr.I.MsgBoxModel.ShowBox(str, () => {
                // 消耗是否足够
                const have: number = BagMgr.I.getItemNum(id);
                if (have >= need) {
                    ControllerMgr.I.EscortController.reqEscortQuickFinish();
                } else {
                    MsgToastMgr.Show(`${name}${i18n.tt(Lang.not_enough)}`);
                    WinMgr.I.open(ViewConst.ItemSourceWin, id);
                }
            }, { showToggle: 'EscortPage2', tipTogState: false });
        }, this);

        UtilGame.Click(this.BtnReward, () => {
            WinMgr.I.open(ViewConst.EscortRewardWin);
        }, this);

        UtilGame.Click(this.BtnRobbed, () => {
            WinMgr.I.open(ViewConst.RobbedWin);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_START, this.onMapMouseDown, this);
    }

    private onMapMouseDown(event: cc.Event.EventMouse): void {
        const pos: cc.Vec2 = this.node.convertToNodeSpaceAR(event.getLocation());
        // 点击范围里是否有镖车
        const cars: ICarMsg[] = [];
        const canRobCars: ICarMsg[] = [];
        const leftRobNum = this._M.leftRobNum;
        const robLimit = +this._M.getCfgValue('RobLimitTimes');
        let canRob: ERobState = ERobState.CanRob;
        //
        let isSelf: boolean = false;
        let overTimes: boolean = false;
        let haveRob: boolean = false;

        for (let i = 0; i < this.NdCar.childrenCount; i++) {
            const ndCar = this.NdCar.children[i];
            const halfw = ndCar.width / 2 + 30;
            const halfh = ndCar.height / 2;
            if (pos.x >= ndCar.x - halfw && pos.x <= ndCar.x + halfw
                && pos.y >= ndCar.y - halfh && pos.y <= ndCar.y + halfh) {
                const item = ndCar.getComponent(EscortItem);
                if (item) {
                    const carMsg = item.getCarMsg();
                    cars.push(carMsg);
                    // 符合条件:有次数；不是自己；被拦截还没达到上限；还没被自己拦截过
                    canRob = this._M.canRob(carMsg.carData);
                    if (canRob === ERobState.CanRob) {
                        canRobCars.push(carMsg);
                    } else if (canRob === ERobState.IsSelf) {
                        isSelf = true;
                    } else if (canRob === ERobState.OverTimes) {
                        overTimes = true;
                    } else if (canRob === ERobState.HaveRob) {
                        haveRob = true;
                    }
                }
            }
        }
        if (cars.length > 0) {
            // 次数不足
            if (leftRobNum <= 0) {
                MsgToastMgr.Show(i18n.tt(Lang.escort_rob_no));
                return;
            }
            if (canRobCars.length === 0) {
                if (isSelf) {
                    MsgToastMgr.Show(i18n.tt(Lang.escort_rob_self));
                } else if (overTimes) {
                    MsgToastMgr.Show(UtilString.FormatArray(i18n.tt(Lang.escort_rob_twice), [robLimit]));
                } else if (haveRob) {
                    MsgToastMgr.Show(i18n.tt(Lang.escort_rob_done));
                }
            } else {
                WinMgr.I.open(ViewConst.RobWin, canRobCars);
            }
        }
    }

    /** 跨天 */
    private onDayChange() {
        ControllerMgr.I.EscortController.reqOpenEscortUI();
    }

    private _detal: number = 0;
    private _preTime: number = 0;
    private _oneSec = this._per;
    protected update(dt: number): void {
        // 每3秒执行一次
        this._oneSec += dt;
        if (this._oneSec >= this._per) {
            this._oneSec -= this._per;
            const isInActTime: boolean = ActivityMgr.I.isInActTime(ETimerActId.Escort);
            if (isInActTime) {
                //
                const isDoubelTime: boolean = this._M.isInDoubleTime();
                if (this._isDoubleTime !== isDoubelTime) {
                    this.uptDouble(isDoubelTime);
                    this._isDoubleTime = isDoubelTime;
                }
                // 请求刷新
                if (this._M.recMainUI) {
                    ControllerMgr.I.EscortController.reqEscortRefreshUIData();
                }
            }
        }

        if (this._carList.length === 0) return;
        const now = UtilTime.NowMSec();
        if (now - this._preTime > this._detal) {
            this._preTime = now;
            this._detal = UtilNum.RandomInt(500, 1500);
            const speed = UtilNum.RandomFloat(14, 18, 1);

            // 避免过度重叠
            let chanelY = 0;
            let index = 0;
            do {
                chanelY = UtilNum.RandomInt(0, 7);
                index = this._chosseChanel.indexOf(chanelY);
            } while (index >= 0);

            if (this._chosseChanel.length < this._maxChanel) {
                this._chosseChanel.push(chanelY);
            } else {
                this._chosseChanel.shift();
                this._chosseChanel.push(chanelY);
            }

            // console.log('随机到赛道：', chanelY);

            // 从队列里取一个对象数据
            const car = this._carList.shift();
            if (car) {
                this.createCar(car, speed, this._chanelY[chanelY]);
            }
        }
    }

    /** 生成一个镖车对象 */
    private createCar(car: ICarMsg, speed: number, posy: number) {
        //
        let isCreated: boolean = false;
        for (let i = 0; i < this.NdCar.childrenCount; i++) {
            const ndCar = this.NdCar.children[i];
            const item = ndCar.getComponent(EscortItem);
            if (item) {
                const carMsg = item.getCarMsg();
                if (carMsg.carData.UserId === car.carData.UserId) {
                    isCreated = true;
                }
            }
        }
        if (isCreated) {
            console.warn('已经生成过该镖车了', car);
            return;
        }
        ResMgr.I.showPrefab(UI_PATH_ENUM.EscortItem, this.NdCar, (err, nd: cc.Node) => {
            if (err || !this.NdCar || !this.NdCar.isValid) return;
            const item = nd.getComponent(EscortItem);
            item.setData(car, speed, posy);
        });
    }

    /** 有镖车移动到终点了 */
    private carMoveToEnd(carMsg: ICarMsg) {
        // console.log('有镖车移动到终点了:', userId, '当前镖车队列长度', this._carList.length);
        if (carMsg) {
            if (this._carList.length < this._maxCar) {
                const index = this._carList.findIndex((v) => v.carData.UserId === carMsg.carData.UserId);
                if (index < 0) {
                    this._carList.push(carMsg);
                }
            }
        }
        // console.log('现在镖车队列长度', this._carList.length);
    }

    /** 押镖完成需移除镖车 */
    private removeCar(carMsg: ICarMsg): void {
        if (!carMsg) return;

        // 从镖车队列里删除
        for (let i = 0; i < this._carList.length; i++) {
            if (this._carList[i].carData.UserId === carMsg.carData.UserId) {
                this._carList.splice(i, 1);
                break;
            }
        }

        // 是其它镖车的话就删了model里的原始数据
        this._M.delCar(carMsg.carData.UserId);

        // 状态会发生变化：完成可领取
        this.uptUI();
    }

    /** 生成镖车队列数据 */
    private uptCarList() {
        const now = UtilTime.NowSec();
        const carDatas = this._M.getAllCarData();
        const indexer = this._M.CfgEscort;

        // 先检查已生成的镖车情况
        const havereated: number[] = [];
        for (let i = 0; i < this.NdCar.childrenCount; i++) {
            const ndCar = this.NdCar.children[i];
            const item = ndCar.getComponent(EscortItem);
            if (item) {
                const carMsg = item.getCarMsg();
                if (carDatas[carMsg.carData.UserId]) {
                    // 先push已生成的镖车到队列里
                    havereated.push(carMsg.carData.UserId);
                } else {
                    // 已生成的镖车不在最新的服务端下发镖车数据里，可能有细微的时间差, 直接删了
                    console.log('已生成的镖车不在最新的服务端下发镖车数据里，可能有细微的时间差，');
                    item.node.destroy();
                }
            }
        }
        // console.log('已生成镖车的', havereated);

        // 1. 删了不存在了或不在时间内的镖车
        for (let i = this._carList.length; i >= 0; i--) {
            // 不存在了或不在时间内
            if (this._carList[i] && (!carDatas[this._carList[i].carData.UserId] || this._carList[i].carData.EndTime < now)) {
                this._carList.splice(i, 1);
            }
        }
        // 2. 重现插入新的镖车
        for (const i in carDatas) {
            // 检测状态是押镖中
            if (carDatas[i].EndTime > now) {
                if (this._carList.length < this._maxCar) {
                    // 是否是已生成镖车了的数据
                    const index = havereated.indexOf(carDatas[i].UserId);
                    const carIndex = this._carList.findIndex((v) => v.carData.UserId === carDatas[i].UserId);
                    if (index < 0 && carIndex < 0) {
                        const carMsg: ICarMsg = {
                            carData: carDatas[i],
                            cfgEscort: indexer.getValueByKey(carDatas[i].QualityId),
                            info: new RoleInfo(carDatas[i].UserShowInfo),
                            canRob: this._M.canRob(carDatas[i]),
                            state: EscortState.Escorting,
                        };
                        this._carList.push(carMsg);
                    }
                }
            }
        }
        // console.log('this._carList=', this._carList);
    }

    /** 返回主界面协议的刷新 */
    private uptMainUI() {
        this.uptCarList();
        this.uptUI();
    }

    /** 刷新界面镖车的数据及模型 */
    private refreshMainUI() {
        this.uptCarList();
        // 状态是否有变化
        const myCar = this._M.myCar();
        if (!myCar) {
            if (this._state !== EscortState.Start) this.uptState();
        } else {
            const state = this._M.getEscortState();
            if (state !== this._state) {
                this.uptState();
            }
        }
    }

    /** 领取奖励的刷新 */
    private uptGetReward() {
        // 押镖完成删了model里的原始数据
        const myCar = this._M.myCar();
        this._M.delMyCar(myCar.UserId);
        // 状态会刷为可押镖
        this.uptUI();
    }

    /** 拦截的刷新 */
    private uptRob() {
        // 拦截会进入战斗，这里可以什么都不做
    }

    /**
     * 状态变化的刷新：请求押镖返回的刷新；领取奖励的返回的刷新
     */
    private uptState() {
        const myCar = this._M.myCar();
        const state = this._M.getEscortState();

        if (state === EscortState.Start) {
            //
        } else if (state === EscortState.Escorting) {
            // 未押镖->押镖中状态
            if (this._carList.length < this._maxCar && this._carList.findIndex((v) => v.carData.UserId === myCar.UserId) < 0) {
                const carMsg: ICarMsg = {
                    carData: myCar,
                    cfgEscort: this._M.CfgEscort.getValueByKey(myCar.QualityId),
                    info: new RoleInfo(myCar.UserShowInfo),
                    canRob: this._M.canRob(myCar),
                    state: EscortState.Escorting,
                };
                this._carList.push(carMsg);
            }
        } else if (state === EscortState.Finish) {
            let myCarMsg: ICarMsg = null;
            for (let i = 0; i < this.NdCar.childrenCount; i++) {
                const ndCar = this.NdCar.children[i];
                const item = ndCar.getComponent(EscortItem);
                if (item) {
                    const carMsg = item.getCarMsg();
                    if (carMsg.carData.UserId === myCar.UserId) {
                        myCarMsg = carMsg;
                        item.node.destroy();
                        break;
                    }
                }
            }
            if (myCarMsg) {
                this.removeCar(myCarMsg);
            }
        }
        //
        this.uptUI();
    }

    private uptUI() {
        // 押镖状态
        this._state = this._M.getEscortState();
        this.BtnStart.active = this._state === EscortState.Start;
        this.BtnQuick.active = this._state === EscortState.Escorting;
        this.BtnReward.active = this._state === EscortState.Finish;
        // 是否可快速完成
        const canQuick: boolean = this._M.canQuickFinish();
        if (this._state === EscortState.Escorting) {
            UtilCocos.SetSpriteGray(this.BtnQuick, !canQuick, true);

            // 倒计时
            const myCar = this._M.myCar();
            const now = UtilTime.NowSec();
            const left = myCar.EndTime - now;
            this.onTick(left);
            this.TickTime.removeEndEventHandler(this.node, 'EscortPage', 'onTick');
            this.TickTime.addTickEventHandler(this.node, 'EscortPage', 'onTick');
        }

        // 押镖时间和双倍时间
        const actCfg: Cfg_Active = ActivityMgr.I.getActData(ETimerActId.Escort);
        this.LabSend.string = actCfg.ActTime;
        const dTime: string[] = this._M.getDoubleTime();
        let dt: string = '';
        for (let i = 0; i < dTime.length; i++) {
            dt += `${dTime[i]}  `;
        }
        this.LabDouble.string = dt;
        // 是否在双倍时间里
        this._isDoubleTime = this._M.isInDoubleTime();
        this.uptDouble(this._isDoubleTime);

        // 押镖次数和拦截次数
        const curEscort: number = this._M.escortNum;
        const curRob: number = this._M.robNum;
        const maxEscort: number = +this._M.getCfgValue('DailyProTimes');
        const maxRob: number = +this._M.getCfgValue('DailyRobTimes');

        this.LabSendTimes.string = `${maxEscort - curEscort}/${maxEscort}`;
        const color: cc.Color = maxEscort - curEscort > 0 ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.RedV);
        this.LabSendTimes.node.color = color;

        this.LabRobbedTimes.string = `${maxRob - curRob}/${maxRob}`;
        const rcolor: cc.Color = maxRob - curRob > 0 ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.RedV);
        this.LabRobbedTimes.node.color = rcolor;
    }

    /** 双倍标签 */
    private uptDouble(isDoubelTime: boolean) {
        const tab: number = DailyTabDataArr.findIndex((v) => v.TabId === EDailyPageType.Escort);
        const markType = isDoubelTime ? EMarkType.Double : EMarkType.None;
        DailyTabDataArr[tab].markType = markType;
        this.getWinTabFrame().setMark(tab, markType);

        if (this._state === EscortState.Start) {
            const ndDouble = this.BtnStart.getChildByName('NdDouble');
            ndDouble.active = isDoubelTime;
        } else if (this._state === EscortState.Escorting) {
            const ndDouble = this.BtnQuick.getChildByName('NdDouble');
            ndDouble.active = isDoubelTime;
        } else {
            const ndDouble = this.BtnReward.getChildByName('NdDouble');
            ndDouble.active = isDoubelTime;
        }
        // 运输红点：在双倍时间里并且运输次数>0
        this._state = this._M.getEscortState();
        if (this._state === EscortState.Start) {
            this.NdStartRed.active = isDoubelTime && this._M.leftEscortNum > 0;
        }
    }

    private onTick(left: number): void {
        if (left > 3600) {
            this.TickTime.node.parent.active = true;
            this.TickTime.tick(left, '%HH:%mm:%ss', false, true);
        } else if (left > 0) {
            this.TickTime.node.parent.active = true;
            this.TickTime.tick(left, '%mm:%ss', true, true);
        } else {
            this.TickTime.node.parent.active = false;
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
