/*
 * @Author: kexd
 * @Date: 2023-01-16 21:33:37
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\v\RobWin.ts
 * @Description: 拦截界面
 *
 */

import WinMgr from '../../../../app/core/mvc/WinMgr';
import ListView from '../../../base/components/listview/ListView';
import { WinCmp } from '../../../com/win/WinCmp';
import { ViewConst } from '../../../const/ViewConst';
import RobItem from '../com/RobItem';
import ModelMgr from '../../../manager/ModelMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { ICarMsg } from '../EscortConst';
import { UtilTime } from '../../../../app/base/utils/UtilTime';

const { ccclass, property } = cc._decorator;

@ccclass
export class RobWin extends WinCmp {
    @property(ListView)
    private ListView: ListView = null;

    private _carList: ICarMsg[] = [];

    protected start(): void {
        super.start();

        this.addE();
    }

    private addE() {
        EventClient.I.on(E.Escort.RobUI, this.uptUI, this);
        EventClient.I.on(E.Escort.HaveRob, this.uptHaveRob, this);
        EventClient.I.on(E.Escort.TimeOut, this.uptTimeout, this);
        EventClient.I.on(E.Escort.RefreshMainUI, this.uptTimeout, this);
    }

    private remE() {
        EventClient.I.off(E.Escort.RobUI, this.uptUI, this);
        EventClient.I.off(E.Escort.HaveRob, this.uptHaveRob, this);
        EventClient.I.off(E.Escort.TimeOut, this.uptTimeout, this);
        EventClient.I.off(E.Escort.RefreshMainUI, this.uptTimeout, this);
    }

    public init(args: unknown[]): void {
        this._carList = args[0] as ICarMsg[];
        const userIds: number[] = [];
        for (let i = 0; i < this._carList.length; i++) {
            this._carList[i].canRob = ModelMgr.I.EscortModel.canRob(this._carList[i].carData);
            userIds.push(this._carList[i].carData.UserId);
        }
        this.ListView.setNumItems(this._carList.length);
        this._carList.sort(this.sort);

        ControllerMgr.I.EscortController.reqEscortGetCarData(userIds);
    }

    private uptUI() {
        for (let i = 0; i < this._carList.length; i++) {
            const car = ModelMgr.I.EscortModel.getCarData(this._carList[i].carData.UserId);
            this._carList[i].info.d.setData(car.UserShowInfo);
            this._carList[i].carData = car;
        }
        this._carList.sort(this.sort);
        this.ListView.setNumItems(this._carList.length);
    }

    private uptTimeout() {
        const now = UtilTime.NowSec();
        const carList = this._carList;
        this._carList = [];
        for (let i = 0; i < carList.length; i++) {
            const car = ModelMgr.I.EscortModel.getCarData(carList[i].carData.UserId);
            if (car && car.EndTime > now) {
                carList[i].carData = car;
                this._carList.push(carList[i]);
            }
        }
        this._carList.sort(this.sort);
        this.ListView.setNumItems(this._carList.length);
        // if (this._carList.length <= 0) {
        //     this.onClose();
        // }
    }

    private sort(a: ICarMsg, b: ICarMsg): number {
        if (a.canRob !== b.canRob) {
            return a.canRob - b.canRob;
        }
        if (a.info.d.Level !== b.info.d.Level) {
            return b.info.d.Level - a.info.d.Level;
        }
        if (a.cfgEscort.Quality !== b.cfgEscort.Quality) {
            return b.cfgEscort.Quality - a.cfgEscort.Quality;
        }
        if (a.info.d.FightValue !== b.info.d.FightValue) {
            return a.info.d.FightValue - b.info.d.FightValue;
        }
        return a.info.userID - b.info.userID;
    }

    private uptHaveRob(userId: number) {
        const index: number = this._carList.findIndex((v) => v.carData.UserId === userId);
        if (index >= 0) {
            this._carList.splice(index, 1);
        }
        this.ListView.setNumItems(this._carList.length);
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const item = node.getComponent(RobItem);
        if (item) {
            item.getComponent(RobItem).setData(this._carList[idx]);
        }
    }

    private onClose() {
        WinMgr.I.close(ViewConst.RobWin);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
