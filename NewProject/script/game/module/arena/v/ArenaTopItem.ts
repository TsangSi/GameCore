/*
 * @Author: myl
 * @Date: 2022-07-21 11:55:36
 * @Description:
 *
 */
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import { UtilPath } from '../../../base/utils/UtilPath';
import { BattleCommon } from '../../../battle/BattleCommon';
import { ViewConst } from '../../../const/ViewConst';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import { EBattleType } from '../../battleResult/BattleResultConst';
import { RoleInfo } from '../../role/RoleInfo';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class ArenaTopItem extends cc.Component {
    @property(cc.Node)
    private NdBody: cc.Node = null;

    @property(DynamicImage)
    private SprRank: DynamicImage = null;

    @property(cc.Node)
    private btnChallenge: cc.Node = null;

    @property(cc.Label)
    private LabUInfo: cc.Label = null;

    @property(cc.Label)
    private LabPower: cc.Label = null;

    protected start(): void {
        // [3]
        UtilGame.Click(this.btnChallenge, () => {
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
        }, this);
    }

    private _data: ArenaRole = null;
    public setData(data: ArenaRole): void {
        this._data = data;
        const rankPath = UtilPath.rankPath(data.Rank);
        this.SprRank.loadImage(rankPath, 1, true);
        this.NdBody.destroyAllChildren();
        this.NdBody.removeAllChildren();
        if (data.Robot) {
            // 基础时装
            const entity = EntityUiMgr.I.createRobotEntity(this.NdBody, UtilNum.RandomInt(1, 3));
            entity.setTitleAnim(10001, 1.4);
        } else {
            const base = EntityUiMgr.I.createAttrEntity(this.NdBody, {
                isShowTitle: true,
                resType: ANIM_TYPE.ROLE,
                isPlayUs: false,
            }, { A: data.IntAttr, B: data.StrAttr });
            base.setTitleScale(1.4);
            // roleBase.setTitleAnim(10001, 1);
        }

        const roleInfo: RoleInfo = new RoleInfo({ A: data.IntAttr, B: data.StrAttr });

        // this.labName.string = role.info.getAreaNick(nickConfig, false);
        this.LabUInfo.string = roleInfo.getAreaNick(NickShowType.ArenaNick, false);
        this.LabPower.string = roleInfo.FightValue;
        this.btnChallenge.active = RoleMgr.I.Rank <= 100 && data.UserId !== RoleMgr.I.info.userID;
        // 玩家模型信息未接入
    }
    public setBodyScale(scale: number): void {
        // this.NdBody.setScale(cc.v2(scale, scale));
        this.NdBody.scale = scale;
    }
}
