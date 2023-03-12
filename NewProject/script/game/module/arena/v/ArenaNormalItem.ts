/*
 * @Author: hrd
 * @Date: 2022-07-21 11:55:36
 * @Description:
 */
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { INickInfoConfig, NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import UtilHead from '../../../base/utils/UtilHead';
import { BattleCommon } from '../../../battle/BattleCommon';
import { BattleMgr } from '../../../battle/BattleMgr';
import { GuideMgr } from '../../../com/guide/GuideMgr';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { EBattleType } from '../../battleResult/BattleResultConst';
import { RoleInfo } from '../../role/RoleInfo';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class ArenaNormalItem extends cc.Component {
    @property(cc.Label)
    private labRank: cc.Label = null;

    @property(cc.Label)
    private labUName: cc.Label = null;

    @property(cc.Label)
    private labPower: cc.Label = null;

    // 秒杀
    @property(cc.Sprite)
    private sprSeckill: cc.Sprite = null;
    @property(cc.Sprite)
    private sprIcons: cc.Sprite = null;
    @property(cc.Sprite)
    private sprFrame: cc.Sprite = null;

    @property(cc.Node)
    private NdChallenge: cc.Node = null;

    @property(cc.Sprite)
    private sprBg: cc.Sprite = null;

    private _data: ArenaRole = null;

    public start(): void {
        UtilGame.Click(this.NdChallenge, () => {
            if (RoleMgr.I.d.ArenaTimes <= 0) {
                MsgToastMgr.Show(i18n.tt(Lang.arena_challenge_time_unenough));
                return;
            }
            if (!this._data) {
                console.log('未获取到玩家信息');
                return;
            }
            WinMgr.I.setViewStashParam(ViewConst.ArenaWin, [0]);

            BattleCommon.I.enter(EBattleType.Arena, {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                TargetId: this._data.UserId,
                TargetRank: this._data.Rank,
                Kill: this._data.Kill,
            });
            // ControllerMgr.I.ArenaController.fightPlayer({
            //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            //     TargetId: this._data.UserId,
            //     TargetRank: this._data.Rank,
            //     Kill: this._data.Kill,
            // });
            // WinMgr.I.open(ViewConst.ArenaRewardView, ArenaResultTypeEnum.Victory);
        }, this);

        UtilGame.Click(this.sprIcons.node, () => {
            // 点击头像
            if (this._data.Robot) {
                MsgToastMgr.Show(i18n.tt(Lang.arena_click_robot));
            } else {
                MsgToastMgr.Show('个人信息查看尚未开发');
            }
        }, this, { scale: 1 });
    }

    private _kill = false;
    public setData(data: ArenaRole, guidId?: number): void {
        this._data = data;
        const roleInfo: RoleInfo = new RoleInfo({ A: data.IntAttr, B: data.StrAttr });
        this.labPower.string = roleInfo.FightValue;

        this.labUName.string = roleInfo.getAreaNick(NickShowType.ArenaNick, false);
        this.labRank.string = `${i18n.tt(Lang.arena_rank)}:${data.Rank}`;
        this.sprSeckill.node.active = this._data.Kill === 1;
        // 玩家头像信息未接入
        UtilHead.setHead(roleInfo.d.HeadIcon, this.sprIcons, roleInfo.d.HeadFrame, this.sprFrame);
        if (guidId) {
            GuideMgr.I.bindScript(guidId, this.NdChallenge, this.node.parent.parent);
        }
    }
}
