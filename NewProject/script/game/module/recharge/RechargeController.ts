/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: zs
 * @Date: 2022-06-10 15:28:08
 * @LastEditors: Please set LastEditors
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { Config } from '../../base/config/Config';
import GameApp from '../../base/GameApp';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { EIdentiType } from '../../com/msgbox/IdentitykBox';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { RoleMgr } from '../role/RoleMgr';
import { EMallType } from './RechargeConst';

/*
 * @Author: zs
 * @Date: 2022-06-06 17:10:24
 * @FilePath: \SanGuo\assets\script\game\module\recharge\RechargeController.ts
 * @Description:
 *
 */
const { ccclass } = cc._decorator;
@ccclass('RechargeController')
export class RechargeController extends BaseController {
    public addNetEvent(): void {
        // throw new Error("Method not implemented.");
        EventProto.I.on(ProtoId.S2CChargeMallBuyRep_ID, this.onS2CChargeMallBuyRep, this);
        EventProto.I.on(ProtoId.S2CGetChargeMallList_ID, this.onS2CGetChargeMallList, this);
        // EventProto.I.on(ProtoId.S2CBanShuChargeRep_ID, this.onS2CBanShuChargeRep, this);
        EventProto.I.on(ProtoId.S2CGetIDCardChargeRMB_ID, this.onS2CGetIDCardChargeRMB, this);
    }
    public delNetEvent(): void {
        // throw new Error("Method not implemented.");
        EventProto.I.off(ProtoId.S2CChargeMallBuyRep_ID, this.onS2CChargeMallBuyRep, this);
        EventProto.I.off(ProtoId.S2CGetChargeMallList_ID, this.onS2CGetChargeMallList, this);
        // EventProto.I.off(ProtoId.S2CBanShuChargeRep_ID, this.onS2CBanShuChargeRep, this);
        EventProto.I.off(ProtoId.S2CGetIDCardChargeRMB_ID, this.onS2CGetIDCardChargeRMB, this);
    }
    public addClientEvent(): void {
        // EventProto.I.on(ProtoId.S2CChargeMallBuyRep_ID, this.onS2CChargeMallBuyRep, this);
        // throw new Error("Method not implemented.");
    }
    public delClientEvent(): void {
        // throw new Error("Method not implemented.");
    }
    public clearAll(): void {
        // throw new Error("Method not implemented.");
    }

    private realAuth: number = 0;
    /**
     * ??????????????????
     * @param goodsId ??????id
     */
    public reqC2SChargeMallBuyReq(goodsId: number): void {
        this.goodsId = goodsId;
        const itemString: string = Config.Get(Config.Type.Cfg_ChargeMall).getValueByKey(this.goodsId, 'ItemString');
        const itemStrings = itemString.split(':');
        this.chageString = itemStrings[1];
        this.chargeNum = Config.Get(Config.Type.Cfg_ChargeMall).getValueByKey(this.goodsId, 'Money');
        // ?????????????????? 0 ????????? 1??????8??? ???2 ??????8??????16??? 3 ??????16 ??????18???4??????
        this.realAuth = RoleMgr.I.d.RealNameRealAuth;
        console.log('???????????????????????????', this.realAuth);
        if (this.realAuth === 1) {
            WinMgr.I.open(
                ViewConst.IdentitykBox,
                EIdentiType.PayLimit,
                { realAuth: this.realAuth, chargeNum: this.chargeNum, countNum: 0 },
            );
        } else if (this.realAuth !== 4) {
            this.C2SGetIDCardChargeRMB(this.goodsId);
        } else {
            this.doCharge();
        }
    }

    private goodsId: number = 0;
    private chargeNum: number = 0;
    private chageString: string = null;
    private doCharge(): void {
        // if (GameApp.I.isBanshu()) {
        //     this.reqC2SBanShuChargeRep(this.goodsId);
        // } else {
        //     EventClient.I.emit(E.GM.SendGMMsg, 'charge', this.goodsId.toString());
        // }
        if (this.chageString) {
            MsgToastMgr.Show(`${i18n.tt(Lang.com_chongzhi)}${this.chageString}`);
            const d: C2SChargeMallBuyReq = {
                Gid: this.goodsId,
            };
            NetMgr.I.sendMessage(ProtoId.C2SChargeMallBuyReq_ID, d);
        } else {
            // MsgToastMgr.Show(`??????${this.chageString}`);
            const d: C2SChargeMallBuyReq = {
                Gid: this.goodsId,
            };
            NetMgr.I.sendMessage(ProtoId.C2SChargeMallBuyReq_ID, d);
            console.log(`reqCharge${this.goodsId}????????????????????????`);
        }
    }

    /** ?????? */
    public reqC2SGetChargeMallList(t: EMallType): void {
        const d: C2SGetChargeMallList = {
            T: t,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGetChargeMallList_ID, d);
    }

    // /** ???????????? */
    // public reqC2SBanShuChargeRep(goodsId: number): void {
    //     const d: C2SBanShuChargeReq = {
    //         GoodsId: goodsId,
    //     };
    //     NetMgr.I.sendMessage(ProtoId.C2SBanShuChargeReq_ID, d);
    // }

    /** ???????????????????????? */
    private onS2CChargeMallBuyRep(d: S2CChargeMallBuyRep) {
        if (d.Tag === 0) {
            EventClient.I.emit(E.Recharge.BuyShopSuccess, d.Gid);
            MsgToastMgr.Show(i18n.tt(Lang.recharge_success));
        }
    }

    private onS2CGetChargeMallList(d: S2CGetChargeMallList) {
        if (d.Tag === 0) {
            ModelMgr.I.RechargeModel.setGoodsDatas(d.GoodsList);
            EventClient.I.emit(E.Recharge.UpdateGoodsDataList, d.T);
        }
    }

    /** ??????????????????????????????????????? */
    private onS2CGetIDCardChargeRMB(d: S2CGetIDCardChargeRMB) {
        if (d.Tag === 0) {
            console.log('????????????????????????', d.RMB);
            if (d.ChargeTag !== 0) {
                WinMgr.I.open(ViewConst.IdentitykBox, EIdentiType.PayLimit, d.ChargeTag);
            } else {
                this.doCharge();
            }
        } else {
            console.log('????????????????????????');
        }
    }

    /** ?????????????????????????????????????????? */
    public C2SGetIDCardChargeRMB(goodsId: number): void {
        const d = new C2SGetIDCardChargeRMB();
        d.Gid = goodsId;
        NetMgr.I.sendMessage(ProtoId.C2SGetIDCardChargeRMB_ID, d);
    }

    /**
     * ????????????
     * @param tab ??????id
     * @param params ????????????????????????
     * @param args ?????????????????????????????????
     * @returns
     */
    public linkOpen(tab: number = 0, params: any[] = [0], ...args: any[]): boolean {
        // ??????
        // const isFirstRecharge = RoleMgr.I.d.FirstCharge;
        const isFirstRecharge = false;
        if (!isFirstRecharge) {
            WinMgr.I.open(ViewConst.VipSuperWin, tab);
        }
        return true;
    }
}
