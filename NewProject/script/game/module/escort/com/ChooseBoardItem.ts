/*
 * @Author: kexd
 * @Date: 2023-01-17 10:04:15
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\com\ChooseBoardItem.ts
 * @Description:
 *
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilItemList from '../../../base/utils/UtilItemList';
import { ItemQuality, ItemWhere } from '../../../com/item/ItemConst';
import { RoleMgr } from '../../role/RoleMgr';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilColorFull } from '../../../base/utils/UtilColorFull';
import UtilItem from '../../../base/utils/UtilItem';
import ModelMgr from '../../../manager/ModelMgr';
import ItemModel from '../../../com/item/ItemModel';

const { ccclass, property } = cc._decorator;
@ccclass
export default class ChooseBoardItem extends BaseCmp {
    @property(cc.Node)
    private NdReward: cc.Node = null;
    @property(cc.Node)
    private NdSelect: cc.Node = null;

    // 下面是选择镖车里多的
    @property(DynamicImage)
    private SprBoard: DynamicImage = null;
    @property(cc.Label)
    private LabBoard: cc.Label = null;

    private _cfg: Cfg_Escort = null;

    protected start(): void {
        super.start();
    }

    /**
     * 展示
     * @param cfg Cfg_Escort
     */
    public setData(cfg: Cfg_Escort, isDouble: boolean, useLing: boolean): void {
        const offy: number[] = [-18, -16, -15, -14, -12];
        const scale: number[] = [0.7, 0.7, 0.7, 0.6, 0.6];

        this._cfg = cfg;

        // 镖车
        this.SprBoard.loadImage(`texture/escort/img_yslc_${cfg.Img}`, 1, true);
        const index: number = cfg.Id - 1;
        this.SprBoard.node.y = offy[index] || -15;
        this.SprBoard.node.scale = scale[index] || 0.6;

        this.LabBoard.string = cfg.Name;
        UtilColorFull.resetMat(this.LabBoard);
        if (cfg.Quality === ItemQuality.COLORFUL) {
            UtilColorFull.setColorFull(this.LabBoard, false);
        } else {
            this.LabBoard.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(cfg.Quality, true));
        }
        // 选中
        this.NdSelect.active = ModelMgr.I.EscortModel.qualityId === cfg.Id;
        // 奖励
        this.uptReward(isDouble, useLing);
    }

    public uptReward(isDouble: boolean, useLing: boolean): void {
        const arr: ItemModel[] = ModelMgr.I.EscortModel.getReward(this._cfg.Quality, RoleMgr.I.d.Level, isDouble, useLing);
        UtilItemList.ShowItemArr(this.NdReward, arr, { option: { where: ItemWhere.OTHER, needNum: true, numScale: 1.12 } });
    }
}
