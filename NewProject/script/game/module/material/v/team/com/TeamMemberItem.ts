import { UtilNum } from '../../../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../../../app/core/mvc/view/BaseCmp';
import { INickInfoConfig, NickShowType, UtilGame } from '../../../../../base/utils/UtilGame';
import UtilHead from '../../../../../base/utils/UtilHead';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import { RoleInfo } from '../../../../role/RoleInfo';
import { RoleMgr } from '../../../../role/RoleMgr';

/*
 * @Author: zs
 * @Date: 2022-11-15 11:39:30
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\com\TeamMemberItem.ts
 * @Description:
 *
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class TeamMemberItem extends BaseCmp {
    @property(cc.Node)
    private HeadFrame: cc.Node = null;
    @property(cc.Node)
    private NodeNone: cc.Node = null;
    @property(cc.Sprite)
    private SpriteHead: cc.Sprite = null;
    @property(cc.Sprite)
    private SpriteIcon: cc.Sprite = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelFv: cc.Label = null;
    @property(cc.Node)
    private SpriteCap: cc.Node = null;
    public setData(teamMember: TeamViewPlayer, capId?: number): void {
        if (teamMember) {
            this.NodeNone.active = false;
            this.HeadFrame.active = true;
            this.LabelName.string = RoleInfo.GetAreaNick(NickShowType.ArenaNick, teamMember.Nick, teamMember.AreaId);
            this.LabelFv.string = UtilNum.ConvertFightValue(teamMember.Fight);
            UtilHead.setHead(teamMember.HeadIcon, this.SpriteIcon, teamMember.HeadFrame, this.SpriteHead);
            this.SpriteCap.active = teamMember.UserId === capId;
        } else {
            this.NodeNone.active = true;
            this.HeadFrame.active = false;
        }
    }
}
