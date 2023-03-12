/*
 * @Author: kexd
 * @Date: 2023-02-17 11:21:48
 * @FilePath: \SanGuo2.4\assets\script\game\module\funcPreview\FuncPreviewController.ts
 * @Description:
 *
 */

import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { DailyTabDataArr } from '../daily/DailyConst';

const { ccclass } = cc._decorator;
@ccclass('FuncPreviewController')
export default class FuncPreviewController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CGetFuncPreviewPrize_ID, this.onS2CGetFuncPreviewPrize, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CGetFuncPreviewPrize_ID, this.onS2CGetFuncPreviewPrize, this);
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
        if (UtilFunOpen.isOpen(FuncId.FuncPreview, true)) {
            WinMgr.I.open(ViewConst.DailyWin, tab, params ? params[0] : 0);
        }

        return true;
    }

    /** 请求领取 */
    public reqGetFuncPreviewPrize(FuncId: number): void {
        const d: C2SGetFuncPreviewPrize = {
            FuncId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGetFuncPreviewPrize_ID, d);
    }

    private onS2CGetFuncPreviewPrize(d: S2CGetFuncPreviewPrize) {
        // console.log('领取了功能预告的奖励:', d);
        if (d) {
            ModelMgr.I.FuncPreviewModel.refreshFuncGot(d.FuncId);
        }
    }
}
