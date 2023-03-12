/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-06-20 18:46:07
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import ItemModel from '../../com/item/ItemModel';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { BattleType } from './BattleResultConst';
import { IBattleReward } from './v/BattleRewardView';
import { BattleRewardExBase } from './v/ex/BattleRewardExBase';

const { ccclass } = cc._decorator;
@ccclass('BattleResultController')
export default class BattleResultController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CPrizeReport_ID, this.onS2CPrizeReport, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CPrizeReport_ID, this.onS2CPrizeReport, this);
    }

    public addClientEvent(): void {
        EventClient.I.on(E.BattleResult.OpenView, this.onOpenBattleResultView, this);
    }
    public delClientEvent(): void {
        EventClient.I.off(E.BattleResult.OpenView, this.onOpenBattleResultView, this);
    }
    public clearAll(): void {
        //
    }

    /** 请求施放当前等待发放的道具 */
    public reqC2SGetBattlePrize(): void {
        const data = new C2SGetBattlePrize();
        NetMgr.I.sendMessage(ProtoId.C2SGetBattlePrize_ID, data);
    }

    /** 接受奖励广播接口 */
    private onS2CPrizeReport(data: S2CPrizeReport) {
        // console.log('--S2CPrizeReport_ID-', data);
        this.doPrizeReportData(data);
    }

    /** 处理奖励数据 */
    private doPrizeReportData(data: S2CPrizeReport) {
        if (data.Type === BattleType.Sweep) {
            // 扫荡数据不需要保存 需要弹窗就直接弹
            this.onOpenBattleResultView(data);
            return;
        }
        const model = ModelMgr.I.BattleResultModel;
        model.saveBattlePrizeReport(data);
    }
    /** 打开战斗结束奖励弹窗 */
    private onOpenBattleResultView(data: S2CPrizeReport) {
        // const vo = this.getBattleRewardVO(data);
        // const vId = ModelMgr.I.BattleResultModel.getBattleViewByType(data);
        WinMgr.I.open(ViewConst.BattleSettleWin, data);
    }

    public testOpen(d: S2CPrizeReport): void {
        this.onOpenBattleResultView(d);
    }

    // /** 结算界面数据结构 */
    // private getBattleRewardVO(data: S2CPrizeReport): IBattleReward {
    //     const model = ModelMgr.I.BattleResultModel;
    //     const vo: IBattleReward = {
    //         // 头部标题部分
    //         titleResPath: model.getTitleResPath(data.Type),
    //         handleTitle: (node: cc.Node) => {
    //             const ani = node.getComponent(sp.Skeleton);
    //             // 执行动画播放
    //             if (ani) {
    //                 ani.setAnimation(0, 'animation', false);
    //                 ani.setCompleteListener(() => {
    //                     ani.setAnimation(0, 'animation2', true);
    //                 });
    //             }
    //             // 标题不包含动画
    //         },
    //         // 星星
    //         starNum: data.Star,
    //         // 扩展节点
    //         exPath: model.getExpath(data.FBType, data.Type === BattleType.Sweep),
    //         handleEx: (node: cc.Node) => {
    //             node.getComponent(BattleRewardExBase).setData(data);
    //         },
    //         // 提示信息
    //         tip: model.getTipString(data.Type, data.FBType),
    //     };
    //     return vo;
    // }

    // /**
    //  * 打开一个 战斗结束奖励弹窗
    //  * @param rewards 奖励物品
    //  * @param conf 页面参数 详细看 IBattleReward
    //  */
    // public openRewardView(rewards: string | ItemData[] | ItemModel[], conf: IBattleReward): void {
    //     WinMgr.I.open(ViewConst.BattleRewardView, rewards, conf);
    // }
}
