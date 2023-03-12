/*
 * @Author: wangxina
 * @Date: 2022-07-11 18:31:31
 * @FilePath: \SanGuo\assets\script\game\module\gradeGift\GradeGiftController.ts
 */
import BaseController from '../../../app/core/mvc/controller/BaseController';
import NetMgr from '../../manager/NetMgr';

const { ccclass } = cc._decorator;

@ccclass('GradeGiftController')
export class GradeGiftController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        //
    }

    public delNetEvent(): void {
        //
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
     * 进阶豪礼
     * @param GradeId 进阶玩法id
     * @param BigLv 阶数
     */
    public ReqC2SGradeGetUpGift(GradeId: number, BigLv: number) {
        // GradeId = 1 进阶玩法Id   BigLv = 2 阶数
        const req = new C2SGradeGetUpGift();
        req.GradeId = GradeId;
        req.BigLv = BigLv;
        NetMgr.I.sendMessage(ProtoId.C2SGradeGetUpGift_ID, req);
    }
}
