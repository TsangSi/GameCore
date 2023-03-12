/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/*
 * @Author: kexd
 * @Date: 2022-06-13 10:49:04
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\onHook\OnHookController.ts
 * @Description: sendmail@1@2:1000
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import { E } from '../../const/EventName';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { RoleAN } from '../role/RoleAN';
import { RoleMgr } from '../role/RoleMgr';

const { ccclass } = cc._decorator;
@ccclass('OnHookController')
export default class OnHookController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CAFKInfo_ID, this.onS2CAFKInfo, this);
        EventProto.I.on(ProtoId.S2CAFKReward_ID, this.onS2CAFKReward, this);
        EventProto.I.on(ProtoId.S2CQuickAFK_ID, this.onS2CQuickAFK, this);
        // EventProto.I.on(ProtoId.S2CAFKRewardAdd_ID, this.onS2CAFKRewardAdd, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CAFKInfo_ID, this.onS2CAFKInfo, this);
        EventProto.I.off(ProtoId.S2CAFKReward_ID, this.onS2CAFKReward, this);
        EventProto.I.off(ProtoId.S2CQuickAFK_ID, this.onS2CQuickAFK, this);
        // EventProto.I.off(ProtoId.S2CAFKRewardAdd_ID, this.onS2CAFKRewardAdd, this);
    }

    /** 事件监听 */
    public addClientEvent(): void {
        RoleMgr.I.on(this.reqAFKInfo, this, RoleAN.N.Stage);
    }
    public delClientEvent(): void {
        RoleMgr.I.off(this.reqAFKInfo, this, RoleAN.N.Stage);
    }
    public clearAll(): void {
        //
    }

    /** 请求获取挂机收益 */
    public reqAFKInfo(): void {
        // console.log('请求获取挂机收益:');
        NetMgr.I.sendMessage(ProtoId.C2SAFKInfo_ID, {});
    }

    /** 请求领取挂机奖励 */
    public reqAFKReward(): void {
        // console.log('请求领取挂机奖励:');
        NetMgr.I.sendMessage(ProtoId.C2SAFKReward_ID, {});
    }

    /** 请求快速挂机 */
    public reqQuickAFK(): void {
        // console.log('请求快速挂机:');
        NetMgr.I.sendMessage(ProtoId.C2SQuickAFK_ID, {});
    }

    // /** 请求挂机增益效果 */
    // public reqRewardAdd(): void {
    //     // console.log('请求挂机收益信息:');
    //     NetMgr.I.sendMessage(ProtoId.C2SAFKRewardAdd_ID, {});
    // }

    /** 返回挂机收益信息 */
    private onS2CAFKInfo(d: S2CAFKInfo) {
        // console.log('返回挂机收益信息:', d);
        if (d && !d.Tag) {
            ModelMgr.I.OnHookModel.uptAFKInfo(d);
        }
    }

    // /** 返回挂机效果增加信息 */
    // private onS2CAFKRewardAdd(d: S2CAFKRewardAdd) {
    //     if (d && !d.Tag) {
    //         ModelMgr.I.OnHookModel.uptAFKRewardAdd(d.RewardAddList);
    //     }
    // }

    /** 领取挂机奖励 */
    private onS2CAFKReward(d: S2CAFKReward) {
        // console.log('领取挂机奖励:', d);
        if (d && !d.Tag) {
            ModelMgr.I.OnHookModel.uptGetReward();
        }
    }

    /** 快速挂机信息 */
    private onS2CQuickAFK(d: S2CQuickAFK) {
        // console.log('返回快速挂机信息:', d);
        if (d && !d.Tag) {
            ModelMgr.I.OnHookModel.uptQuickAFK(d);
        }
    }
}
