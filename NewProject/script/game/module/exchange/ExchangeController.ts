/*
 * @Author: zs
 * @Date: 2022-06-08 18:14:45
 * @FilePath: \SanGuo\assets\script\game\module\exchange\ExchangeController.ts
 * @Description:
 *
 */
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../const/ViewConst';
import NetMgr from '../../manager/NetMgr';

const { ccclass } = cc._decorator;
@ccclass('ExchangeController')
export class ExchangeController extends BaseController {
    public addNetEvent(): void {
        // throw new Error('Method not implemented.');
        EventProto.I.on(ProtoId.S2CCurrencyExchangeRep_ID, this.onS2CCurrencyExchangeRep, this);
    }
    public delNetEvent(): void {
        // throw new Error('Method not implemented.');
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
    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        // console.log('aaaaaaaaa=', args);
        WinMgr.I.open(ViewConst.ExchangeWin);
        return true;
    }

    public reqC2SCurrencyExchangeReq(id: number): void {
        const d: C2SCurrencyExchangeReq = {
            ExchangeId: id,
        };
        NetMgr.I.sendMessage(ProtoId.C2SCurrencyExchangeReq_ID, d);
    }

    private onS2CCurrencyExchangeRep(d: S2CCurrencyExchangeRep) {
        if (d.Tag === 0) {
            console.log('d.ExchangeId=', d.ExchangeId);
        }
    }
}
