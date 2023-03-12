/*
 * @Author: kexd
 * @Date: 2022-11-04 20:52:10
 * @FilePath: \SanGuo2.4\assets\script\game\module\beaconWar\com\BeaconPlayerItem.ts
 * @Description: 烽火连城-人物头像
 *
 */

import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import UtilHead from '../../../base/utils/UtilHead';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleInfo } from '../../role/RoleInfo';
import { RoleMgr } from '../../role/RoleMgr';
import { EBeaconState } from '../BeaconWarConst';

const { ccclass, property } = cc._decorator;
@ccclass
export default class BeaconPlayerItem extends BaseCmp {
    @property(cc.Sprite)
    private SprHead: cc.Sprite = null;
    @property(cc.Sprite)
    private SprHeadBg: cc.Sprite = null;
    @property(cc.Node)
    private NdBelong: cc.Node = null;
    @property(cc.Label)
    private LabRank: cc.Label = null;
    @property(cc.Label)
    private LabScore: cc.Label = null;
    @property(cc.Label)
    private LabName: cc.Label = null;

    private _bossData: BossHomeRankData = null;

    protected start(): void {
        super.start();

        //
        UtilGame.Click(this.node, () => {
            if (!this._bossData) return;
            if (this._bossData.UserId === RoleMgr.I.info.userID) {
                MsgToastMgr.Show(i18n.tt(Lang.beaconWar_fightme));
                return;
            }
            if (RoleMgr.I.d.Map_State === EBeaconState.Die) {
                MsgToastMgr.Show(i18n.tt(Lang.beaconWar_cd));
                return;
            }
            // 玩家数据
            const data = ModelMgr.I.BeaconWarModel.playerInfo(this._bossData.UserId, true);
            if (data) {
                // if (data.d.Map_State === EBeaconState.Die) {
                //     MsgToastMgr.Show(i18n.tt(Lang.beaconWar_playerunAlive));
                // } else {
                const bossHomeId: number = ModelMgr.I.BeaconWarModel.curBossHomeId;
                ControllerMgr.I.BeaconWarController.reqGetBossHomePlayerPos(bossHomeId, this._bossData.UserId);
                // }
            }
        }, this);
    }

    public setData(data: BossHomeRankData, iRank: number, isOwer: boolean): void {
        this._bossData = data;
        this.NdBelong.active = isOwer;
        this.LabRank.string = `${iRank + 1}`;
        this.LabScore.string = `${data.Damage}`;
        // 是主玩家
        if (data.UserId === RoleMgr.I.info.userID) {
            this.LabName.string = UtilString.GetLimitStr(RoleMgr.I.info.getAreaNick(NickShowType.Nick), 6);
            UtilHead.setHead(RoleMgr.I.d.HeadIcon, this.SprHead, RoleMgr.I.d.HeadFrame, this.SprHeadBg);
        } else {
            const info: RoleInfo = ModelMgr.I.BeaconWarModel.playerInfo(data.UserId, false);
            if (info) {
                this.LabName.string = UtilString.GetLimitStr(info.getAreaNick(NickShowType.Nick), 6);
                UtilHead.setHead(info.d.HeadIcon, this.SprHead, info.d.HeadFrame, this.SprHeadBg);
            }
        }
    }
}
