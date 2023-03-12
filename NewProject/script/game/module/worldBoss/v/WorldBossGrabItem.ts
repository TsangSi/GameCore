/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: dcj
 * @Date: 2022-08-31 11:06:45
 * @Description:
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilHead from '../../../base/utils/UtilHead';
import { UtilPath } from '../../../base/utils/UtilPath';
import { BattleCommon } from '../../../battle/BattleCommon';
import { EBattleType } from '../../battleResult/BattleResultConst';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class WorldBossGrabItem extends cc.Component {
    @property(cc.Node)
    private NdPre: cc.Node = null;
    @property(cc.Node)
    private rankLab: cc.Node = null;
    @property(cc.Label)
    private powerLab: cc.Label = null;
    @property(cc.Label)
    private playerName: cc.Label = null;
    @property(cc.Node)
    private familyName: cc.Node = null;
    @property(cc.Sprite)
    private playerHead: cc.Sprite = null;
    @property(cc.Sprite)
    private playerIcon: cc.Sprite = null;
    @property(cc.Label)
    private IntegralLabel: cc.Label = null;
    @property(cc.Node)
    private GrabBtn: cc.Node = null;

    private _data: WorldBossUserRankData = cc.js.createMap(true);
    protected start(): void {
        UtilGame.Click(this.GrabBtn, this.GrabBtnHandle, this, { scale: 0.9 });
    }
    public GrabBtnHandle(): void {
        if (this._data.UserId === RoleMgr.I.info.userID) {
            MsgToastMgr.Show(i18n.tt(Lang.world_boss_grab_attack_self));
            return;
        }
        BattleCommon.I.enter(EBattleType.WorldBoss_PVP_DAYS, this._data.UserId);
    }

    public setData(_data: WorldBossUserRankData, index: number): void {
        this.updateItem(_data);
    }

    private updateItem(data: WorldBossUserRankData) {
        /** uint32 UserId = 1; //玩家Id
            uint32 R = 2; //排名
            string Name = 3; //昵称
            uint32 HeadFrame = 4; //头像框ID
            uint32 Head = 5; //头像ID
            uint32 Vip = 6; //vip等级
            string FamilyName = 7; //家族名称
            int64 FightValue = 8; //战力
            int64 Score = 9; //玩家积分
         */
        this._data = data;
        this.powerLab.string = UtilNum.ConvertFightValue(data.FightValue);
        this.playerName.string = data.Name;
        this.familyName.getComponent(cc.Label).string = data.FamilyName;
        this.familyName.active = data.FamilyName !== '';
        this.IntegralLabel.string = UtilNum.Convert(data.Score);
        UtilHead.setHead(data.Head, this.playerIcon, data.HeadFrame, this.playerHead);
        // 更新排名
        const rankSpr = this.NdPre.getComponent(DynamicImage);
        this.NdPre.active = false;
        this.rankLab.active = false;
        if (data.R <= 3) {
            this.NdPre.active = true;
            const rankPath = UtilPath.rankPath(data.R);
            // UtilCocos.LoadSpriteFrame(rankSpr, rankPath);
            rankSpr.loadImage(rankPath, 1, true);
        } else {
            this.rankLab.active = true;
            const rankL = this.rankLab.getComponent(cc.Label);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            rankL.string = data.R.toString();
        }

        this.updateBtn();
    }

    private updateBtn() {
        const btnbg = this.GrabBtn.getChildByName('btnBg');
        const btnL = this.GrabBtn.getChildByName('btnLabel');
        const GrabBtnLabel = btnL.getComponent(cc.Label);
        const isMyId = this._data.UserId === RoleMgr.I.info.userID;
        const txt = isMyId ? i18n.tt(Lang.world_boss_self) : i18n.tt(Lang.world_boss_grab_btn);
        GrabBtnLabel.string = txt;
        if (isMyId) {
            btnbg.active = false;
        }
    }
    protected onDestroy(): void {
        //
    }
}
