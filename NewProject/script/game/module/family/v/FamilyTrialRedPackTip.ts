import { EventClient } from '../../../../app/base/event/EventClient';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import FamilyModel from '../FamilyModel';
import { FamilyRedPackItem } from './FamilyRedPackItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class FamilyTrialRedPackTip extends WinBase {
    @property(cc.Node)
    private NdSprMask: cc.Node = null;

    @property(cc.Node)// 左
    private BtnLeft: cc.Node = null;
    @property(cc.Node)// 右
    private BtnRight: cc.Node = null;

    @property(ListView)
    private list: ListView = null;

    @property(cc.Node)
    private NdOpenState: cc.Node = null;
    @property(cc.Node)
    private NdCloseState: cc.Node = null;

    // close
    @property(cc.Label)
    private LabCloseTitle: cc.Label = null;
    @property(cc.Label)
    private LabCloseNum: cc.Label = null;

    @property(cc.Node)
    private BtnOpen: cc.Node = null;

    // open
    @property(cc.Label)
    private LabTitleOpen: cc.Label = null;
    @property(cc.Label)
    private LabOpenNum: cc.Label = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => this.close(), this, { scale: 1 });

        UtilGame.Click(this.BtnLeft, this._onNext, this, { customData: 0 });
        UtilGame.Click(this.BtnRight, this._onNext, this, { customData: 1 });

        UtilGame.Click(this.BtnOpen, this._onBtnOpenClick, this);
    }

    private _onNext(e: any, idx: number): void {
        if (idx) {
            const trialIds: number[] = this.model.getCfgTrialHasRedPackTrial();// 所有有红包的关卡
            this._curSlectIdx++;
            if (this._curSlectIdx >= trialIds.length - 1) {
                this._curSlectIdx = trialIds.length - 1;
            }
        } else {
            this._curSlectIdx--;
            if (this._curSlectIdx <= 0) {
                this._curSlectIdx = 0;
            }
        }
        this._initRedPackState();
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Family.FamilyRedPacketReward, this._onFamilyRedPacketReward, this);
        EventClient.I.off(E.Family.FamilyRedPacketRankList, this._onFamilyRedPacketRankList, this);
    }
    private _curSlectIdx: number;// 当前选中第几个红包
    private model: FamilyModel;
    public init(params: any): void {
        this.model = ModelMgr.I.FamilyModel;
        EventClient.I.on(E.Family.FamilyRedPacketRankList, this._onFamilyRedPacketRankList, this);

        EventClient.I.on(E.Family.FamilyRedPacketReward, this._onFamilyRedPacketReward, this);
        this._curSlectIdx = 0;// 默认选中第0个

        const trialIds: number[] = this.model.getCfgTrialHasRedPackTrial();// 所有有红包的关卡
        for (let i = 0; i < trialIds.length; i++) {
            const tid: number = trialIds[i];// 关卡
            if (!this.model.isOpenTrialRedPack(tid)) { // 当前是否打开
                this._curSlectIdx = i;// 返回没打开的这个
                break;
            }
        }
        ControllerMgr.I.FamilyController.reqC2STrialCopyRedPacketRank();
    }

    /** 打开红包 */
    private _onBtnOpenClick(): void {
        const trialIds: number[] = this.model.getCfgTrialHasRedPackTrial();// 所有有红包的关卡
        const tid: number = trialIds[this._curSlectIdx];// 关卡

        const trialId: number = ModelMgr.I.FamilyModel.getTrialId();// 当前正在挑战的关卡

        if (trialId > tid) {
            ControllerMgr.I.FamilyController.reqC2STrialCopyRedPacket(tid);
        } else {
            const str = `${i18n.tt(Lang.family_passWhich)}${tid}${i18n.tt(Lang.family_stageCanOpen)}`;
            MsgToastMgr.Show(str);
        }
    }

    /** 红包排行版列表 */
    private _onFamilyRedPacketRankList(): void {
        // 1 首先从配置表 拿到整个所有的
        // this._curSlectIdx = 0;// 默认选中第0个

        // const trialIds: number[] = this.model.getCfgTrialHasRedPackTrial();// 所有有红包的关卡
        // for (let i = 0; i < trialIds.length; i++) {
        //     const tid: number = trialIds[i];// 关卡
        //     if (!this.model.isOpenTrialRedPack(tid)) { // 当前是否打开
        //         this._curSlectIdx = i;// 返回没打开的这个
        //         break;
        //     }
        // }
        this._initRedPackState();// 红包状态
    }

    /** 红包打开成功 */
    private _onFamilyRedPacketReward(): void {
        ControllerMgr.I.FamilyController.reqC2STrialCopyRedPacketRank();// 打开红包重新请求排行榜信息
        this._initRedPackState();// 红包状态
    }

    // 左右按钮
    private _initLeftRightBtn(): void {
        const trialIds: number[] = this.model.getCfgTrialHasRedPackTrial();// 所有有红包的关卡
        if (this._curSlectIdx === 0) {
            this.BtnLeft.active = false;
            this.BtnRight.active = true;
        } else if (this._curSlectIdx === trialIds.length - 1) {
            this.BtnLeft.active = true;
            this.BtnRight.active = false;
        } else {
            this.BtnLeft.active = true;
            this.BtnRight.active = true;
        }
    }

    /** 根据当前是否打开 显示红包状态 */
    private _rewards: RedPacketRank[];
    private _initRedPackState(): void {
        // 左右按钮
        this._initLeftRightBtn();

        // 判断当前是否打开
        const trialIds: number[] = this.model.getCfgTrialHasRedPackTrial();// 所有有红包的关卡
        const tid = trialIds[this._curSlectIdx];
        console.log('当前打开的红包');
        console.log(tid);

        const isOpen: boolean = this.model.isOpenTrialRedPack(tid);
        if (isOpen) {
            this.NdOpenState.active = true;
            this.NdCloseState.active = false;

            this.LabTitleOpen.string = `${i18n.tt(Lang.arena_di)}${tid}${i18n.tt(Lang.family_stageRedPack)}`;// `第${tid}层首领红包`
            // 从领取列表里获取
            const item: CommonType2 = ModelMgr.I.FamilyModel.getTrialRedPackInfo(tid);
            if (item) {
                this.LabOpenNum.string = `${item.C}`;
            } else {
                this.LabOpenNum.string = ``;
            }
            // 排行榜
            const arr: RedPacketRank[] = this.model.getRedPackRankList(tid);
            this._rewards = arr;
            const len = arr.length;
            this.list.setNumItems(len, 0);
            this.list.scrollTo(0);
        } else {
            this.NdOpenState.active = false;
            this.NdCloseState.active = true;
            // 1 标题
            this.LabCloseTitle.string = `${i18n.tt(Lang.family_passWhich)}${tid}${i18n.tt(Lang.family_stageCanOpen)}`;// `通关第${tid}层首领可打开`;
            // 2 红包上下限
            const upDownLimit: string = this.model.getCfgTrialCopyRedSection1();
            const arrStr: string[] = upDownLimit.split('|');
            this.LabCloseNum.string = `${arrStr[0]}~${arrStr[1]}`;
        }
    }

    private onScrollEvent(node: cc.Node, index: number): void { //
        const faitem: FamilyRedPackItem = node.getComponent(FamilyRedPackItem);
        if (this._rewards?.length) {
            faitem.setData(this._rewards[index]);
        }
    }
}
