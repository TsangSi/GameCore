/*
 * @Author: kexd
 * @Date: 2023-01-17 11:25:12
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\v\EscortRewardWin.ts
 * @Description: 押镖奖励
 *
 */

import WinMgr from '../../../../app/core/mvc/WinMgr';
import ListView from '../../../base/components/listview/ListView';
import { WinCmp } from '../../../com/win/WinCmp';
import { ViewConst } from '../../../const/ViewConst';
import { DynamicImage } from '../../../base/components/DynamicImage';
import RecordItem from '../com/RecordItem';
import ControllerMgr from '../../../manager/ControllerMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { EscortState, ICarMsg } from '../EscortConst';
import ModelMgr from '../../../manager/ModelMgr';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilColorFull } from '../../../base/utils/UtilColorFull';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemQuality, ItemWhere } from '../../../com/item/ItemConst';
import { RoleInfo } from '../../role/RoleInfo';
import UtilItemList from '../../../base/utils/UtilItemList';
import ItemModel from '../../../com/item/ItemModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class EscortRewardWin extends WinCmp {
    @property(DynamicImage)
    private SprBoard: DynamicImage = null;
    @property(cc.Label)
    private LabBoard: cc.Label = null;
    @property(cc.Node)
    private NdReward: cc.Node = null;
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Node)
    private BtnGet: cc.Node = null;
    @property(cc.Node)
    private NdDesc: cc.Node = null;
    @property(cc.Node)
    private NdNoLog: cc.Node = null;

    private _carMsg: ICarMsg = null;

    protected start(): void {
        super.start();
        this.clk();
        this.addE();
    }

    private addE() {
        //
    }

    private remE() {
        //
    }

    public init(args: unknown[]): void {
        this.uptUI();
    }

    private clk() {
        UtilGame.Click(this.BtnGet, () => {
            ControllerMgr.I.EscortController.reqEscortGetFinishReward();
            this.onClose();
        }, this);
    }

    private uptUI() {
        const offy: number[] = [30, 12, 9, 0, 0];
        const carData = ModelMgr.I.EscortModel.myCar();
        if (!carData) return;
        this._carMsg = {
            carData,
            cfgEscort: ModelMgr.I.EscortModel.CfgEscort.getValueByKey(carData.QualityId),
            info: new RoleInfo(carData.UserShowInfo),
            canRob: ModelMgr.I.EscortModel.canRob(carData),
            state: EscortState.Finish,
        };

        // 镖车
        this.SprBoard.loadImage(`texture/escort/img_yslc_${this._carMsg.cfgEscort.Img}`, 1, true);
        this.SprBoard.node.y = offy[carData.QualityId - 1] || 0;
        this.LabBoard.string = this._carMsg.cfgEscort.Name;
        UtilColorFull.resetMat(this.LabBoard);
        if (this._carMsg.cfgEscort.Quality === ItemQuality.COLORFUL) {
            UtilColorFull.setColorFull(this.LabBoard, false);
        } else {
            this.LabBoard.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(this._carMsg.cfgEscort.Quality, true));
        }
        // 奖励
        const arr: ItemModel[] = [];
        for (let i = 0; i < carData.RewardInfo.length; i++) {
            const itemModel = UtilItem.NewItemModel(carData.RewardInfo[i].ItemId, carData.RewardInfo[i].ItemNum);
            arr.push(itemModel);
        }
        UtilItemList.ShowItemArr(this.NdReward, arr, { option: { where: ItemWhere.OTHER, needNum: true } });
        this.ListView.setNumItems(carData.RobLog.length);
        //
        this.NdDesc.active = carData.UseAmulet > 0;
        this.NdNoLog.active = carData.RobLog.length === 0;
        // 红点 (不需双倍时间，不用处理，肯定是显示)
        // const ndRed = this.BtnGet.getChildByName('NdRed');
        // const isDoubelTime: boolean = ModelMgr.I.EscortModel.isInDoubleTime();
        // ndRed.active = isDoubelTime;
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const item = node.getComponent(RecordItem);
        if (item) {
            item.getComponent(RecordItem).setData(this._carMsg.carData.RobLog[idx]);
        }
    }

    private onClose() {
        WinMgr.I.close(ViewConst.EscortRewardWin);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
