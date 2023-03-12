/*
 * @Author: myl
 * @Date: 2023-02-21 14:10:53
 * @Description:
 */
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilHead from '../../../base/utils/UtilHead';
import { UtilPath } from '../../../base/utils/UtilPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class FamilyPatriRankItem extends cc.Component {
    @property(cc.Label)// 名称
    private LabName: cc.Label = null;
    @property(cc.Label)// 战力
    private LabPower: cc.Label = null;
    @property(cc.Label)// 最高伤害
    private LabDamage: cc.Label = null;

    @property(cc.Label)// 排行
    private LabRank: cc.Label = null;
    @property(DynamicImage)// 排行
    private DynamicRank: DynamicImage = null;

    @property(cc.Sprite)// 玩家头像
    private SprHeadIcon: cc.Sprite = null;

    @property(cc.Sprite)// 玩家头像背景
    private SprHeadFrame: cc.Sprite = null;

    public setData(data: FamilyPatriHurtRank): void {
        console.log(data);

        this.LabName.string = data.Name;
        this.LabPower.string = UtilNum.ConvertFightValue(data.FightValue);
        this.LabDamage.string = UtilNum.Convert(data.Hurt);

        UtilHead.setHead(data.Head, this.SprHeadIcon, data.HeadFrame, this.SprHeadFrame);

        if (data.Rank <= 3) {
            this.LabRank.node.active = false;
            this.DynamicRank.node.active = true;
            // 排行路径
            const path = UtilPath.rankPath(data.Rank);
            this.DynamicRank.pngPath(path);
        } else {
            this.DynamicRank.node.active = false;
            this.LabRank.node.active = true;
            this.LabRank.string = `${data.Rank}`;
        }
    }
}
