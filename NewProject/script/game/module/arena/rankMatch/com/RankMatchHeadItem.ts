/*
 * @Author: zs
 * @Date: 2023-01-10 18:21:09
 * @Description:
 *
 */
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage, ImageType } from '../../../../base/components/DynamicImage';
import Progress from '../../../../base/components/Progress';
import { NickShowType } from '../../../../base/utils/UtilGame';
import UtilHead from '../../../../base/utils/UtilHead';
import ModelMgr from '../../../../manager/ModelMgr';
import { RoleInfo } from '../../../role/RoleInfo';

const { ccclass, property } = cc._decorator;
@ccclass
export class RankMatchHeadItem extends BaseCmp {
    @property(cc.Sprite)
    private SpriteIcon: cc.Sprite = null;
    @property(cc.Sprite)
    private SpriteRank: cc.Sprite = null;
    @property(DynamicImage)
    private SpriteFrame: DynamicImage = null;
    @property(DynamicImage)
    private SpriteLevel: DynamicImage = null;
    @property(Progress)
    private Progress: Progress = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelLevelName: cc.Label = null;
    @property(cc.Label)
    private LabelScore: cc.Label = null;

    public setData(index: number): void {
        const rank = index + 1;
        const rankResFix = UtilNum.FillZero(rank, 2);
        const player = ModelMgr.I.RankMatchModel.getTopPlayer(rank);
        UtilCocos.LoadSpriteFrameRemote(this.SpriteRank, `texture/com/img/com_img_paiming_${rankResFix}`);
        this.SpriteFrame.loadImage(`texture/rankMatch/img_pws_txd_${rankResFix}`, ImageType.PNG, true);
        if (player) {
            // 有玩家
            this.LabelName.string = player.getAreaNick(NickShowType.ArenaNick);
            // 玩家头像信息未接入
            this.SpriteIcon.node.active = true;
            UtilHead.setHead(player.d.HeadIcon, this.SpriteIcon, undefined, undefined, undefined, false);
            this.LabelScore.string = `${player.d.RankMatchScore}`;
            // this.LabelRank.string = `${player.d.RankMatchRank}`;
            const cfgCur = ModelMgr.I.RankMatchModel.getCfgPos(player.d.RankMatchScore);
            const cfgNext = ModelMgr.I.RankMatchModel.getCfgPosNext(player.d.RankMatchScore);
            this.LabelLevelName.string = cfgCur?.Name || '';
            const iconResFix = UtilNum.FillZero(cfgCur?.Icon || 1, 2);
            this.SpriteLevel.loadImage(`texture/rankMatch/icon_pws_sdw_${iconResFix}`, ImageType.PNG, true);
            this.Progress.node.active = true;
            if (cfgNext) {
                this.Progress.updateProgress(player.d.RankMatchScore - cfgCur.GoalMin, cfgNext.GoalMin - cfgCur.GoalMin, false);
            } else {
                const cfgLast = ModelMgr.I.RankMatchModel.getCfgPosLast(player.d.RankMatchScore);
                this.Progress.updateProgress(player.d.RankMatchScore - cfgLast.GoalMin, cfgCur.GoalMin - cfgLast.GoalMin);
            }
            this.SpriteLevel.node.active = true;
            // this.SpriteFrame.node.active = true;
        } else {
            // this.SpriteFrame.node.active = false;
            this.LabelName.string = i18n.tt(Lang.com_noman_is);
            this.LabelScore.string = '';
            this.LabelLevelName.string = '';
            this.SpriteLevel.node.getComponent(cc.Sprite).spriteFrame = null;
            this.SpriteIcon.node.active = false;
            this.Progress.node.active = false;
            this.SpriteLevel.node.active = false;
        }
    }
}
