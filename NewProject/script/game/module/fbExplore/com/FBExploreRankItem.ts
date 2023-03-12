import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import { NickShowType } from '../../../base/utils/UtilGame';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleInfo } from '../../role/RoleInfo';
import { EFBExploreType } from '../FBExploreConst';

/*
 * @Author: zs
 * @Date: 2023-02-02 17:09:20
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class FBExploreRankItem extends BaseCmp {
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelLevel: cc.Label = null;
    @property(cc.Label)
    private LabelStage: cc.Label = null;
    @property(DynamicImage)
    private SpriteRank: DynamicImage = null;
    @property(cc.Label)
    private LabelRank: cc.Label = null;
    public setData(type: EFBExploreType, data: RankSimpleData): void {
        this.LabelName.string = RoleInfo.GetAreaNick(NickShowType.ArenaNick, data.PlayerInfo.Name, data.PlayerInfo.ShowAreaId);
        const cfg = ModelMgr.I.FBExploreModel.getCfg(type, data.SortValue);
        if (cfg) {
            this.LabelLevel.string = `${cfg.Level}`;
            this.LabelStage.string = `${cfg.Part}-${cfg.Stage}`;
        }
        /** 是否前三名 */
        const isTopThree = data.R <= 3;
        this.LabelRank.node.parent.active = !isTopThree;
        this.SpriteRank.node.active = isTopThree;
        if (isTopThree) {
            this.SpriteRank.loadImage(`texture/com/img/com_img_paiming_${UtilNum.FillZero(data.R, 2)}`, ImageType.PNG, true);
        } else {
            this.LabelRank.string = `${data.R}`;
        }
    }
}
