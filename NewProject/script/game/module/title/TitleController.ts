/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/*
 * @Author: kexd
 * @Date: 2022-06-13 10:49:04
 * @FilePath: \SanGuo2\assets\script\game\module\title\TitleController.ts
 * @Description:
 */

import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { RoleMgr } from '../role/RoleMgr';

const { ccclass } = cc._decorator;
@ccclass('TitleController')
export default class TitleController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CTitleListPush_ID, this.onS2CTitleListPush, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CTitleListPush_ID, this.onS2CTitleListPush, this);
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
    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab: number = 0, params: any[] = [0], ...args: any[]): boolean {
        if (UtilFunOpen.isOpen(FuncId.Title, true)) {
            WinMgr.I.open(ViewConst.TitleWin, tab);
        }
        WinMgr.I.open(ViewConst.TitleWin, tab);
        return true;
    }

    /** 请求激活 */
    public reqC2STitleActive(titleId: number): void {
        const d = new C2STitleActive();
        d.TitleId = titleId;
        NetMgr.I.sendMessage(ProtoId.C2STitleActive_ID, d);
        // console.log('请求激活称号:', titleId);
    }
    /** 称号升星 */
    public reqC2STitleUpGrade(titleId: number): void {
        NetMgr.I.sendMessage(ProtoId.C2STitleUpGrade_ID, { TitleId: titleId });
        // console.log('请求称号升星:', titleId);
    }
    /** 称号穿戴 */
    public reqC2STitleWear(titleId: number): void {
        NetMgr.I.sendMessage(ProtoId.C2STitleWear_ID, { TitleId: titleId });
        // console.log('请求称号穿戴:', titleId);
    }
    /** 称号脱下 */
    public reqC2STitleOff(titleId: number): void {
        NetMgr.I.sendMessage(ProtoId.C2STitleOff_ID, { TitleId: titleId });
        // console.log('请求称号脱下:', titleId);
    }
    /** 称号详情 */
    public reqC2STitleInfo(titleId: number, userId: number): void {
        const info: C2STitleInfo = {
            UserId: userId,
            TitleId: titleId,
        };
        NetMgr.I.sendMessage(ProtoId.C2STitleInfo_ID, info);
        // console.log('请求称号详情:', titleId);
    }

    /** 称号列表 */
    private onS2CTitleListPush(data: S2CTitleListPush) {
        // console.log('--------称号列表:', data, RoleMgr.I.d.Title);
        if (data && data.Tag === 0 && (data.TitleList.length > 0 || data.DelTitleIds.length > 0)) {
            ModelMgr.I.TitleModel.setTitleList(data);
        }
    }
}
