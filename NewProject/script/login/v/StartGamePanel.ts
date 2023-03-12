/*
 * @Author: hrd
 * @Date: 2022-04-20 18:20:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-14 14:14:14
 * @FilePath: \SanGuo\assets\script\login\v\StartGamePanel.ts
 * @Description:
 *
 */

import { EventClient } from '../../app/base/event/EventClient';
import BaseCmp from '../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../app/core/mvc/WinMgr';
import ModelMgr from '../../game/manager/ModelMgr';
import { UtilGame } from '../../game/base/utils/UtilGame';
import { E } from '../../game/const/EventName';
import { ViewConst } from '../../game/const/ViewConst';
import { IAreaInfo } from '../LoginConst';
import PerformanceMgr from '../../game/manager/PerformanceMgr';
import { AudioMgr } from '../../app/base/manager/AudioMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class StartGamePanel extends BaseCmp {
    @property(cc.Node)
    private NdBase: cc.Node = null;
    @property(cc.Node)
    private BtnNotice: cc.Node = null;
    @property(cc.Node)
    private BtnStartGame: cc.Node = null;
    @property(cc.Node)
    private BtnSelServer: cc.Node = null;
    @property(cc.Label)
    private LabNewSerName: cc.Label = null;
    @property(cc.Label)
    private LabNowSerName: cc.Label = null;

    protected onLoad(): void {
        super.onLoad();
        this.addEvent();
        this.initUI();
    }

    private addEvent() {
        EventClient.I.on(E.Login.ClickServerItem, this.onUpServerItem, this);
    }

    private delEvent() {
        EventClient.I.off(E.Login.ClickServerItem, this.onUpServerItem, this);
    }

    private initUI() {
        UtilGame.Click(this.BtnNotice, this.openNoticeView, this);
        UtilGame.Click(this.BtnSelServer, this.openSelServerView, this);
        UtilGame.Click(this.BtnStartGame, this.startGame, this);
    }

    private openNoticeView() {
        //
    }

    private openSelServerView() {
        WinMgr.I.open(ViewConst.SelServerView);
    }

    private startGame() {
        const model = ModelMgr.I.LoginModel;
        if (model.isHaveRole()) {
            // 有角色进入游戏
            this.enterGame();
        } else {
            // 没有角色创角
            this.enterCreateRole();
        }
        // 背景音乐音量等信息在角色信息里 需要角色信息有了才能拿到背景音乐信息
        // WinMgr.I.open(ViewConst.GameWelcomeWin);
    }

    private enterGame() {
        PerformanceMgr.I.loginCollect();
        EventClient.I.emit(E.Login.ReqGetgateaddr);
    }

    private enterCreateRole() {
        WinMgr.I.open(ViewConst.CreateRoleView);
    }

    public setData(n: string, m: string): void {
        this.LabNowSerName.string = n;
        this.LabNewSerName.string = m;
    }

    private onUpServerItem(info: IAreaInfo) {
        if (!info) return;
        this.LabNowSerName.string = info.area_name;
    }

    public setHideBaseNode(v: boolean): void {
        this.NdBase.active = v;
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.delEvent();
    }
}
