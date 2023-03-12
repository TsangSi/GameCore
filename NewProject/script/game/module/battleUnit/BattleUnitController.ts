/*
 * @Author: kexd
 * @Date: 2022-08-15 16:39:21
 * @FilePath: \SanGuo2.4\assets\script\game\module\battleUnit\BattleUnitController.ts
 * @Description: 作战单位
 */
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';

const { ccclass } = cc._decorator;
@ccclass('BattleUnitController')
export default class BattleUnitController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CLineupInfo_ID, this.onS2CLineupInfo, this);
        EventProto.I.on(ProtoId.S2CChangeLineup_ID, this.onS2CChangeLineup, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CLineupInfo_ID, this.onS2CLineupInfo, this);
        EventProto.I.off(ProtoId.S2CChangeLineup_ID, this.onS2CChangeLineup, this);
    }

    /** 事件监听 */
    public addClientEvent(): void {
        //
    }
    public delClientEvent(): void {
        //
    }
    public clearAll(): void {
        //
    }

    /** 武将的站位是123，在战斗里是234，后端让请求站位设为234，故这里有个偏移 */
    public reqGeneralLineupPos(Type: number, Pos: number, OnlyId: string): void {
        this.reqC2SBattleLineupPos(Type, Pos, OnlyId);
    }

    /** 请求设置出战 */
    public reqC2SBattleLineupPos(Type: number, Pos: number, OnlyId: string): void {
        const d: C2SChangeLineup = {
            Type,
            Pos,
            OnlyId,
        };
        // console.log('请求设置出战:', d);
        NetMgr.I.sendMessage(ProtoId.C2SChangeLineup_ID, d);
    }

    /** 登录就返回的出战单位信息 */
    private onS2CLineupInfo(d: S2CLineupInfo) {
        // console.log('-----------------------登录就返回的出战单位信息:', d);
        ModelMgr.I.BattleUnitModel.setBattleLineup(d);
    }

    /** 返回的设置出战 */
    private onS2CChangeLineup(d: S2CChangeLineup) {
        // console.log('-----------------返回的设置出战:', d);
        if (d && !d.Tag) {
            ModelMgr.I.BattleUnitModel.changeLineup(d);
        }
    }
}
