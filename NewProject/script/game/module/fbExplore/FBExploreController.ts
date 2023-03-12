/*
 * @Author: zs
 * @Date: 2023-01-06 17:17:59
 * @Description:
 *
 */

import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../const/ViewConst';
import ControllerMgr from '../../manager/ControllerMgr';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { MaterialTabId } from '../material/MaterialConst';
import { EFBExploreType } from './FBExploreConst';

const { ccclass } = cc._decorator;

@ccclass('FBExploreController')
export default class FBExploreController extends BaseController {
    public addNetEvent(): void {
        // throw new Error('Method not implemented.');
        EventProto.I.on(ProtoId.S2CExploreFight_ID, this.onS2CExploreFight, this);
        EventProto.I.on(ProtoId.S2CExploreSweep_ID, this.onS2CExploreSweep, this);
    }
    public delNetEvent(): void {
        // throw new Error('Method not implemented.');
        EventProto.I.off(ProtoId.S2CExploreFight_ID, this.onS2CExploreFight, this);
        EventProto.I.off(ProtoId.S2CExploreSweep_ID, this.onS2CExploreSweep, this);
    }
    public addClientEvent(): void {
        // throw new Error('Method not implemented.');
    }
    public delClientEvent(): void {
        // throw new Error('Method not implemented.');
    }
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }

    /** 请求挑战 */
    public C2SExploreFight(type: EFBExploreType): void {
        const d = new C2SExploreFight();
        d.ExploreType = type;
        NetMgr.I.sendMessage(ProtoId.C2SExploreFight_ID, d);
    }

    private onS2CExploreFight(d: S2CExploreFight) {
        if (d.Tag === 0) {
            console.log('onS2CExploreFight=', d);
        }
    }

    /**
     * 一键挑战（扫荡）
     */
    public C2SExploreSweep(type: EFBExploreType): void {
        const d = new C2SExploreSweep();
        d.ExploreType = type;
        NetMgr.I.sendMessage(ProtoId.C2SExploreSweep_ID, d);
    }

    private onS2CExploreSweep(d: S2CExploreSweep) {
        if (d.Tag === 0) {
            this.showReport(d.ExploreType, d.BStage, d.EStage);
        }
    }

    public linkOpen(tab?: number, params?: any[], ...args: any[]): void {
        ControllerMgr.I.MaterialController.linkOpen(tab, params, ...args);
    }

    /** 显示宝石秘矿界面 */
    public showWin(params?: any[], ...args: any[]): void {
        this.linkOpen(MaterialTabId.FBExplore, params, ...args);
    }

    /** 显示对应功能界面 */
    public showFunc(type: EFBExploreType): void {
        if (WinMgr.I.checkIsOpen(ViewConst.MaterialWin)) {
            WinMgr.I.open(ViewConst.FBExploreReport, type);
        } else {
            // this.showWin([type, 1]);
            ModelMgr.I.FBExploreModel.getFuncWinId(type);
            // WinMgr.I.open()
        }
    }

    /** 显示一键扫荡的战报 */
    public showReport(type: EFBExploreType, startId: number, endId: number): void {
        if (WinMgr.I.checkIsOpen(ViewConst.MaterialWin)) {
            WinMgr.I.open(ViewConst.FBExploreReport, type, startId, endId);
        } else {
            this.showWin([type, 1]);
        }
    }

    /** 显示排行榜界面 */
    public showRank(type: EFBExploreType): void {
        if (WinMgr.I.checkIsOpen(ViewConst.MaterialWin)) {
            WinMgr.I.open(ViewConst.FBExploreRank, type);
        } else {
            this.showWin([type, 2]);
        }
    }
}
