import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilHead from '../../../base/utils/UtilHead';
import { UtilPath } from '../../../base/utils/UtilPath';
import { RoleInfo } from '../../role/RoleInfo';

const { ccclass, property } = cc._decorator;

/** 世家副本-红包里的排行榜 */
@ccclass
export class FamilyRedPackItem extends cc.Component {
    @property(cc.Label)// 名称
    private LabName: cc.Label = null;

    @property(cc.Label) // 领取
    private LabNum: cc.Label = null;

    @property(DynamicImage)// 排行榜
    private SprRank: DynamicImage = null;

    @property(cc.Sprite)// 玩家头像
    private SprHeadIcon: cc.Sprite = null;

    @property(cc.Sprite)// 玩家头像背景
    private SprHeadFrame: cc.Sprite = null;

    public setData(data: RedPacketRank): void {
        const userInfo = data.BaseUserInfo;
        const roleInfo = new RoleInfo(userInfo);

        UtilHead.setHead(roleInfo.d.HeadIcon, this.SprHeadIcon, roleInfo.d.HeadFrame, this.SprHeadFrame);

        this.LabName.string = `S${roleInfo.d.ShowAreaId}.${roleInfo.d.Nick}`;// 名称
        // 排名
        const rankPath = UtilPath.rankPath(data.Rank);
        this.SprRank.loadImage(rankPath, 1, true);

        this.LabNum.string = `x${data.RedNum}`;
    }
}
