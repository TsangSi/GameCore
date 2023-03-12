/*
 * @Author: myl
 * @Date: 2022-08-01 17:51:56
 * @Description:
 */
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import { UtilPath } from '../../../base/utils/UtilPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class ArenaRankListItem extends cc.Component {
    @property(DynamicImage)
    private rank: DynamicImage = null;

    @property(cc.Label)
    private LabRank: cc.Label = null;
    @property(cc.Label)
    private LabNick: cc.Label = null;
    @property(cc.Label)
    private LabPower: cc.Label = null;

    @property(cc.Node)
    private bgNd: cc.Node = null;

    public setData(data: ArenaRankData, index: number): void {
        this.bgNd.active = index % 2 !== 0;

        if (index === 0 || index === 1 || index === 2) {
            this.rank.node.active = true;
            const path = UtilPath.rankPath(index + 1);
            this.rank.loadImage(path, 1, true);
        } else {
            this.rank.node.active = false;
        }

        this.LabRank.node.active = index > 2;
        this.LabRank.string = `${i18n.tt(Lang.arena_di)}${index + 1}${i18n.tt(Lang.arena_ming)}`;
        this.LabNick.string = `${UtilGame.ShowNick(data.AreaId, data.Nick)}`;
        this.LabPower.string = UtilNum.ConvertFightValue(data.FightValue);
    }
}
